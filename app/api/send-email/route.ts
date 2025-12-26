import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {

    try {
        const { name, email, category, message, spamCheck } = await request.json();

        // 0. Spam Verification
        if (spamCheck?.honey) {
            console.warn("Honeypot filled by:", email);
            return NextResponse.json({ error: "Spam detected" }, { status: 400 });
        }

        // 1. Save to Database (contacts table)
        // Use Service Role Key if available to bypass RLS, otherwise Anon Key
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseKey = serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

        console.log(`[SendEmail] Using ${serviceRoleKey ? 'Service Role Key' : 'Anon Key'} for DB insert.`);

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { error: dbError } = await supabase
            .from('contacts')
            .insert({
                name,
                email,
                category,
                message
            });

        if (dbError) {
            console.error("Database Insert Error:", dbError);
            return NextResponse.json({
                error: `Database save failed: ${dbError.message} (Code: ${dbError.code}, Details: ${dbError.details})`
            }, { status: 500 });
        }

        // 2. Resend Configuration (Proceed to email)

        // Check Math (Removed for smarter UX)
        // if (spamCheck?.mathAnswer !== '8') ...

        // Resend Configuration
        const resendApiKey = process.env.RESEND_API_KEY;

        if (!resendApiKey) {
            console.error("Resend API Key missing");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // Use the new email address for Admin alerts
        const adminEmail = 'dfofox@gmail.com';

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
