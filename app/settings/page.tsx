"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MdArrowBack, MdSecurity, MdDeleteForever, MdLogout, MdChevronRight, MdClose } from 'react-icons/md';

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);



    // Modals State
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Form State
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState(''); // Not strictly needed for Supabase update, but good for UI flow if re-auth needed (omitted for simplicity here)
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setUser(session.user);


            setLoading(false);
        };
        init();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleWithdrawAccount = async () => {
        if (!window.confirm("本当に退会しますか？\n\n・投稿した物件情報、体験談は削除されます\n・プロフィール画像は削除されます\n・同じメールアドレスやグーグルアカウントで再登録することはできません\n\nこの操作は取り消せません。")) {
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                alert("セッションが見つかりません。再度ログインしてください。");
                return;
            }

            const res = await fetch('/api/withdraw-account', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Unknown error');
            }

            // Success
            await supabase.auth.signOut();
            alert("退会処理が完了しました。");
            router.push('/');

        } catch (error: any) {
            console.error("Withdrawal error:", error);
            alert("退会処理に失敗しました: " + error.message);
        }
    };



    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        const { error } = await supabase.auth.updateUser({ email: newEmail });

        if (error) {
            alert("メールアドレスの変更に失敗しました: " + error.message);
        } else {
            alert("確認メールを送信しました。\n新しいメールアドレスと現在のメールアドレスの両方に届く確認リンクをクリックして完了してください。");
            setShowEmailModal(false);
            setNewEmail('');
        }
        setFormLoading(false);
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("パスワードが一致しません。");
            return;
        }
        if (newPassword.length < 6) {
            alert("パスワードは6文字以上で入力してください。");
            return;
        }

        setFormLoading(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            alert("パスワードの変更に失敗しました: " + error.message);
        } else {
            alert("パスワードを変更しました。");
            setShowPasswordModal(false);
            setNewPassword('');
            setConfirmPassword('');
        }
        setFormLoading(false);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-700">
            {/* Header */}
            <div className="bg-white border-b shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/account" className="text-gray-500 hover:text-gray-800 transition p-2 -ml-2 rounded-full hover:bg-gray-100">
                        <MdArrowBack size={24} />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">設定</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-2xl mt-6 space-y-6">



                {/* Security */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                        <MdSecurity className="text-blue-500" />
                        <h2 className="font-bold text-gray-800">セキュリティ</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <button
                            onClick={() => setShowEmailModal(true)}
                            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition text-left"
                        >
                            <div>
                                <span className="font-bold text-sm text-gray-700 block">メールアドレスの変更</span>
                                <span className="text-xs text-gray-400">{user?.email}</span>
                            </div>
                            <MdChevronRight className="text-gray-400" />
                        </button>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition text-left"
                        >
                            <span className="font-bold text-sm text-gray-700">パスワードの変更</span>
                            <MdChevronRight className="text-gray-400" />
                        </button>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                        <MdDeleteForever className="text-gray-500" />
                        <h2 className="font-bold text-gray-800">アカウント操作</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <button onClick={handleSignOut} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition text-left text-gray-700">
                            <span className="font-bold text-sm flex items-center gap-2"><MdLogout /> ログアウト</span>
                            <MdChevronRight className="text-gray-400" />
                        </button>
                        <button onClick={handleWithdrawAccount} className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition text-left text-red-600">
                            <span className="font-bold text-sm">退会する</span>
                            <MdChevronRight className="text-red-300" />
                        </button>
                    </div>
                </section>

                <div className="text-center text-xs text-gray-400 py-4">
                    アプリバージョン 1.1.0
                </div>

            </div>

            {/* Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">メールアドレス変更</h3>
                            <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-gray-600"><MdClose size={24} /></button>
                        </div>
                        <form onSubmit={handleUpdateEmail} className="p-4">
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-500 mb-1">新しいメールアドレス</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="new@example.com"
                                    value={newEmail}
                                    onChange={e => setNewEmail(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={formLoading}
                                className="w-full bg-[#bf0000] text-white font-bold py-3 rounded-full hover:bg-[#900000] transition disabled:opacity-50"
                            >
                                {formLoading ? '送信中...' : '変更確認メールを送信'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">パスワード変更</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600"><MdClose size={24} /></button>
                        </div>
                        <form onSubmit={handleUpdatePassword} className="p-4">
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-gray-500 mb-1">新しいパスワード</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="6文字以上"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-500 mb-1">パスワード確認</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                    placeholder="再度入力してください"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={formLoading}
                                className="w-full bg-[#bf0000] text-white font-bold py-3 rounded-full hover:bg-[#900000] transition disabled:opacity-50"
                            >
                                {formLoading ? '更新中...' : 'パスワードを変更'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
