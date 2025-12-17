"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdArrowBack, MdEmail, MdLock } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { supabase } from '@/lib/supabase';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams(); // To handle redirect param
    const redirectPath = searchParams.get('redirect') || '/';

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    // Initial Login Logic (common for Google and Email)
    const handleLoginSuccess = async (user: any) => {
        // Check if user doc exists (public profile) and create if missing (sync)
        if (user) {
            const { data: profile } = await supabase.from('users').select().eq('id', user.id).single();
            if (!profile) {
                await supabase.from('users').insert({
                    id: user.id,
                    email: user.email,
                    display_name: user.user_metadata?.full_name || 'User',
                    photo_url: user.user_metadata?.avatar_url || null,
                });
            }
        }
        router.push(redirectPath);
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password,
            });

            if (error) throw error;
            if (data.user) {
                await handleLoginSuccess(data.user);
            }
        } catch (error: any) {
            console.error(error);
            alert("ログインに失敗しました。メールアドレスかパスワードが間違っています。");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const origin = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : '';
            const finalRedirectUrl = `${origin}${redirectPath}`;
            console.log('OAuth Redirect URL:', finalRedirectUrl);

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: finalRedirectUrl,
                }
            });
            if (error) throw error;
            // Redirect handles the rest
        } catch (error: any) {
            console.error(error);
            alert("Googleログインに失敗しました。" + error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">ログイン</h1>
                    <p className="text-gray-500 text-sm">登録したアカウントでログインしてください</p>
                </div>

                <div className="space-y-4 mb-6">
                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        disabled={isLoading}
                        className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                        <FcGoogle size={22} /> Googleでログイン
                    </button>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold">または</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">メールアドレス</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <MdEmail size={20} />
                            </div>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-2 focus:ring-red-100 outline-none font-bold transition text-gray-900"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">パスワード</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <MdLock size={20} />
                            </div>
                            <input
                                type="password"
                                required
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-2 focus:ring-red-100 outline-none font-bold transition text-gray-900"
                                placeholder="パスワード"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-1">
                        <Link href="/forgot-password" className="text-xs font-bold text-gray-500 hover:text-[#bf0000]">
                            パスワードをお忘れですか？
                        </Link>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#bf0000] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? '処理中...' : 'ログイン'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    アカウントをお持ちでない方は
                    <Link href="/signup" className="text-[#bf0000] font-bold hover:underline ml-1">
                        新規登録
                    </Link>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-gray-400 hover:text-gray-600 text-xs font-bold flex items-center justify-center gap-1">
                        <MdArrowBack /> ホームに戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
