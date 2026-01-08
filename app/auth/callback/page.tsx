"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get('next') || '/';

    useEffect(() => {
        const handleAuth = async () => {
            // 1. Check for errors in URL
            const error = searchParams.get('error');
            const error_description = searchParams.get('error_description');
            if (error) {
                console.error("Auth Error:", error, error_description);
                alert(`ログインエラー: ${error_description || error}`);
                router.replace('/login'); // Return to login
                return;
            }

            // 2. Setup listener
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                console.log("Auth Event:", event, session);
                if (event === 'SIGNED_IN' && session) {
                    console.log("Session established, redirecting to:", next);
                    router.replace(next);
                }
            });

            // 3. Explicitly check session (in case event fired before listener)
            const { data: { session } } = await supabase.auth.getSession();
            console.log("Current Session:", session);
            if (session) {
                console.log("Session exists, redirecting to:", next);
                router.replace(next);
            }

            return () => {
                subscription.unsubscribe();
            };
        };

        handleAuth();
    }, [router, next, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bf0000] mx-auto mb-4"></div>
                <p className="text-gray-600 font-bold">ログイン処理中...</p>
                <p className="text-gray-400 text-sm mt-2">画面が切り替わるまでお待ちください</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <AuthCallback />
        </Suspense>
    );
}
