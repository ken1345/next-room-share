import Link from 'next/link';
import { MdAdd, MdCardGiftcard, MdLocationOn, MdChevronLeft } from 'react-icons/md';
import { supabase } from '@/lib/supabase';
import SearchAreaFilter from '@/components/SearchAreaFilter';

export const revalidate = 0;

export default async function GivePage({ searchParams }: { searchParams: { area?: string } }) {
    const areaQuery = searchParams?.area || '';

    let query = supabase
        .from('giveaways')
        .select('*, users(display_name, photo_url)')
        .order('created_at', { ascending: false });

    if (areaQuery) {
        query = query.ilike('location', `%${areaQuery}%`);
    }

    const { data: giveaways } = await query;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/" className="font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1">
                        <MdChevronLeft className="text-xl" /> トップ
                    </Link>
                    <div className="text-center">
                        <h1 className="font-bold text-xl text-gray-800 flex items-center justify-center gap-2">
                            <MdCardGiftcard className="text-[#bf0000]" /> あげたい
                        </h1>
                        <p className="text-xs text-gray-500 font-bold mt-1">不要になった家具や家電を、必要としている人に譲りましょう</p>
                    </div>
                    <div className="w-16"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Search & Post */}
                <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="w-full md:w-auto flex-1">
                            <SearchAreaFilter />
                        </div>
                        <Link href="/give/new">
                            <button className="w-full md:w-auto bg-[#bf0000] text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-[#900000] transition flex items-center justify-center gap-2 whitespace-nowrap">
                                <MdAdd className="text-xl" /> 投稿する
                            </button>
                        </Link>
                    </div>
                </div>

                {/* List (Stack) */}
                <div className="space-y-4">
                    {giveaways && giveaways.length > 0 ? (
                        giveaways.map((item: any) => (
                            <Link key={item.id} href={`/give/${item.id}`} className="block">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition">
                                    {/* Image Section */}
                                    <div className="h-48 md:h-auto md:w-64 bg-gray-200 relative shrink-0">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src="/nophoto-notext.webp" alt="No Image" className="w-full h-full object-cover" />
                                        )}
                                        {item.location && (
                                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                                <MdLocationOn /> {item.location}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h2 className="font-bold text-gray-800 mb-2 line-clamp-2 md:text-lg">{item.title}</h2>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1 whitespace-pre-wrap">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center gap-2 border-t pt-3 mt-auto">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                                {item.users?.photo_url ? (
                                                    <img src={item.users.photo_url} alt={item.users.display_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-300"></div>
                                                )}
                                            </div>
                                            <span className="text-xs font-bold text-gray-600">{item.users?.display_name || 'ゲスト'}</span>
                                            <span className="text-xs text-gray-400 ml-auto">
                                                {new Date(item.created_at).toLocaleString('ja-JP', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-400">
                            <p className="font-bold text-lg">まだ投稿がありません</p>
                            <p className="text-sm">不要な家具や家電があれば投稿してみましょう！</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
