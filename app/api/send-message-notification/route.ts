import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const { recipientId, senderName, messageContent, threadId } = await request.json();

        const user = process.env.GMAIL_USER;
        const pass = process.env.GMAIL_APP_PASSWORD;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

        if (!user || !pass) {
            console.error("[Notification] Server configuration error: Missing user or pass");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        console.log(`[Notification] Processing for recipient: ${recipientId}`);

        // Initialize Supabase Client (Note: using Anon key, relying on public read or specific RLS)
        // If strict RLS is enabled, you might need SUPABASE_SERVICE_ROLE_KEY
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Fetch Recipient Details
        const { data: recipient, error } = await supabase
            .from('users')
            .select('email, email_notification')
            .eq('id', recipientId)
            .single();

        console.log("[Notification] Fetch result:", { recipient, error });

        if (error || !recipient || !recipient.email) {
            console.error("Recipient not found or no email:", error);
            return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
        }

        // Check Notification Setting (Default to TRUE if null)
        const shouldSend = recipient.email_notification ?? true;

        if (!shouldSend) {
            return NextResponse.json({ skipped: true });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user, pass },
        });

        // Send Email
        await transporter.sendMail({
            from: user,
            to: recipient.email,
            subject: `【ルームシェアネクスト】${senderName}さんからメッセージが届きました`,
            text: `
${senderName}さんから新しいメッセージが届きました。

--------------------------------------------------
${messageContent}
--------------------------------------------------

メッセージの確認・返信はこちら:
${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/messages/${threadId}

※このメールは自動送信されています。
※通知設定はマイページの設定から変更できます。
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Notification error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
