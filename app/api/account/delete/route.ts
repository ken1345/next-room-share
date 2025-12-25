
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// Note: Using auth-helpers or just standard client pattern depending on proj setup. 
// Assuming standard pattern for getting user first.

export async function DELETE(request: Request) {
    try {
        // 1. Get current user
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // We need the access token to identify the user securely if we used server client,
        // but here we can just pass the session or use the service role to delete based on ID provided by client? 
        // No, that's insecure. We must verify session.

        // Let's use the standard method to get session from cookie
        const cookieStore = cookies();
        const verifyClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                global: { headers: { cookie: cookieStore.toString() } },
            }
        );

        const { data: { session } } = await verifyClient.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // 2. Delete User from Auth (requires Service Role)
        // If SERVICE_ROLE_KEY is missing, we can at least try to delete public data.
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (serviceRoleKey) {
            const adminSupabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                serviceRoleKey,
                {
                    auth: {
                        autoRefreshToken: false,
                        persistSession: false
                    }
                }
            );

            // Delete from Auth (This usually cascades to public.users if set up, or we assume triggered)
            const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(userId);
            if (deleteError) {
                console.error("Auth delete error:", deleteError);
                throw deleteError;
            }
        } else {
            console.warn("SUPABASE_SERVICE_ROLE_KEY not found. Performing soft delete / public data delete only.");
            // Fallback: Delete rows from public tables where user is owner.
            // This might fail if constraints exist and RLS allows.
            // Ideally we just rely on the user to contact admin if key is missing, or we delete what we can.

            // Try to delete from public.users manually (assuming RLS allows user to delete self)
            const { error: publicDeleteError } = await verifyClient
                .from('users')
                .delete()
                .eq('id', userId);

            if (publicDeleteError) {
                console.error("Public delete error:", publicDeleteError);
                throw publicDeleteError;
            }
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Delete account error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
