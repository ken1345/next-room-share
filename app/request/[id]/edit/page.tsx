"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MdArrowBack } from 'react-icons/md';
import Link from 'next/link';

export default function EditRequestPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: '',
        budget_max: '',
        area: '',
        move_in_date: '',
        content: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data, error } = await supabase
                .from('room_requests')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id) // Ensure owner
                .single();

            if (error || !data) {
                alert("データが見つかりません、または権限がありません。");
                router.push('/account');
                return;
            }

            setForm({
                title: data.title,
                budget_max: data.budget_max ? String(data.budget_max) : '',
                area: data.area || '',
                move_in_date: data.move_in_date || '',
                content: data.content || ''
            });
            setLoading(false);
        };
        fetchData();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const { error } = await supabase
            .from('room_requests')
            .update({
                title: form.title,
                budget_max: form.budget_max ? parseInt(form.budget_max) : null,
                area: form.area,
                move_in_date: form.move_in_date,
                content: form.content
            })
            .eq('id', id);

        if (error) {
            alert("更新エラー: " + error.message);
        } else {
            router.push('/account');
        }
        setSaving(false);
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href="/account" className="text-gray-500 hover:text-gray-800 font-bold flex items-center gap-1">
                        <MdArrowBack /> キャンセル
                    </Link>
                    <h1 className="font-bold text-lg ml-4">リクエストを編集</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">タイトル</label>
                        <input
                            type="text"
                            required
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 font-bold"
                        />
                    </div>
                    {/* Add other fields similarly (simplified for brevity, can match create form) */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">希望エリア</label>
                        <input
                            type="text"
                            value={form.area}
                            onChange={e => setForm({ ...form, area: e.target.value })}
                            className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 font-bold"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">予算上限 (円)</label>
                            <input
                                type="number"
                                value={form.budget_max}
                                onChange={e => setForm({ ...form, budget_max: e.target.value })}
                                className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">入居希望日</label>
                            <input
                                type="date"
                                value={form.move_in_date}
                                onChange={e => setForm({ ...form, move_in_date: e.target.value })}
                                className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 font-bold"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">詳細内容</label>
                        <textarea
                            required
                            rows={10}
                            value={form.content}
                            onChange={e => setForm({ ...form, content: e.target.value })}
                            className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 font-bold"
                        />
                    </div>

                    <button type="submit" disabled={saving} className="w-full bg-[#bf0000] text-white font-bold py-4 rounded-xl shadow-md hover:bg-black transition">
                        {saving ? '保存中...' : '保存する'}
                    </button>
                </form>
            </div>
        </div>
    );
}
