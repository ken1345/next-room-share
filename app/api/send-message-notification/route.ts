import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const { recipientId, senderName, messageContent, threadId } = await request.json();

        // Resend Configuration
        const resendApiKey = process.env.RESEND_API_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

        if (!resendApiKey) {
            console.error("[Notification] Server configuration error: Missing RESEND_API_KEY");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        console.log(`[Notification] Processing for recipient: ${recipientId}`);

        // Initialize Supabase Client with Service Role Key to bypass RLS
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
            // Don't fail the request if user not found, just skip? Or error 404.
            // Keeping existing behavior
            return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
        }

        // Check Notification Setting (Default to TRUE if null)
        const shouldSend = recipient.email_notification ?? true;

        if (!shouldSend) {
            return NextResponse.json({ skipped: true });
        }

        // Initialize Resend
        const resend = new Resend(resendApiKey);

        // Test Mode Logic: Redirect to owner if no verified domain (indicated by default 'onboarding' from or explicit env)
        // For this user context, assuming we are in test mode.
        // We will send TO the owner (dfofox@gmail.com) but mention the intended recipient.
        const ownerEmail = 'dfofox@gmail.com';
        const isTestMode = !process.env.RESEND_VERIFIED_DOMAIN; // or just always true for now

        let toEmail = recipient.email;
        let subjectPrefix = "";
        let debugInfo = "";

        if (isTestMode) {
            toEmail = ownerEmail;
            subjectPrefix = "[TEST] ";
            debugInfo = `\n\n(Test Mode: Originally sent to ${recipient.email})`;
        }

        const { data, error: resendError } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'ルームシェアmikke <onboarding@resend.dev>',
            to: toEmail,
            subject: `${subjectPrefix}【ルームシェアmikke】${senderName}さんからメッセージが届きました`,
            text: `
${senderName}さんから新しいメッセージが届きました。

--------------------------------------------------
${messageContent}
--------------------------------------------------

メッセージの確認・返信はこちら:
${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/messages/${threadId}

※このメールは自動送信されています。
※通知設定はマイページの設定から変更できます。
${debugInfo}
      `,
        });

        if (resendError) {
            console.error("Resend error:", resendError);
            return NextResponse.json({ error: resendError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error("Notification error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
