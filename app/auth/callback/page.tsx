"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function AuthCallback() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get('next') || '/';

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                // セッションが確立されたらリダイレクト
                router.replace(next);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router, next]);

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
