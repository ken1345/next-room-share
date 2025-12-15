"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ProfileGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkProfile = async () => {
            // Exclude paths to avoid infinite loops
            // /account/setup: The target page
            // /login, /signup: Auth pages
            // /auth/callback: Auth callback
            const excludedPaths = ['/account/setup', '/login', '/signup', '/auth/callback', '/'];
            // Also allows basic public pages? 
            // Requirement: "Google login... input gender/age/job".
            // If I block everything, it's strict. But maybe public pages like /search should be visible?
            // "Google account login... input" implies IF logged in.
            // If NOT logged in, no guard needed.

            if (excludedPaths.includes(pathname || '')) {
                setChecking(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // Not logged in, no need to guard profile (unless we want to force login, but that's different)
                setChecking(false);
                return;
            }

            try {
                // Logged in, check profile
                const { data: profile } = await supabase
                    .from('users')
                    .select('gender, age, occupation')
                    .eq('id', session.user.id)
                    .single();

                // Condition: If any required field is missing
                if (!profile || !profile.gender || !profile.age || !profile.occupation) {
                    // Check if we are already going there? (Handled by excludedPaths but double check)
                    if (pathname !== '/account/setup') {
                        router.replace('/account/setup');
                    }
                }
            } catch (error) {
                console.error("Profile check failed", error);
            } finally {
                setChecking(false);
            }
        };

        checkProfile();
    }, [pathname, router]);

    // Optionally show nothing while checking to prevent flash?
    // But for better UX might render children (flash of content vs white screen).
    // Let's render children.
    return <>{children}</>;
}
