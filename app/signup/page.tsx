"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdArrowBack, MdPerson, MdEmail, MdLock } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        displayName: '',
        email: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleGoogleSignup = async () => {
        setIsLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user doc exists (in case they already signed up)
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                await setDoc(userDocRef, {
                    uid: user.uid,
                    displayName: user.displayName || 'Google User',
                    email: user.email,
                    role: 'user',
                    createdAt: serverTimestamp()
                });
            }
            // Redirect to home
            router.push('/');

        } catch (error: any) {
            console.error(error);
            alert("Googleサインアップに失敗しました。" + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Create User in Auth
            const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
            const user = userCredential.user;

            // 2. Update Profile (Display Name)
            await updateProfile(user, {
                displayName: form.displayName
            });

            // 3. Send Verification Email
            await sendEmailVerification(user);

            // 4. Create User Document in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                displayName: form.displayName,
                email: form.email,
                role: 'user', // Default unified role
                createdAt: serverTimestamp()
            });

            // 5. Show Success UI
            setEmailSent(true);

        } catch (error: any) {
            console.error('Signup Error:', error);
            let message = 'アカウント作成中にエラーが発生しました。';
            if (error.code === 'auth/email-already-in-use') {
                message = 'このメールアドレスは既に使用されています。';
            } else if (error.code === 'auth/weak-password') {
                message = 'パスワードが弱すぎます。';
            }
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MdEmail size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">確認メールを送信しました</h1>
                    <p className="text-gray-600 leading-relaxed mb-8">
                        ご入力いただいたメールアドレス ({form.email}) 宛に確認メールを送信しました。<br />
                        メール内のリンクをクリックして、登録を完了させてください。
                    </p>

                    <div className="space-y-4">
                        <Link href="/login" className="block w-full bg-[#bf0000] text-white font-bold py-3.5 rounded-xl hover:bg-black transition shadow-md">
                            ログインページへ
                        </Link>
                        <button onClick={() => window.location.reload()} className="text-gray-400 text-sm font-bold hover:text-gray-600 underline">
                            メールが届かない場合
                        </button>
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

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#bf0000] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? '登録処理中...' : 'アカウントを作成して認証メールを送信'}
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
