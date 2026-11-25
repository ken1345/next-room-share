import { createHash, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendMessagePush } from "@/lib/apns";

export const runtime = "nodejs";

function digest(value: string) {
    return createHash("sha256").update(value).digest();
}

export async function POST(request: Request) {
    const secret = process.env.MESSAGE_PUSH_WEBHOOK_SECRET;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!secret || !key || !url) return new Response(null, { status: 503 });
    if (!timingSafeEqual(digest(secret), digest(request.headers.get("x-message-push-secret") ?? ""))) {
        return new Response(null, { status: 401 });
    }

    const event = await request.json().catch(() => null);
    const id = event?.record?.id;
    if (event?.type !== "INSERT" || event.schema !== "public" || event.table !== "messages"
        || !Number.isSafeInteger(id) || id <= 0) {
        return new Response(null, { status: 400 });
    }

    const admin = createClient(url, key);
    const { data: message, error: messageError } = await admin.from("messages")
        .select("id, thread_id, sender_id").eq("id", id).maybeSingle();
    if (messageError) return new Response(null, { status: 503 });
    if (!message) return new Response(null, { status: 204 });

    const { data: thread, error: threadError } = await admin.from("threads")
        .select("host_id, seeker_id").eq("id", message.thread_id).maybeSingle();
    if (threadError) return new Response(null, { status: 503 });
    if (!thread) return new Response(null, { status: 204 });

    const recipient = message.sender_id === thread.host_id ? thread.seeker_id
        : message.sender_id === thread.seeker_id ? thread.host_id : null;
    if (!recipient) return new Response(null, { status: 204 });

    await sendMessagePush(admin, message.sender_id, recipient, message.thread_id, { id: message.id });
    return NextResponse.json({ success: true });
}
