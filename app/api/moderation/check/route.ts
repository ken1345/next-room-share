import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkModeration } from "@/lib/openai";

const ngWords = ["NG_TEST", "死ね", "殺す", "闇バイト"];

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);
    const text = body?.text;
    const image = body?.image;
    const required = body?.required === true;

    if (typeof image === "string" && required && text === undefined) {
        if (image.length > 4_000_000 || !/^[A-Za-z0-9+/]+=*$/.test(image)) {
            return NextResponse.json({ error: "Invalid image" }, { status: 400 });
        }
        const token = request.headers.get("authorization")?.match(/^Bearer (\S+)$/i)?.[1];
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !key) return NextResponse.json({ error: "Moderation unavailable" }, { status: 503 });
        if (!token || (await createClient(url, key).auth.getUser(token)).error) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    } else if (typeof text !== "string" || !text.trim() || text.length > 20_000 || image !== undefined) {
        return NextResponse.json({ error: "Invalid text" }, { status: 400 });
    }

    if (typeof text === "string" && ngWords.some(word => text.includes(word))) {
        return NextResponse.json({ flagged: true, categories: ["禁止ワード(NG Word)"], checked: true });
    }

    try {
        const input = typeof image === "string"
            ? [{ type: "image_url" as const, image_url: { url: `data:image/jpeg;base64,${image}` } }]
            : text;
        const result = await checkModeration(input);
        return NextResponse.json({ ...result, checked: true });
    } catch (error) {
        console.warn("[Moderation]", error instanceof Error ? error.message : "Request failed");
        return required
            ? NextResponse.json({ error: "Moderation unavailable" }, { status: 503 })
            : NextResponse.json({ flagged: false, categories: [], checked: false });
    }
}
