import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {

    try {
        const { name, email, category, message, turnstileToken } = await request.json();

        // 0. Verify Turnstile Token
        const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
        if (turnstileSecret && turnstileToken) {
            const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
            const formData = new FormData();
            formData.append('secret', turnstileSecret);
            formData.append('response', turnstileToken);
            formData.append('remoteip', ip);

            const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                body: formData,
                method: 'POST',
            });

            const outcome = await result.json();
            if (!outcome.success) {
                console.error("Turnstile failed:", outcome);
                return NextResponse.json({ error: "Spam check failed" }, { status: 400 });
            }
        }

        // Resend Configuration
        const resendApiKey = process.env.RESEND_API_KEY;
        // Use the new email address for Admin alerts
        const adminEmail = 'dfofox@gmail.com';

        if (!resendApiKey) {
            console.error("Resend API Key missing");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const resend = new Resend(resendApiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'ルームシェアmikke <onboarding@resend.dev>';

        // 1. Send to Admin
        await resend.emails.send({
            from: fromEmail,
            to: adminEmail,
            subject: `【お問い合わせ】${category} - ${name}様`,
            text: `
名前: ${name}
Email: ${email}
種別: ${category}

メッセージ:
${message}
      `,
        });

        // 2. Send Confirmation to User
        const isTestMode = !process.env.RESEND_VERIFIED_DOMAIN;

        let toUserEmail = email;
        let debugInfo = "";

        // In test mode (no verified domain), we usually can only send to the verified admin email.
        // However, if we want to confirm the user gets an email, we might strictly send to adminEmail.
        // If the user's requirement "send destination to dfofox@gmail.com" implies ONLY the admin notification, that's done above.
        // The implementation below assumes the confirmation email logic remains similar but safe.
        if (isTestMode) {
            toUserEmail = adminEmail; // Prevent sending to unverified random emails in test mode
            debugInfo = `\n\n(Test Mode: Originally addressed to ${email})`;
        }

        await resend.emails.send({
            from: fromEmail,
            to: toUserEmail,
            subject: `【ルームシェアmikke】お問い合わせありがとうございます`,
            text: `
${name} 様

この度はルームシェアmikkeにお問い合わせいただきありがとうございます。
以下の内容で受け付けました。担当者が確認次第、ご連絡させていただきます。

--------------------------------------------------
種別: ${category}
メッセージ:
${message}
--------------------------------------------------

※このメールは自動送信されています。
${debugInfo}
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Email send error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
