"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { MdArrowBack, MdCheck, MdEmail, MdPerson } from 'react-icons/md';

export default function ContactPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [property, setProperty] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: '',
        age: '',
        gender: '',
        occupation: '',
        currentPrefecture: '',
        duration: '',
        moveInDate: '',
        message: '物件に興味があり、内覧を希望します。よろしくお願いします。'
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            // 1. Get User
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Should be redirected by previous page but just in case
                router.push(`/login?redirect=/rooms/${id}/contact`);
                return;
            }
            setUser(session.user);

            // Fetch User Profile for pre-fill
            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (profile) {
                // Update form with profile data
                setForm(prev => ({
                    ...prev,
                    name: profile.display_name || '',
                    age: profile.age ? String(profile.age) : '',
                    gender: profile.gender === '男性' ? 'male' : profile.gender === '女性' ? 'female' : 'other',
                    occupation: profile.occupation || '',
                }));
            }

            // 2. Get Property
            const { data, error } = await supabase
                .from('listings')
                .select('*, host_id') // Ensure we get host_id
                .eq('id', id)
                .single();

            if (error) {
                console.error(error);
            } else {
                setProperty(data);
            }
            setLoading(false);
        };
        fetchData();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("お問い合わせにはログインが必要です。");
            router.push(`/login?redirect=/rooms/${id}/contact`);
            return;
        }
        if (!property) return;

        setSubmitting(true);

        try {
            // 1. Check if thread exists or create new
            // We need to find if a thread exists for this listing + seeker
            let threadId;

            // Note: RLS might prevent seeing threads, so we might need a stored procedure or just try insert
            // For now, let's try to find an existing thread.
            const { data: existingThreads } = await supabase
                .from('threads')
                .select('id')
                .eq('listing_id', id)
                .eq('seeker_id', user.id)
                .single();

            if (existingThreads) {
                threadId = existingThreads.id;
            } else {
                // Create Thread
                const { data: newThread, error: threadError } = await supabase
                    .from('threads')
                    .insert({
                        listing_id: id,
                        host_id: property.host_id,
                        seeker_id: user.id
                    })
                    .select()
                    .single();

                if (threadError) throw threadError;
                threadId = newThread.id;
            }

            // 2. Send Message
            const { error: msgError } = await supabase
                .from('messages')
                .insert({
                    thread_id: threadId,
                    sender_id: user.id,
                    content: `
【お問い合わせ内容】
名前: ${form.name}
年齢: ${form.age}
性別: ${form.gender}
職業: ${form.occupation}
入居予定: ${form.duration}
希望日: ${form.moveInDate || '未定'}

${form.message}
                    `.trim()
                });

            if (msgError) throw msgError;

            // 3. Send Email Notification
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            // Construct notification payload
            const recipientId = property.host_id; // Host is the recipient
            const senderName = form.name || user.user_metadata?.full_name || 'ユーザー';
            const messageContent = `
【お問い合わせ内容】
名前: ${form.name}
年齢: ${form.age}
性別: ${form.gender}
職業: ${form.occupation}
入居予定: ${form.duration}
希望日: ${form.moveInDate || '未定'}

${form.message}
            `.trim();

            if (token) {
                await fetch('/api/send-message-notification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        recipientId,
                        senderName, // API will ignore this now and refetch, but keeping for compatibility if needed or removed
                        messageContent,
                        threadId
                    })
                }).catch(err => console.error("Notification trigger failed", err));
            }

            setIsSubmitted(true);

        } catch (error: any) {
            console.error("Submission error:", error);
            alert("送信に失敗しました: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;

    if (!property) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">物件が見つかりませんでした</h1>
                <Link href="/search" className="text-[#bf0000] font-bold hover:underline flex items-center gap-1">
                    <MdArrowBack /> 検索に戻る
                </Link>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MdCheck size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">送信完了</h2>
                    <p className="text-gray-600 mb-6">
                        お問い合わせありがとうございます。<br />
                        ホストからの返信をお待ちください。
                    </p>
                    <Link href="/search" className="block w-full bg-[#bf0000] text-white font-bold py-3 rounded-xl hover:bg-black transition">
                        トップへ戻る
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Header */}
            <div className="bg-white border-b shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href={`/rooms/${id}`} className="text-gray-500 hover:text-gray-800 font-bold flex items-center gap-1">
                        <MdArrowBack /> 物件に戻る
                    </Link>
                    <h1 className="text-lg font-bold text-gray-800 ml-4 flex-1 text-center pr-20">お問い合わせ</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-2xl py-8">
                {/* Property Summary */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 mb-8">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                        {property.images && property.images[0] ? (
                            <img src={property.images[0]} className="w-full h-full object-cover" alt={property.title} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                        )}
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-800 text-sm md:text-base mb-2 line-clamp-2">{property.title}</h2>
                        <div className="text-xs text-gray-500 font-bold mb-1">{property.address || property.location}</div>
                        <div className="text-xl font-bold text-[#bf0000]">¥{(Number(property.price) / 10000).toFixed(1)}万 <span className="text-xs text-gray-500 font-normal">/ 月</span></div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">お名前 <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold"
                            placeholder="山田 太郎"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">性別 <span className="text-red-500">*</span></label>
                            <select
                                required
                                value={form.gender}
                                onChange={e => setForm({ ...form, gender: e.target.value })}
                                className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold bg-white"
                            >
                                <option value="">選択してください</option>
                                <option value="male">男性</option>
                                <option value="female">女性</option>
                                <option value="other">その他・無回答</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">年齢 <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                required
                                min="0"
                                max="100"
                                value={form.age}
                                onChange={e => setForm({ ...form, age: e.target.value })}
                                className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold"
                                placeholder="25"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">職業 <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={form.occupation}
                                onChange={e => setForm({ ...form, occupation: e.target.value })}
                                className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold"
                                placeholder="会社員"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">現在の都道府県 <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={form.currentPrefecture}
                                onChange={e => setForm({ ...form, currentPrefecture: e.target.value })}
                                className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold"
                                placeholder="東京都"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">入居予定期間 <span className="text-red-500">*</span></label>
                        <select
                            required
                            value={form.duration}
                            onChange={e => setForm({ ...form, duration: e.target.value })}
                            className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold bg-white"
                        >
                            <option value="">選択してください</option>
                            <option value="1-5months">1ヶ月〜5ヶ月</option>
                            <option value="6months+">半年以上</option>
                            <option value="1year+">1年以上</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">入居希望日</label>
                        <input
                            type="date"
                            value={form.moveInDate}
                            onChange={e => setForm({ ...form, moveInDate: e.target.value })}
                            className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">メッセージ <span className="text-red-500">*</span></label>
                        <textarea
                            required
                            rows={5}
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                            className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold resize-none"
                        ></textarea>
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={submitting} className="w-full bg-[#bf0000] text-white font-bold py-4 rounded-xl shadow-md hover:bg-black transition text-lg flex items-center justify-center gap-2 disabled:opacity-50">
                            <MdEmail /> {submitting ? '送信中...' : '送信する'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
