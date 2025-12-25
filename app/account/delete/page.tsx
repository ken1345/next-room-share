"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MdWarning } from 'react-icons/md';
import Link from 'next/link';

export default function DeleteAccountPage() {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("本当に退会しますか？\nすべてのデータが削除され、復元できません。")) return;

        setIsDeleting(true);

        try {
            // 1. Call API to delete user data and auth
            const res = await fetch('/api/account/delete', {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || '削除に失敗しました');
            }

            // 2. Sign out client-side to clear session
            await supabase.auth.signOut();

            alert('退会処理が完了しました。ご利用ありがとうございました。');
            router.push('/');
        } catch (error: any) {
            console.error('Delete error:', error);
            alert('エラーが発生しました: ' + error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-lg border border-red-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-red-100 text-[#bf0000] rounded-full flex items-center justify-center mx-auto mb-4">
                        <MdWarning size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">退会手続き</h1>
                    <p className="text-gray-500 text-sm font-bold">
                        退会すると、プロフィール、投稿した物件、メッセージ履歴など<br />
                        <span className="text-[#bf0000]">すべてのデータが完全に削除されます。</span>
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-full bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-[#bf0000] hover:text-white transition shadow-sm"
                    >
                        {isDeleting ? '処理中...' : '退会する'}
                    </button>
                    <Link
                        href="/account"
                        className="block w-full text-center text-gray-400 font-bold text-sm hover:text-gray-600 transition"
                    >
                        キャンセルして戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}
