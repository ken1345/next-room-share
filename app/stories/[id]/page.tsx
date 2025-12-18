import Link from 'next/link';
import { MdArrowBack, MdArrowForward, MdCalendarToday, MdPerson, MdTag } from 'react-icons/md';
import { MOCK_STORIES } from '@/data/mock-stories';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function StoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    let story: any = null;

    // 1. Try finding in MOCK_STORIES (if ID looks numeric)
    if (!isNaN(Number(id))) {
        story = MOCK_STORIES.find(s => s.id === Number(id));
    }

    // 2. If not found, try fetching from Supabase (assuming UUID)
    if (!story) {
        const { data } = await supabase
            .from('stories')
            .select('*')
            .eq('id', id)
            .single();

        if (data) {
            story = {
                id: data.id,
                title: data.title,
                excerpt: data.excerpt,
                body: data.content,
                image: data.cover_image,
                tags: data.tags || [],
                author: "シェアハウス住人", // Generic author
                date: new Date(data.created_at).toLocaleDateString("ja-JP", { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')
            };
        }
    }

    if (!story) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">記事が見つかりませんでした</h1>
                    <p className="text-gray-500 mb-6">お探しの記事は削除されたか、URLが間違っている可能性があります。</p>
                    <Link href="/stories" className="inline-block bg-[#bf0000] text-white px-6 py-3 rounded-full font-bold hover:bg-black transition">
                        体験談一覧に戻る
                    </Link>
                </div>
            </div>
        );
    }



    return (
        <article className="min-h-screen bg-white font-sans pb-20">
            {/* Hero Image */}
            <div className="h-[40vh] md:h-[50vh] w-full bg-gray-900 relative">
                {story.image.startsWith('bg-') ? (
                    <div className={`absolute inset-0 ${story.image} bg-cover bg-center`}></div>
                ) : (
                    <img src={story.image} alt={story.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                )}

                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white container mx-auto max-w-4xl">
                    <Link href="/stories" className="inline-flex items-center gap-1 text-sm font-bold opacity-80 hover:opacity-100 transition mb-4">
                        <MdArrowBack /> 体験談一覧に戻る
                    </Link>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {story.tags.map((tag: string) => (
                            <span key={tag} className="text-sm font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                                <MdTag /> {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold leading-tight shadow-sm text-shadow">
                        {story.title}
                    </h1>
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto max-w-3xl px-6 py-12">
                <div className="flex items-center justify-between text-gray-500 text-sm font-bold border-b border-gray-100 pb-8 mb-10">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                            <MdPerson size={20} />
                        </div>
                        <div>
                            <div className="text-gray-400 text-xs">WRITER</div>
                            <div>{story.author}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <MdCalendarToday /> {story.date}
                    </div>
                </div>

                <div
                    className="prose prose-lg prose-red max-w-none prose-headings:font-bold prose-headings:text-gray-800 prose-p:text-gray-600 prose-p:leading-loose"
                    dangerouslySetInnerHTML={{ __html: story.body || '' }}
                >
                </div>

                {/* Footer Navigation */}
                <div className="mt-20 border-t border-gray-100 pt-10 text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">気になったら、まずは物件を探してみよう</h3>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link href="/stories" className="inline-flex items-center justify-center gap-2 bg-white text-gray-600 border-2 border-gray-200 w-full md:w-auto px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition shadow-lg hover:shadow-xl">
                            <MdArrowBack /> 一覧に戻る
                        </Link>
                        <Link href="/search" className="inline-flex items-center justify-center gap-2 bg-[#bf0000] text-white w-full md:w-auto px-8 py-4 rounded-full font-bold text-lg hover:bg-black transition shadow-lg hover:shadow-xl">
                            物件を探す
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    );
}
