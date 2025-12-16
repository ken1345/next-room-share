import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const token = authHeader.replace('Bearer ', '');

        // Verify User
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabaseUserClient = createClient(supabaseUrl, supabaseAnonKey);
        const { data: { user }, error: authError } = await supabaseUserClient.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        console.log(`[Account Withdrawal] Request for user: ${user.id}`);

        // Service Role Client
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!serviceRoleKey) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });

        // Withdrawal Actions (Anonymization)

        // 1. Delete Listings
        const { error: listingsError } = await supabaseAdmin.from('listings').delete().eq('host_id', user.id);
        if (listingsError) throw listingsError;

        // 2. Delete Stories
        const { error: storiesError } = await supabaseAdmin.from('stories').delete().eq('author_id', user.id);
        if (storiesError) throw storiesError;

        // 3. Anonymize User Profile
        // - Delete photo_url
        // - Rename display_name to "退会済みメンバー"
        const { error: profileError } = await supabaseAdmin
            .from('users')
            .update({
                display_name: '退会済みメンバー',
                photo_url: null,
                // We keep the email in public.users? Usually yes for ID, but can be set to null if cleaner.
                // Request said "Delete profile image... change name". Didn't mention email.
                // Keeping email in public.users might be fine, or we can look it up in Auth if needed.
                // Let's leave email alone or set to null? "Anonymize" usually implies removing identifying info.
                // But for now, sticking to strict requirements: Name and Photo.
            })
            .eq('id', user.id);

        if (profileError) throw profileError;

        // 4. Ban the User (Prevent future logins)
        // We set a very long ban duration (e.g., 100 years from now)
        // Note: 'ban_duration' format for Supabase updateUserById. 
        // 100 years = 365 * 24 * 100 = 876000 hours.
        const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
            ban_duration: '876000h'
        });

        if (banError) throw banError;

        console.log(`[Account Withdrawal] Successfully processed and banned user: ${user.id}`);

        // Note: We DO NOT delete the auth user here, so the FK constraint in public.users remains valid.
        // The user is effectively "banned" or "gone" from the frontend perspective.
        // We will sign them out on the client side.

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Withdrawal error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
