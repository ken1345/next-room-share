import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function updateDevice(request: Request, remove: boolean) {
    const bearer = request.headers.get("authorization")?.match(/^Bearer (\S+)$/i)?.[1];
    if (!bearer) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
        console.error("[Push registration] Missing Supabase configuration");
        return NextResponse.json({ error: "Configuration unavailable" }, { status: 503 });
    }

    const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: { user }, error: authError } = await admin.auth.getUser(bearer);
    if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => null);
    if (!body || typeof body.installationId !== "string" || !uuid.test(body.installationId)) {
        return NextResponse.json({ error: "Invalid installation" }, { status: 400 });
    }

    if (remove) {
        const { error } = await admin.from("ios_push_devices").delete()
            .eq("installation_id", body.installationId).eq("user_id", user.id);
        return error ? NextResponse.json({ error: "Could not unregister device" }, { status: 503 }) : new NextResponse(null, { status: 204 });
    }

    if (typeof body.token !== "string" || !/^[a-f0-9]{32,512}$/.test(body.token) ||
        !["jp.roommikke.webapp", "jp.roommikke.webapp.preview"].includes(body.topic) ||
        !["development", "production"].includes(body.environment)) {
        return NextResponse.json({ error: "Invalid push registration" }, { status: 400 });
    }
    const { data: preferences, error: preferenceError } = await admin.from("users")
        .select("push_notification").eq("id", user.id).maybeSingle();
    if (preferenceError) {
        console.error("[Push registration] Preference lookup failed", preferenceError.code || "unknown");
        return NextResponse.json({ error: "Could not read preferences" }, { status: 503 });
    }
    if (preferences?.push_notification === false) return new NextResponse(null, { status: 204 });

    const { error } = await admin.from("ios_push_devices").upsert({
        installation_id: body.installationId,
        user_id: user.id,
        token: body.token,
        topic: body.topic,
        environment: body.environment,
        updated_at: new Date().toISOString(),
    }, { onConflict: "installation_id" });
    if (error) {
        console.error("[Push registration] Device upsert failed", error.code || "unknown");
        return NextResponse.json({ error: "Could not register device" }, { status: 503 });
    }
    return new NextResponse(null, { status: 204 });
}

export function PUT(request: Request) {
    return updateDevice(request, false);
}

export function DELETE(request: Request) {
    return updateDevice(request, true);
}
