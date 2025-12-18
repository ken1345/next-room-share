import Link from 'next/link';
import { MdArrowForward, MdCalendarToday, MdPerson, MdTag } from 'react-icons/md';
import { MOCK_STORIES } from '@/data/mock-stories';
import { supabase } from '@/lib/supabase';

export const revalidate = 0; // Ensure fresh data on every request

export default async function StoriesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    // 1. Fetch DB Stories
    const { data: dbStoriesRaw } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

    // 2. Map DB Stories to match MOCK_STORIES structure
    const dbStories = (dbStoriesRaw || []).map(s => ({
        id: s.id, // Keep as UUID string
        title: s.title,
        excerpt: s.excerpt,
        // content/body not needed for list view
        image: s.cover_image,
        tags: s.tags || [],
        author: "シェアハウス住人", // Generic author for now
        date: new Date(s.created_at).toLocaleDateString("ja-JP", { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')
    }));

    // 3. Deduplicate: Filter mocks that have same title as DB stories
    const dbTitles = new Set(dbStories.map(s => s.title));
    const filteredMocks = MOCK_STORIES.filter(s => !dbTitles.has(s.title));

    // 4. Merge
    const allStories = [...dbStories, ...filteredMocks];

    // 5. Pagination Logic
    const params = await searchParams;
    const page = Number(params?.page) || 1;
    const itemsPerPage = 8;
    const totalPages = Math.ceil(allStories.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const stories = allStories.slice(startIndex, startIndex + itemsPerPage);

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
                        体験談を投稿する
                    </Link>
                </div>
            </section>

            {/* Content List */}
            <div className="container mx-auto px-4 max-w-4xl -mt-10 relative z-10">
                <div className="grid grid-cols-1 gap-6">
                    {stories.map((story) => (
                        <Link href={`/stories/${story.id}`} key={story.id} className="block group">
                            <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition h-full flex flex-col md:flex-row">
                                {story.image.startsWith('bg-') ? (
                                    <div className={`h-48 md:h-auto md:w-64 shrink-0 ${story.image} bg-cover bg-center`}></div>
                                ) : (
                                    <div className="h-48 md:h-auto md:w-64 shrink-0 bg-gray-200 relative">
                                        <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {story.tags.map((tag: string) => (
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-12">
                        {page > 1 ? (
                            <Link href={`/stories?page=${page - 1}`} className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full font-bold hover:bg-gray-50 transition">
                                前へ
                            </Link>
                        ) : (
                            <span className="bg-gray-100 border border-gray-200 text-gray-300 px-4 py-2 rounded-full font-bold cursor-not-allowed">
                                前へ
                            </span>
                        )}
                        <span className="font-bold text-gray-600">
                            {page} / {totalPages}
                        </span>
                        {page < totalPages ? (
                            <Link href={`/stories?page=${page + 1}`} className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full font-bold hover:bg-gray-50 transition">
                                次へ
                            </Link>
                        ) : (
                            <span className="bg-gray-100 border border-gray-200 text-gray-300 px-4 py-2 rounded-full font-bold cursor-not-allowed">
                                次へ
                            </span>
                        )}
                    </div>
                )}

                {/* CTA */}
                <div className="mt-16 text-center">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">あなたもシェアハウス生活を始めませんか？</h3>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link href="/search" className="inline-flex items-center justify-center gap-2 bg-[#bf0000] text-white w-full md:w-auto px-8 py-4 rounded-full font-bold text-lg hover:bg-black transition shadow-lg hover:shadow-xl">
                            物件を探す
                        </Link>
                        <Link href="/stories/new" className="inline-flex items-center justify-center gap-2 bg-white text-[#bf0000] border-2 border-[#bf0000] w-full md:w-auto px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition shadow-lg hover:shadow-xl">
                            体験談を投稿する
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
