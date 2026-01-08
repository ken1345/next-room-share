"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MdArrowBack, MdPerson, MdEmail, MdLock } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';

import { Suspense } from 'react';

function SignupForm() {
    const router = useRouter();
    const [form, setForm] = useState({
        displayName: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        age: '',
        occupation: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || '/account'; // Default to /account instead of /

    const handleGoogleSignup = async () => {
        setIsLoading(true);
        try {
            const origin = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : '';
            const finalRedirectUrl = `${origin}${redirectPath}`;

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: finalRedirectUrl,
                }
            });
            if (error) throw error;
            // Redirect happens automatically
        } catch (error: any) {
            console.error(error);
            alert("Googleサインアップに失敗しました。" + error.message);
            setIsLoading(false);
        }
    };

    const handleAppleSignup = async () => {
        setIsLoading(true);
        try {
            const origin = (typeof window !== 'undefined' && window.location.origin) ? window.location.origin : '';
            const finalRedirectUrl = `${origin}${redirectPath}`;

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'apple',
                options: {
                    redirectTo: finalRedirectUrl,
                }
            });
            if (error) throw error;
        } catch (error: any) {
            console.error(error);
            alert("Appleサインアップに失敗しました。" + error.message);
            setIsLoading(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("パスワードが一致しません。");
            return;
        }

        setIsLoading(true);

        try {
            // 1. SignUp with Supabase
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    data: {
                        display_name: form.displayName,
                        // We also store these in metadata as backup/easy access
                        gender: form.gender,
                        age: form.age,
                        occupation: form.occupation,
                    },
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}${redirectPath}`
                }
            });

            if (error) throw error;

            if (data.user) {
                // 2. Insert/Update public.users table (Best effort for auto-confirm or session)
                if (data.session) {
                    const { error: profileError } = await supabase
                        .from('users')
                        .update({
                            display_name: form.displayName,
                            gender: form.gender,
                            age: Number(form.age),
                            occupation: form.occupation
                        })
                        .eq('id', data.user.id);

                    if (profileError) {
                        console.warn("Profile update failed:", profileError);
                    }
                }

                // 3. Show Success UI
                setEmailSent(true);

                if (data.session) {
                    // Normalize redirect path (ensure it starts with /)
                    const target = redirectPath.startsWith('/') ? redirectPath : '/' + redirectPath;
                    setTimeout(() => router.push(target), 2000);
                }
            }

        } catch (error: any) {
            console.error('Signup Error:', error);
            alert('登録エラー: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
        // ... (Success UI remains same)
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MdEmail size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">確認メールを送信しました</h1>
                    <p className="text-gray-600 leading-relaxed mb-8">
                        ご入力いただいたメールアドレス ({form.email}) 宛に確認メールを送信しました。<br />
                        メール内のリンクをクリックして、登録を完了させてください。<br />
                    </p>

                    <div className="space-y-4">
                        <Link
                            href={`/login${searchParams.get('redirect') ? `?redirect=${encodeURIComponent(searchParams.get('redirect')!)}` : ''}`}
                            className="block w-full bg-[#bf0000] text-white font-bold py-3.5 rounded-xl hover:bg-[#990000] transition shadow-md"
                        >
                            ログインページへ
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">アカウント作成</h1>
                    <p className="text-gray-500 text-sm">必要な情報を入力して登録してください</p>
                </div>

                <div className="space-y-4 mb-6">
                    <button
                        onClick={handleGoogleSignup}
                        type="button"
                        disabled={isLoading}
                        className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                        <FcGoogle size={22} /> Googleで登録
                    </button>
                    <button
                        onClick={handleAppleSignup}
                        type="button"
                        disabled={isLoading}
                        className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2 mt-3"
                    >
                        <FaApple size={22} /> Appleで登録
                    </button>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold">または</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">表示名（ニックネーム）</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <MdPerson size={20} />
                            </div>
                            <input
                                type="text"
                                required
                                value={form.displayName}
                                onChange={e => setForm({ ...form, displayName: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-2 focus:ring-red-100 outline-none font-bold transition text-gray-900"
                                placeholder="RoomUser"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">性別</label>
                            <select
                                required
                                value={form.gender}
                                onChange={e => setForm({ ...form, gender: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-2 focus:ring-red-100 outline-none font-bold transition text-gray-900 appearance-none"
                            >
                                <option value="">選択</option>
                                <option value="男性">男性</option>
                                <option value="女性">女性</option>
                                <option value="その他">その他</option>
                                <option value="回答しない">回答しない</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">年齢</label>
                            <input
                                type="number"
                                required
                                min={18}
                                max={100}
                                value={form.age}
                                onChange={e => setForm({ ...form, age: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-2 focus:ring-red-100 outline-none font-bold transition text-gray-900"
                                placeholder="25"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">職業</label>
                        <select
                            required
                            value={form.occupation}
                            onChange={e => setForm({ ...form, occupation: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-2 focus:ring-red-100 outline-none font-bold transition text-gray-900 appearance-none"
                        >
                            <option value="">選択してください</option>
                            <option value="学生">学生</option>
                            <option value="会社員・公務員">会社員・公務員</option>
                            <option value="自営業">自営業</option>
                            <option value="アルバイト">アルバイト</option>
                            <option value="無職">無職</option>
                        </select>
                    </div>

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
                                minLength={8}
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-2 focus:ring-red-100 outline-none font-bold transition text-gray-900"
                                placeholder="8文字以上"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">パスワード（確認）</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <MdLock size={20} />
                            </div>
                            <input
                                type="password"
                                required
                                minLength={8}
                                value={form.confirmPassword}
                                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-2 focus:ring-red-100 outline-none font-bold transition text-gray-900"
                                placeholder="もう一度入力してください"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#bf0000] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-[#990000] transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? '登録処理中...' : 'アカウントを作成'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    すでにアカウントをお持ちの方は
                    <Link
                        href={`/login${searchParams.get('redirect') ? `?redirect=${encodeURIComponent(searchParams.get('redirect')!)}` : ''}`}
                        className="text-[#bf0000] font-bold hover:underline ml-1"
                    >
                        ログイン
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

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SignupForm />
        </Suspense>
    );
}
