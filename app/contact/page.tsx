"use client";
import React, { useState } from 'react';
import { MdEmail } from 'react-icons/md';

export default function ContactPage() {
    // State for Turnstile
    const [turnstileToken, setTurnstileToken] = useState('');

    // Setup global callback for Turnstile
    React.useEffect(() => {
        // @ts-ignore
        window.onTurnstileSuccess = (token: string) => {
            setTurnstileToken(token);
        };

        return () => {
            // @ts-ignore
            window.onTurnstileSuccess = undefined;
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Form elements access (simple way)
        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const category = (form.elements.namedItem('category') as HTMLSelectElement).value;
        const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

        // Check Turnstile token (from state)
        if (!turnstileToken) {
            alert("セキュリティチェックを行ってください（チェックボックスをクリック）。\nもし表示されていない場合はページを更新してください。");
            return;
        }

        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, category, message, turnstileToken }),
            });

            if (res.ok) {
                setSubmitted(true);
                window.scrollTo(0, 0);
            } else {
                const data = await res.json();
                alert(`送信に失敗しました: ${data.error || '不明なエラー'}`);
            }
        } catch (error) {
            console.error("Error sending inquiry:", error);
            alert("エラーが発生しました。");
        }
    };

    if (submitted) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-lg mx-auto bg-white p-12 rounded-xl shadow-sm border border-gray-100">
                    <MdEmail className="text-6xl text-green-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">送信完了</h2>
                    <p className="text-gray-600 mb-8">
                        お問い合わせありがとうございます。<br />
                        担当者が確認次第、折り返しご連絡させていただきます。
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-[#bf0000] text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-[#900000] transition"
                    >
                        トップページへ戻る
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-16 text-gray-700">
            <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-gray-800">
                    <MdEmail className="text-[#bf0000]" /> お問い合わせ
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">お名前 <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="name"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#bf0000] focus:border-transparent transition"
                            placeholder="山田 太郎"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">メールアドレス <span className="text-red-500">*</span></label>
                        <input
                            type="email"
                            id="email"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#bf0000] focus:border-transparent transition"
                            placeholder="example@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-bold text-gray-700 mb-1">お問い合わせ種別</label>
                        <select
                            id="category"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#bf0000] focus:border-transparent transition bg-white"
                        >
                            <option>サービスについて</option>
                            <option>不具合の報告</option>
                            <option>アカウントについて</option>
                            <option>その他</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-1">お問い合わせ内容 <span className="text-red-500">*</span></label>
                        <textarea
                            id="message"
                            required
                            rows={6}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#bf0000] focus:border-transparent transition"
                            placeholder="お問い合わせ内容をご記入ください..."
                        ></textarea>
                    </div>

                    {/* Cloudflare Turnstile */}
                    <div className="min-h-[65px]">
                        <div
                            className="cf-turnstile"
                            data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                            data-callback="onTurnstileSuccess"
                        ></div>
                    </div>
                    {/* Using standard script tag because Next/Script logic can sometimes be tricky with inline execution order for callbacks */}
                    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-[#bf0000] text-white font-bold py-4 rounded-lg shadow-md hover:bg-[#900000] transition transform hover:-translate-y-0.5"
                        >
                            送信する
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
