"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { MdArrowBack } from 'react-icons/md';

export default function NewRequestPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        budget_max: '',
        area: '',
        move_in_date: '',
        content: ''
    });

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!user) {
                router.push('/login?redirect=/request/new');
            }
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.content) {
            alert("必須項目（タイトル、詳細）を入力してください。");
            return;
        }

        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("投稿するにはログインが必要です。");
                router.push('/login'); // Assuming login page exists
                return;
            }

            const { error } = await supabase.from('room_requests').insert({
                user_id: user.id,
                title: form.title,
                budget_max: form.budget_max ? parseInt(form.budget_max) : null,
                area: form.area,
                move_in_date: form.move_in_date || null,
                content: form.content
            });

            if (error) throw error;

            alert("投稿しました！");
            router.push('/request');
            router.refresh();

        } catch (error) {
            console.error(error);
            alert("投稿に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center gap-2">
                    <Link href="/request" className="text-gray-500 hover:text-gray-800">
                        <MdArrowBack className="text-2xl" />
                    </Link>
                    <h1 className="font-bold text-lg">借りたいリクエストを投稿</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-lg">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-6">

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">タイトル <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:border-[#bf0000]"
                            placeholder="例：新宿まで30分圏内で探しています"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">エリア希望</label>
                            <input
                                type="text"
                                className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:border-[#bf0000]"
                                placeholder="例：中央線沿い"
                                value={form.area}
                                onChange={e => setForm({ ...form, area: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">上限予算 (円)</label>
                            <input
                                type="number"
                                className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:border-[#bf0000]"
                                placeholder="60000"
                                value={form.budget_max}
                                onChange={e => setForm({ ...form, budget_max: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">入居希望日</label>
                        <input
                            type="date"
                            className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:border-[#bf0000]"
                            value={form.move_in_date}
                            onChange={e => setForm({ ...form, move_in_date: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">詳細・自己紹介 <span className="text-red-500">*</span></label>
                        <textarea
                            className="w-full border rounded-lg p-3 text-gray-800 focus:outline-none focus:border-[#bf0000] h-40"
                            placeholder="希望条件や自己紹介を詳しく書いてください。&#10;例：20代社会人です。リモートワーク中心なので静かな環境を希望します..."
                            value={form.content}
                            onChange={e => setForm({ ...form, content: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-[#bf0000] text-white font-bold py-4 rounded-lg shadow-md hover:opacity-90 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? '投稿中...' : 'リクエストを投稿する'}
                    </button>

                </form>
            </div>
        </div>
    );
}
