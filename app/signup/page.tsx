"use client";
import { useState } from 'react';
import Link from 'next/link';
import { MdArrowBack, MdPerson, MdEmail, MdLock } from 'react-icons/md';

export default function SignupPage() {
    const [form, setForm] = useState({
        displayName: '',
        email: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock signup
        setTimeout(() => {
            setIsLoading(false);
            window.location.href = '/'; // Navigate to home after signup
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">アカウント作成</h1>
                    <p className="text-gray-500 text-sm">必要な情報を入力して登録してください</p>
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
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-2 focus:ring-red-100 outline-none font-bold transition"
                                placeholder="RoomUser"
                            />
                        </div>
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
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-2 focus:ring-red-100 outline-none font-bold transition"
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
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-2 focus:ring-red-100 outline-none font-bold transition"
                                placeholder="8文字以上"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#bf0000] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? '登録処理中...' : 'アカウントを作成'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    すでにアカウントをお持ちの方は
                    <Link href="/login" className="text-[#bf0000] font-bold hover:underline ml-1">
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
