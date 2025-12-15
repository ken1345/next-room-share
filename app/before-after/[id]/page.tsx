"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MdArrowBack, MdArrowForward, MdCalendarToday, MdPerson } from 'react-icons/md';

export default function BeforeAfterDetailPage() {
    const params = useParams();
    const id = params?.id;
    const router = useRouter(); // Added router
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null); // Added currentUser state

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            // Fetch Session
            const { data: { session } } = await supabase.auth.getSession();
            setCurrentUser(session?.user || null);

            const { data, error } = await supabase
                .from('before_after_posts')
                .select(`
                  *,
                  user:users ( display_name )
                `)
                .eq('id', id)
                .single();

            if (error) {
                console.error("Error fetching post:", error);
            }
            if (data) setPost(data);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm('本当に削除しますか？この操作は取り消せません。')) return;

        const { error } = await supabase
            .from('before_after_posts')
            .delete()
            .eq('id', id);

        if (error) {
            alert('削除に失敗しました: ' + error.message);
        } else {
            alert('削除しました。');
            router.push('/before-after');
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">読み込み中...</div>;

    if (!post) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-500">
            <p className="mb-4">投稿が見つかりませんでした。</p>
            <Link href="/before-after" className="text-[#bf0000] font-bold hover:underline">一覧に戻る</Link>
        </div>
    );

    const isAuthor = currentUser && post.user_id === currentUser.id;

    return (
        <div className="min-h-screen bg-gray-50 py-12 font-sans">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Nav */}
                <div className="mb-6 flex justify-between items-center">
                    <Link href="/before-after" className="inline-flex items-center gap-1 text-gray-500 hover:text-[#bf0000] font-bold">
                        <MdArrowBack /> 一覧に戻る
                    </Link>

                    {isAuthor && (
                        <button
                            onClick={handleDelete}
                            className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded transition text-sm border border-red-200"
                        >
                            削除する
                        </button>
                    )}
                </div>

                {/* Main Content */}
                <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-gray-50">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1 font-bold bg-gray-100 px-2 py-1 rounded">
                                <MdPerson /> {post.user?.display_name || 'User'}
                            </span>
                            <span className="flex items-center gap-1 font-bold">
                                <MdCalendarToday /> {new Date(post.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{post.title}</h1>
                    </div>

                    {/* Images Comparison - Vertical on Mobile, Side-by-Side on Desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 h-[500px] md:h-[600px] relative">
                        {/* Before */}
                        <div className="relative h-full bg-gray-100 group">
                            <img src={post.before_image_url} alt="Before" className="w-full h-full object-cover" />
                            <span className="absolute top-4 left-4 bg-gray-800/80 text-white font-bold px-3 py-1 rounded backdrop-blur-md shadow-sm">
                                BEFORE
                            </span>
                        </div>

                        {/* Arrow (Absolute Center) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex">
                            <div className="bg-white text-[#bf0000] rounded-full p-2 shadow-xl border border-gray-100">
                                <MdArrowForward size={32} />
                            </div>
                        </div>
                        {/* Arrow for Mobile (Rotated) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 md:hidden rotate-90">
                            <div className="bg-white text-[#bf0000] rounded-full p-2 shadow-xl border border-gray-100">
                                <MdArrowForward size={24} />
                            </div>
                        </div>

                        {/* After */}
                        <div className="relative h-full bg-gray-100 group">
                            <img src={post.after_image_url} alt="After" className="w-full h-full object-cover" />
                            <span className="absolute top-4 right-4 bg-[#bf0000]/90 text-white font-bold px-3 py-1 rounded backdrop-blur-md shadow-sm">
                                AFTER
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="p-8 md:p-10 bg-white">
                        <h2 className="text-lg font-bold text-gray-700 mb-4 border-l-4 border-[#bf0000] pl-3">
                            こだわりポイント・感想
                        </h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">
                            {post.description || '（コメントはありません）'}
                        </p>
                    </div>
                </article>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 font-bold mb-4">あなたの部屋もシェアしませんか？</p>
                    <Link href="/before-after/new" className="inline-block bg-[#bf0000] text-white font-bold px-8 py-3 rounded-full shadow-md hover:bg-[#900000] transition">
                        投稿する
                    </Link>
                </div>
            </div>
        </div>
    );
}
