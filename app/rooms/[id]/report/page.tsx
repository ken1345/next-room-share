"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MdFlag, MdArrowBack, MdCheckCircle, MdError } from 'react-icons/md';
import Link from 'next/link';

export default function ReportPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [reason, setReason] = useState('inappropriate');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [user, setUser] = useState<any>(null);

    // Check auth
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Redirect to login if accessed directly
                router.push(`/login?redirect=/rooms/${id}/report`);
            } else {
                setUser(session.user);
            }
        };
        checkAuth();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('reports').insert({
            listing_id: id,
            reporter_id: user.id,
            reason,
            description
        });

        if (error) {
            console.error('Report submission failed:', error);
            alert('通報の送信に失敗しました。時間をおいて再度お試しください。');
            setLoading(false);
            return;
        }

        setLoading(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <MdCheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">通報を受け付けました</h1>
                    <p className="text-gray-500 mb-6">
                        ご報告ありがとうございます。内容を確認の上、適切に対処いたします。
                    </p>
                    <Link href={`/rooms/${id}`} className="block w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 transition">
                        物件ページに戻る
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans">
            <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-red-50 p-6 border-b border-red-100 flex items-center gap-3">
                    <MdFlag size={30} className="text-[#bf0000]" />
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">物件を通報する</h1>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">通報の理由</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                        >
                            <option value="inappropriate">不適切なコンテンツ</option>
                            <option value="scam">詐欺・スパムの疑い</option>
                            <option value="discrimination">差別的な内容</option>
                            <option value="incorrect">事実と異なる情報</option>
                            <option value="other">その他</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">詳細（任意）</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="問題の詳細をご記入ください..."
                        ></textarea>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Link href={`/rooms/${id}`} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-200 transition text-center flex items-center justify-center gap-1">
                            キャンセル
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-[#bf0000] text-white font-bold py-3 rounded-lg hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? '送信中...' : '報告する'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
