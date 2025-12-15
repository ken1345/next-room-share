import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { name, email, category, message } = await request.json();

        const user = process.env.GMAIL_USER;
        const pass = process.env.GMAIL_APP_PASSWORD;

        if (!user || !pass) {
            console.error("Gmail credentials missing");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user,
                pass: pass,
            },
        });

        // 1. Send to Admin (You)
        await transporter.sendMail({
            from: user,
            to: user, // Send to yourself
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
        await transporter.sendMail({
            from: user,
            to: email, // Send to the user who inquired
            subject: `【ルームシェアネクスト】お問い合わせありがとうございます`,
            text: `
${name} 様

この度はルームシェアネクストにお問い合わせいただきありがとうございます。
以下の内容で受け付けました。担当者が確認次第、ご連絡させていただきます。

--------------------------------------------------
種別: ${category}
メッセージ:
${message}
--------------------------------------------------

※このメールは自動送信されています。
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Email send error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
