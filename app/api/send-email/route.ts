import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {

    try {
        const { name, email, category, message } = await request.json();

        // Resend Configuration
        const resendApiKey = process.env.RESEND_API_KEY;
        const adminEmail = process.env.ADMIN_EMAIL || 'delivered@resend.dev'; // Fallback for testing/Resend interception

        if (!resendApiKey) {
            console.error("Resend API Key missing");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const resend = new Resend(resendApiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'RoomMikke <onboarding@resend.dev>';

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
        // Test Mode Redirect
        const ownerEmail = 'dfofox@gmail.com';
        const isTestMode = !process.env.RESEND_VERIFIED_DOMAIN;

        let toUserEmail = email;
        let debugInfo = "";

        if (isTestMode) {
            toUserEmail = ownerEmail;
            debugInfo = `\n\n(Test Mode: Originally sent to ${email})`;
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
