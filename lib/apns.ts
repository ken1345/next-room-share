import { createPrivateKey, sign } from "node:crypto";
import { connect } from "node:http2";
import type { SupabaseClient } from "@supabase/supabase-js";

type Device = {
    installation_id: string;
    token: string;
    topic: string;
    environment: "development" | "production";
    updated_at: string;
};

type APNsCredentials = { keyID: string; teamID: string; privateKey: string };

function credentials(environment: Device["environment"]): APNsCredentials | undefined {
    const prefix = environment === "development" ? "APNS_SANDBOX" : "APNS_PRODUCTION";
    const keyID = process.env[`${prefix}_KEY_ID`];
    const teamID = process.env.APNS_TEAM_ID;
    const privateKey = process.env[`${prefix}_PRIVATE_KEY`];
    return keyID && teamID && privateKey ? { keyID, teamID, privateKey } : undefined;
}

const tokens = new Map<Device["environment"], { value: string; expiresAt: number }>();

function authorization(environment: Device["environment"], config: APNsCredentials): string {
    const cached = tokens.get(environment);
    if (cached && cached.expiresAt > Date.now()) return cached.value;
    const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
    const header = encode({ alg: "ES256", kid: config.keyID });
    const claims = encode({ iss: config.teamID, iat: Math.floor(Date.now() / 1000) });
    const data = `${header}.${claims}`;
    const signature = sign("sha256", Buffer.from(data), {
        key: createPrivateKey(config.privateKey.replace(/\\n/g, "\n")),
        dsaEncoding: "ieee-p1363",
    }).toString("base64url");
    const value = `bearer ${data}.${signature}`;
    tokens.set(environment, { value, expiresAt: Date.now() + 50 * 60_000 });
    return value;
}

function send(device: Device, threadID: string, credential: string): Promise<{ status: number; reason?: string; apnsID?: string }> {
    const host = device.environment === "development" ? "api.sandbox.push.apple.com" : "api.push.apple.com";
    const client = connect(`https://${host}`);
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => client.destroy(new Error("APNs request timed out")), 5_000);
        client.once("error", reject);
        client.once("close", () => clearTimeout(timer));
        const stream = client.request({
            ":method": "POST",
            ":path": `/3/device/${device.token}`,
            authorization: credential,
            "apns-topic": device.topic,
            "apns-push-type": "alert",
            "apns-expiration": String(Math.floor(Date.now() / 1000) + 3600),
            "content-type": "application/json",
        });
        let status = 0;
        let apnsID: string | undefined;
        let body = "";
        stream.setEncoding("utf8");
        stream.on("response", headers => {
            status = Number(headers[":status"]);
            const id = headers["apns-id"];
            if (typeof id === "string") apnsID = id;
        });
        stream.on("data", chunk => { body += chunk; });
        stream.once("error", error => {
            client.destroy();
            reject(error);
        });
        stream.once("end", () => {
            client.close();
            let reason: string | undefined;
            try { if (body) reason = JSON.parse(body).reason; } catch { /* Response body is optional. */ }
            resolve({ status, reason, apnsID });
        });
        stream.end(JSON.stringify({
            aps: { alert: { title: "ルームシェアMikke", body: "新しいメッセージが届きました。" }, sound: "default" },
            thread_id: threadID,
        }));
    });
}

export async function sendMessagePush(admin: SupabaseClient, sender: string, recipient: string, threadID: string, message: { id: number } | { content: string }) {
    if (!process.env.APNS_TEAM_ID || sender === recipient) return;

    const { data: settings, error: settingsError } = await admin.from("users")
        .select("push_notification").eq("id", recipient).maybeSingle();
    if (settingsError || !settings || settings.push_notification === false) return;

    const { data: blocks, error: blocksError } = await admin.from("user_blocks").select("blocker_id")
        .or(`and(blocker_id.eq.${sender},blocked_id.eq.${recipient}),and(blocker_id.eq.${recipient},blocked_id.eq.${sender})`)
        .limit(1);
    if (blocksError || blocks?.length) return;

    let messageID: number;
    if ("id" in message) {
        messageID = message.id;
    } else {
        const { data: storedMessage, error } = await admin.from("messages").select("id")
            .eq("thread_id", threadID).eq("sender_id", sender).eq("content", message.content)
            .gte("created_at", new Date(Date.now() - 120_000).toISOString())
            .order("id", { ascending: false }).limit(1).maybeSingle();
        if (error || !storedMessage) return;
        messageID = storedMessage.id;
    }

    const { data: devices, error: devicesError } = await admin.from("ios_push_devices")
        .select("installation_id,token,topic,environment,updated_at").eq("user_id", recipient);
    if (devicesError || !devices?.length) return;

    await Promise.all(devices.map(async (device: Device) => {
        const config = credentials(device.environment);
        if (!config) return;
        const target = { message_id: messageID, installation_id: device.installation_id };
        const { error: reservationError } = await admin.from("ios_push_deliveries").insert(target);
        if (reservationError) return; // An existing receipt prevents duplicate delivery.

        try {
            const result = await send(device, threadID, authorization(device.environment, config));
            const outcome = {
                messageId: messageID, environment: device.environment,
                status: result.status, apnsId: result.apnsID, reason: result.reason,
            };
            if (result.status === 200) {
                console.info("[APNs] Accepted", outcome);
                return;
            }
            if (result.status === 410) {
                await admin.from("ios_push_devices").delete().eq("installation_id", device.installation_id)
                    .eq("updated_at", device.updated_at);
            }
            console.warn("[APNs] Delivery rejected", outcome);
        } catch {
            console.warn("[APNs] Delivery connection failed");
        }
        await admin.from("ios_push_deliveries").delete().match(target);
    }));
}
