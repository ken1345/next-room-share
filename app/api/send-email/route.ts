import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {

    try {
        const { name, email, category, message, spamCheck } = await request.json();

        // 0. Spam Verification (Custom)
        // Check Honeypot (must be empty)
        if (spamCheck?.honey) {
            console.warn("Honeypot filled by:", email);
            return NextResponse.json({ error: "Spam detected" }, { status: 400 });
        }

        // Check Math (Removed for smarter UX)
        // if (spamCheck?.mathAnswer !== '8') ...

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
