"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { MdArrowBack, MdArrowForward, MdCameraAlt } from 'react-icons/md';

export default function BeforeAfterListPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const { data, error } = await supabase
                .from('before_after_posts')
                .select(`
                  *,
                  user:users ( display_name )
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching posts:", error);
            }

            if (data) setPosts(data);
            setLoading(false);
        };
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-8 font-sans">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-[#bf0000] font-bold mb-2">
                            <MdArrowBack /> トップに戻る
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-800">
                            みんなのビフォーアフター
                        </h1>
                        <p className="text-gray-500 font-bold mt-1">
                            {posts.length}件のDIY・模様替え事例
                        </p>
                    </div>

                    <Link href="/before-after/new" className="bg-[#bf0000] text-white font-bold px-6 py-3 rounded-full shadow-md hover:bg-[#900000] transition flex items-center gap-2">
                        <MdCameraAlt />
                        <span>投稿する</span>
                    </Link>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20 text-gray-400">
                        読み込み中...
                    </div>
                )}

                {/* Empty State */}
                {!loading && posts.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <p className="text-gray-400 mb-4">まだ投稿はありません。</p>
                        <Link href="/before-after/new" className="text-[#bf0000] font-bold hover:underline">
                            一番乗りで投稿する
                        </Link>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group flex flex-col">
                            {/* Images Area */}
                            <div className="flex h-56 relative border-b border-gray-50">
                                {/* Before */}
                                <div className="flex-1 relative overflow-hidden bg-gray-100">
                                    <img src={post.before_image_url} alt="Before" className="w-full h-full object-cover" />
                                    <span className="absolute top-2 left-2 bg-gray-600/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm z-10">BEFORE</span>
                                </div>

                                {/* Arrow */}
                                <div className="absolute inset-y-0 left-1/2 -ml-4 flex items-center justify-center z-20">
                                    <div className="bg-white rounded-full p-1.5 shadow-md text-[#bf0000]">
                                        <MdArrowForward />
                                    </div>
                                </div>

                                {/* After */}
                                <div className="flex-1 relative overflow-hidden bg-gray-100">
                                    <img src={post.after_image_url} alt="After" className="w-full h-full object-cover" />
                                    <span className="absolute top-2 right-2 bg-[#bf0000]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">AFTER</span>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 leading-snug group-hover:text-[#bf0000] transition">
                                    {post.title}
                                </h3>
                                {post.description && (
                                    <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                                        {post.description}
                                    </p>
                                )}

                                <div className="mt-auto pt-3 border-t border-gray-50 flex justify-between items-center text-xs font-bold text-gray-400">
                                    <span>by {post.user?.display_name || 'User'}</span>
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
