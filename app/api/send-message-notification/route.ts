import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const { recipientId, threadId, messageContent, senderName: providedSenderName } = await request.json();

        // 1. Auth Check: Verify the caller
        const authHeader = request.headers.get('Authorization');
        console.log(`[Notification] Request for thread ${threadId}. Auth header included: ${!!authHeader}`);

        if (!authHeader) {
            console.error("[Notification] Missing Authorization Header");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseServiceRoleKey) {
            console.error("[Notification] Server configuration error: Missing SUPABASE_SERVICE_ROLE_KEY");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // Create a client with the user's token to verify identity
        const userClient = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader } }
        });

        const { data: { user }, error: authError } = await userClient.auth.getUser();

        if (authError || !user) {
            console.error("[Notification] Auth failed:", authError);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log(`[Notification] User authenticated: ${user.id}`);

        // 2. Admin Client for trusted operations
        const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey);

        // 3. Permission Check: Is user part of the thread?
        const { data: thread, error: threadError } = await adminClient
            .from('threads')
            .select('host_id, seeker_id, listing:listings(title)')
            .eq('id', threadId)
            .single();

        if (threadError || !thread) {
            console.error(`[Notification] Thread not found: ${threadId}`, threadError);
            return NextResponse.json({ error: "Thread not found" }, { status: 404 });
        }

        if (thread.host_id !== user.id && thread.seeker_id !== user.id) {
            console.error(`[Notification] Permission denied. User ${user.id} not in thread ${threadId}`);
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Derive correct recipient ID from the thread
        const actualRecipientId = (user.id === thread.host_id) ? thread.seeker_id : thread.host_id;

        // 4. Rate Limiting: Check messages table
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString();
        const { count: recentMessagesCount, error: rateLimitError } = await adminClient
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', user.id)
            .gte('created_at', oneMinuteAgo);

        if (rateLimitError) {
            console.error("Rate limit check failed", rateLimitError);
        } else if (recentMessagesCount !== null && recentMessagesCount > 10) {
            console.warn(`[Notification] Rate limit exceeded for user ${user.id}`);
            return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
        }

        // 5. Fetch Sender Name (Securely but prioritize UX)
        let senderName = providedSenderName;

        if (!senderName) {
            const { data: senderProfile } = await adminClient
                .from('users')
                .select('display_name, email, name')
                .eq('id', user.id)
                .single();

            senderName = senderProfile?.display_name || senderProfile?.name || user.email?.split('@')[0] || 'ユーザー';
        }

        // --- End Security Checks, proceed to Send Email ---

        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            console.error("[Notification] Server configuration error: Missing RESEND_API_KEY");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // Fetch Recipient Email
        const { data: recipient, error: recipientError } = await adminClient
            .from('users')
            .select('email, email_notification')
            .eq('id', actualRecipientId)
            .single();

        let recipientEmail = recipient?.email;
        let recipientNotification = recipient?.email_notification ?? true;

        if (!recipientEmail) {
            // Fallback: Try fetching from Auth (auth.users) directly
            console.log(`[Notification] Email not found in public.users for ${actualRecipientId}. Trying Auth...`);
            const { data: authUser, error: authUserError } = await adminClient.auth.admin.getUserById(actualRecipientId);

            if (authUser && authUser.user) {
                recipientEmail = authUser.user.email;
            } else {
                console.error("[Notification] Recipient not found in Auth either:", authUserError);
                return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
            }
        }

        if (!recipientEmail) {
            console.error("[Notification] Recipient has no email.");
            return NextResponse.json({ error: "Recipient has no email" }, { status: 404 });
        }

        console.log(`[Notification] Sending to recipient: ${actualRecipientId} (${recipientEmail})`);

        const shouldSend = recipientNotification;
        if (!shouldSend) {
            console.log(`[Notification] Skipped. User disabled notifications.`);
            return NextResponse.json({ skipped: true });
        }

        const resend = new Resend(resendApiKey);

        // Test Mode Logic
        const ownerEmail = 'dfofox@gmail.com';
        const isVerifiedDomain = process.env.RESEND_VERIFIED_DOMAIN === 'true';

        let toEmail = recipientEmail;
        let subjectPrefix = "";
        let debugInfo = "";

        if (!isVerifiedDomain) {
            toEmail = ownerEmail;
            subjectPrefix = "[TEST] ";
            debugInfo = `\n\n(Test Mode: Originally sent to ${recipientEmail})`;
            console.log(`[Notification] Test mode active. Redirecting to ${toEmail}`);
        }

        // Supabase/PostgREST might return listing as an array depending on inference
        const listingData: any = thread.listing;
        const listingTitleStr = Array.isArray(listingData) ? listingData[0]?.title : listingData?.title;
        const listingTitle = listingTitleStr ? `(${listingTitleStr})` : "";

        const fromEmail = process.env.RESEND_FROM_EMAIL || 'ルームシェアmikke <onboarding@resend.dev>';
        console.log(`[Notification] Sending email from ${fromEmail} to ${toEmail}`);

        const { data, error: resendError } = await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            subject: `${subjectPrefix}【ルームシェアmikke】${senderName}さんからメッセージが届きました`,
            text: `
${senderName}さんから新しいメッセージが届きました。
${listingTitle}

--------------------------------------------------
${messageContent}
--------------------------------------------------

メッセージの確認・返信はこちら:
${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/messages/${threadId}

※このメールは自動送信されています。
${debugInfo}
      `,
        });

        if (resendError) {
            console.error("[Notification] Resend API error:", resendError);
            return NextResponse.json({ error: resendError.message }, { status: 500 });
        }

        console.log("[Notification] Email sent successfully:", data);

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error("[Notification] Uncaught error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
