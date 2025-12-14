"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { MdLock, MdCheck } from 'react-icons/md';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Ensure user is authenticated (via the recovery link)
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // If accessed directly without session, redirect to login
                // However, the hash processing might take a moment.
                // In a real app we might want to wait for onAuthStateChange
            }
        };
        checkSession();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            alert("パスワードを更新しました。新しいパスワードでログインしてください。");
            router.push('/login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans p-4">
            <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">新しいパスワードの設定</h1>
                <p className="text-gray-500 mb-8 text-sm">
                    新しいパスワードを入力してください。
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">新しいパスワード</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-[#bf0000] outline-none transition font-bold"
                                placeholder="6文字以上"
                            />
                            <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#bf0000] text-white font-bold py-3.5 rounded-lg shadow-md hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '更新中...' : 'パスワードを変更する'}
                    </button>
                </form>
            </div>
        </div>
    );
}
