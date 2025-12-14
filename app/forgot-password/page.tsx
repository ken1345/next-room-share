"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { MdEmail, MdArrowBack, MdCheck } from 'react-icons/md';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MdCheck className="text-3xl text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">メールを送信しました</h2>
                    <p className="text-gray-500 mb-8">
                        {email} 宛にパスワード再設定用のリンクを送信しました。メールをご確認ください。
                    </p>
                    <Link href="/login" className="text-[#bf0000] font-bold hover:underline">
                        ログイン画面に戻る
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans p-4">
            <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg max-w-md w-full">
                <Link href="/login" className="flex items-center gap-1 text-gray-400 hover:text-gray-600 mb-6 font-bold text-sm">
                    <MdArrowBack /> 戻る
                </Link>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">パスワードをお忘れの方</h1>
                <p className="text-gray-500 mb-8 text-sm">
                    登録したメールアドレスを入力してください。<br />
                    再設定用のリンクをお送りします。
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleReset} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">メールアドレス</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:bg-white focus:border-[#bf0000] outline-none transition font-bold"
                                placeholder="example@email.com"
                            />
                            <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#bf0000] text-white font-bold py-3.5 rounded-lg shadow-md hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '送信中...' : '再設定メールを送信'}
                    </button>
                </form>
            </div>
        </div>
    );
}
