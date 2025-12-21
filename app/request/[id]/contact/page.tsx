import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { MdArrowBack, MdCheck, MdEmail } from 'react-icons/md';
import Honeypot from '@/components/Honeypot';

export default function RequestContactPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [req, setReq] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [honeypot, setHoneypot] = useState('');

    const [form, setForm] = useState({
        message: '投稿を拝見しました。詳しくお話しできますでしょうか？'
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push(`/login?redirect=/request/${id}/contact`);
                return;
            }
            setUser(session.user);

            const { data: requestData, error: requestError } = await supabase
                .from('room_requests')
                .select('*')
                .eq('id', id)
                .single();

            if (requestError) {
                console.error(requestError);
            } else {
                // Fetch poster profile explicitly
                const { data: posterData } = await supabase
                    .from('users')
                    .select('display_name')
                    .eq('id', requestData.user_id)
                    .single();

                setReq({ ...requestData, users: posterData });
            }

            setLoading(false);
        };
        fetchData();
    }, [id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Bot Check
        if (honeypot) return;

        if (!user || !req) return;

        setSubmitting(true);

        try {
            // Find existing thread for this request + current user (as host/offerer)
            // Ideally, the person contacting a 'request' is a potential HOST (or just another user).
            // In 'threads' table: 
            // - seeker_id was traditionally the person contacting.
            // - host_id was the content owner.
            // HERE: Content owner is 'req.user_id'. Current user is contacting them.
            // So: host_id = req.user_id, seeker_id = user.id.

            let threadId;

            // Check if thread exists
            const { data: existingThreads } = await supabase
                .from('threads')
                .select('id')
                .eq('request_id', id)
                .eq('seeker_id', user.id)
                .eq('host_id', req.user_id) // Ensure we match the owner
                .single();

            if (existingThreads) {
                threadId = existingThreads.id;
            } else {
                // Create Thread
                const { data: newThread, error: threadError } = await supabase
                    .from('threads')
                    .insert({
                        request_id: id,
                        host_id: req.user_id, // Content Owner
                        seeker_id: user.id    // Contacting User
                    })
                    .select()
                    .single();

                if (threadError) throw threadError;
                threadId = newThread.id;
            }

            // Send Message
            const { error: msgError } = await supabase
                .from('messages')
                .insert({
                    thread_id: threadId,
                    sender_id: user.id,
                    content: form.message
                });

            if (msgError) throw msgError;

            // Optional: Send Notification (skipping for now to focus on core logic, or reuse existing API)

            setIsSubmitted(true);

        } catch (error: any) {
            console.error(error);
            alert("送信に失敗しました: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;

    if (!req) return <div>Request not found</div>;

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MdCheck size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">送信完了</h2>
                    <p className="text-gray-600 mb-6">メッセージを送信しました。</p>
                    <Link href={`/request/${id}`} className="block w-full bg-gray-100 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-200 transition">
                        戻る
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href={`/request/${id}`} className="text-gray-500 hover:text-gray-800 font-bold flex items-center gap-1">
                        <MdArrowBack /> 戻る
                    </Link>
                    <h1 className="font-bold text-lg text-gray-800 ml-4">メッセージを送る</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
                    <h2 className="font-bold text-gray-800 mb-2">送信先: {req.users?.display_name || 'ゲスト'}</h2>
                    <p className="text-sm text-gray-800 font-bold">{req.title}</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">メッセージ</label>
                        <textarea
                            required
                            rows={8}
                            className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 focus:border-[#bf0000] outline-none font-bold resize-none"
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="mb-0">
                        <Honeypot onChange={setHoneypot} />
                    </div>

                    <button type="submit" disabled={submitting} className="w-full bg-[#bf0000] text-white font-bold py-4 rounded-xl shadow-md hover:bg-black transition flex items-center justify-center gap-2">
                        <MdEmail /> {submitting ? '送信中...' : '送信する'}
                    </button>
                </form>
            </div>
        </div>
    );
}
