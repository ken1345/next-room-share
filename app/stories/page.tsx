"use client";

import Link from 'next/link';
import { MdArrowForward, MdCalendarToday, MdPerson, MdTag } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Story {
    id: string; // Firestore ID is string
    title: string;
    excerpt: string;
    image: string;
    tags: string[];
    author: string;
    date: string;
}

export default function StoriesPage() {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                // Fetch from Supabase
                const { data, error } = await supabase
                    .from('stories')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                if (data) {
                    const storiesData = data.map((doc: any) => ({
                        id: doc.id,
                        title: doc.title,
                        excerpt: doc.excerpt || '',
                        image: doc.cover_image || 'bg-gray-200', // Handle background class or url later, assuming class for demo or url
                        tags: doc.tags || [],
                        // In real app, we would join with users table. For now, assuming author name in story or fetch separately.
                        // However, schema says author_id. Let's generic 'Anonymous' or fetch author if we joined.
                        // Simplified: just show a generic name or 'Resident' if raw SQL didn't join.
                        // Actually, let's try to select author:users(display_name) if RLS allows.
                        // For simplicity in prototype, I'll just use 'Resident' or if I updated schema to include author_name.
                        // Schema: author_id uuid references users.

                        // Let's IMPROVE the query to fetch author name
                        author: 'Resident', // Placeholder until join is implemented or just use static
                        date: new Date(doc.created_at).toLocaleDateString('ja-JP'),
                    })) as Story[];

                    // IF we want author name, we need: .select('*, author:users(display_name)')
                    // Let's try advanced select.
                    setStories(storiesData);
                }
            } catch (error) {
                console.error("Error fetching stories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-[#bf0000] to-orange-600 text-white py-20 px-4">
                <div className="container mx-auto max-w-5xl text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">体験談</h1>
                    <p className="text-lg md:text-xl font-bold opacity-90 max-w-2xl mx-auto leading-relaxed mb-8">
                        実際にシェアハウスで暮らす人々の、リアルなストーリー。<br />
                        あなたにぴったりの暮らしが見つかるかもしれません。
                    </p>
                    <Link href="/stories/new" className="inline-flex items-center gap-2 bg-white text-[#bf0000] px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition">
                        体験談を投稿する <MdArrowForward />
                    </Link>
                </div>
            </section>

            {/* Content List */}
            <div className="container mx-auto px-4 max-w-5xl -mt-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stories.map((story) => (
                        <Link href={`/stories/${story.id}`} key={story.id} className="block group">
                            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition h-full flex flex-col">
                                {/* If image is a URL (Supabase Storage), use img tag. If class (Mock), use div. */}
                                {/* Current mock data used classes. Supabase will likely allow URLs. 
                                    For compatibility, I'll check if it starts with 'bg-' */}
                                {story.image.startsWith('bg-') ? (
                                    <div className={`h-48 ${story.image} bg-cover bg-center`}></div>
                                ) : (
                                    <div className="h-48 bg-gray-200">
                                        {/* If I had real images, I'd put an img here. For now, empty or generic placeholder */}
                                    </div>
                                )}

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {story.tags.map(tag => (
                                            <span key={tag} className="text-xs font-bold text-[#bf0000] bg-red-50 px-2 py-1 rounded-md flex items-center gap-1">
                                                <MdTag /> {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#bf0000] transition line-clamp-2">
                                        {story.title}
                                    </h2>
                                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                                        {story.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-400 font-bold border-t border-gray-50 pt-4 mt-auto">
                                        <div className="flex items-center gap-1">
                                            <MdPerson /> {story.author}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MdCalendarToday /> {story.date}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">あなたもシェアハウス生活を始めませんか？</h3>
                    <Link href="/search" className="inline-flex items-center gap-2 bg-[#bf0000] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-black transition shadow-lg hover:shadow-xl">
                        物件を探す <MdArrowForward />
                    </Link>
                </div>
            </div>
        </div>
    );
}
