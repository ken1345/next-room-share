"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MdArrowBack, MdSend } from 'react-icons/md';
import Link from 'next/link';

export default function NewStoryPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<any>(null); // Supabase User
    const [checkingAuth, setCheckingAuth] = useState(true);

    const [form, setForm] = useState({
        title: '',
        excerpt: '',
        body: '',
        tags: '',
    });
    const [botCheck, setBotCheck] = useState(''); // Honeypot

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Redirect if not logged in
                router.push('/login?redirect=/stories/new');
            } else {
                setUser(session.user);
            }
            setCheckingAuth(false);
        };
        checkUser();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return; // Should not happen due to redirect

        // 1. Honeypot Check
        if (botCheck) {
            router.push('/stories'); // Fake success
            return;
        }

        // 2. Client-side Rate Limit (5 mins)
        const lastPostTime = localStorage.getItem('last_story_time');
        if (lastPostTime && Date.now() - Number(lastPostTime) < 5 * 60 * 1000) {
            alert('投稿間隔が短すぎます。しばらく待ってから再度お試しください。');
            return;
        }

        setIsLoading(true);

        try {
            // 3. Server-side Rate Limit (DB Check)
            const { data: recentStories } = await supabase
                .from('stories')
                .select('created_at')
                .eq('author_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1);

            if (recentStories && recentStories.length > 0) {
                const lastTime = new Date(recentStories[0].created_at).getTime();
                if (Date.now() - lastTime < 5 * 60 * 1000) {
                    alert('投稿間隔が短すぎます。しばらく待ってから再度お試しください。');
                    return; // Finally block will stop loading
                }
            }

            // Pick a random color for the image placeholder
            const colors = ['bg-orange-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-red-100', 'bg-gray-100'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            // --- AI Content Moderation Check ---
            try {
                const textToCheck = `${form.title}\n${form.excerpt}\n${form.body}`;
                const modResponse = await fetch('/api/moderation/check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: textToCheck }),
                });

                if (modResponse.ok) {
                    const modResult = await modResponse.json();
                    if (modResult.flagged) {
                        alert(`投稿内容に不適切な表現が含まれている可能性があります。\n(理由: ${modResult.categories.join(', ')})`);
                        return; // Stop submission
                    }
                }
            } catch (e) {
                console.warn("Moderation check failed, proceeding anyway...", e);
            }
            // -----------------------------------

            // Parse tags
            const tagArray = form.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);

            // Create document in 'stories' table
            const { error } = await supabase
                .from('stories')
                .insert({
                    title: form.title,
                    excerpt: form.excerpt,
                    content: form.body,
                    author_id: user.id,
                    cover_image: randomColor,
                    tags: tagArray,
                });

            if (error) throw error;

            // Update Client Timestamp
            localStorage.setItem('last_story_time', String(Date.now()));

            // Redirect to stories list
            router.push('/stories');
        } catch (error) {
            console.error('Error adding story:', error);
            alert('投稿に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    if (checkingAuth) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) return null; // Will redirect

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href="/stories" className="flex items-center gap-1 text-gray-500 hover:text-[#bf0000] font-bold text-sm transition">
                        <MdArrowBack /> 一覧に戻る
                    </Link>
                    <h1 className="ml-4 text-lg font-bold text-gray-800">体験談を投稿する</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-2xl py-10">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
                    {/* Honeypot Field */}
                    <input
                        type="text"
                        name="bot_check"
                        value={botCheck}
                        onChange={(e) => setBotCheck(e.target.value)}
                        style={{ display: 'none' }}
                        tabIndex={-1}
                        autoComplete="off"
                    />

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">タイトル</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-1 focus:ring-[#bf0000] outline-none transition font-bold text-lg placeholder-gray-300"
                            placeholder="例：シェアハウスで人生が変わった話"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">概要（一覧表示用）</label>
                        <textarea
                            required
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-1 focus:ring-[#bf0000] outline-none transition placeholder-gray-300"
                            placeholder="記事の簡単な要約を入力してください..."
                            value={form.excerpt}
                            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">本文 (HTMLタグ使用可)</label>
                        <div className="text-xs text-gray-400 mb-2">
                            ※簡易的な投稿フォームのため、&lt;h3&gt;や&lt;p&gt;タグを使って整形できます。
                        </div>
                        <textarea
                            required
                            rows={10}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-1 focus:ring-[#bf0000] outline-none transition font-mono text-sm leading-relaxed placeholder-gray-300"
                            placeholder="<h3>見出し</h3><p>本文をここに入力...</p>"
                            value={form.body}
                            onChange={(e) => setForm({ ...form, body: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">タグ（カンマ区切り）</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-1 focus:ring-[#bf0000] outline-none transition placeholder-gray-300"
                            placeholder="例：エンジニア, 国際交流, ペット可"
                            value={form.tags}
                            onChange={(e) => setForm({ ...form, tags: e.target.value })}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full bg-[#bf0000] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-black transition flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? '送信中...' : <>投稿する <MdSend /></>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
