"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MdArrowBack, MdSave } from 'react-icons/md';
import Link from 'next/link';

export default function EditStoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [user, setUser] = useState<any>(null);

    const [form, setForm] = useState({
        title: '',
        excerpt: '',
        body: '',
        tags: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            // 1. Check Auth
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }
            setUser(session.user);

            // 2. Fetch Story
            const { data, error } = await supabase
                .from('stories')
                .select('*')
                .eq('id', id)
                .single();

            if (error || !data) {
                alert('記事が見つかりません');
                router.push('/stories');
                return;
            }

            // 3. Check Ownership
            if (data.author_id !== session.user.id) {
                alert('権限がありません');
                router.push('/stories');
                return;
            }

            // 4. Populate Form
            setForm({
                title: data.title,
                excerpt: data.excerpt,
                body: data.content,
                tags: (data.tags || []).join(', '),
            });
            setIsFetching(false);
        };

        fetchData();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
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
                        setIsLoading(false);
                        return; // Stop submission
                    }
                }
            } catch (e) {
                console.warn("Moderation check failed, proceeding anyway...", e);
            }
            // -----------------------------------

            const tagArray = form.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);

            const { error } = await supabase
                .from('stories')
                .update({
                    title: form.title,
                    excerpt: form.excerpt,
                    content: form.body,
                    tags: tagArray,
                    // updated_at column presumably missing
                })
                .eq('id', id);

            if (error) throw error;

            alert('更新しました');
            router.push(`/stories/${id}`);
            router.refresh();
        } catch (error: any) {
            console.error('Error updating story:', error);
            alert(`更新に失敗しました: ${error.message || error}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">読み込み中...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href={`/stories/${id}`} className="flex items-center gap-1 text-gray-500 hover:text-[#bf0000] font-bold text-sm transition">
                        <MdArrowBack /> 記事に戻る
                    </Link>
                    <h1 className="ml-4 text-lg font-bold text-gray-800">体験談を編集</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-2xl py-10">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">タイトル</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-1 focus:ring-[#bf0000] outline-none transition font-bold text-lg"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">概要（一覧表示用）</label>
                        <textarea
                            required
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-1 focus:ring-[#bf0000] outline-none transition"
                            value={form.excerpt}
                            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">本文 (HTMLタグ使用可)</label>
                        <textarea
                            required
                            rows={15}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-1 focus:ring-[#bf0000] outline-none transition font-mono text-sm leading-relaxed"
                            value={form.body}
                            onChange={(e) => setForm({ ...form, body: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">タグ（カンマ区切り）</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#bf0000] focus:ring-1 focus:ring-[#bf0000] outline-none transition"
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
                            {isLoading ? '保存中...' : <>変更を保存 <MdSave /></>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
