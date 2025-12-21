import Link from 'next/link';
import { MdAdd, MdCardGiftcard, MdLocationOn, MdChevronLeft } from 'react-icons/md';
import { supabase } from '@/lib/supabase';

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
                        <form className="w-full md:w-auto flex-1 flex items-center gap-2">
                            <div className="relative flex-1">
                                <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    name="area"
                                    defaultValue={areaQuery}
                                    placeholder="エリアで絞り込み (例: 渋谷区)"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:border-[#bf0000]"
                                />
                            </div>
                            <button type="submit" className="bg-gray-800 text-white font-bold px-4 py-3 rounded-lg hover:bg-black transition text-sm whitespace-nowrap">
                                検索
                            </button>
                        </form>
                        <Link href="/give/new">
                            <button className="w-full md:w-auto bg-[#bf0000] text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-[#900000] transition flex items-center justify-center gap-2 whitespace-nowrap">
                                <MdAdd className="text-xl" /> 投稿する
                            </button>
                        </Link>
                    </div>
                </div>

                {/* List (Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {giveaways && giveaways.length > 0 ? (
                        giveaways.map((item: any) => (
                            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                                <div className="h-48 bg-gray-200 relative">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">No Image</div>
                                    )}
                                    {item.location && (
                                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                            <MdLocationOn /> {item.location}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 flex-1 flex flex-col">
                                    <h2 className="font-bold text-gray-800 mb-2 line-clamp-2">{item.title}</h2>
                                    <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1 whitespace-pre-wrap">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center gap-2 border-t pt-3 mt-auto">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                            {item.users?.photo_url ? (
                                                <img src={item.users.photo_url} alt={item.users.display_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-300"></div>
                                            )}
                                        </div>
                                        <span className="text-xs font-bold text-gray-600">{item.users?.display_name || 'ゲスト'}</span>
                                        <span className="text-xs text-gray-400 ml-auto">{new Date(item.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-gray-400">
                            <p className="font-bold text-lg">まだ投稿がありません</p>
                            <p className="text-sm">不要な家具や家電があれば投稿してみましょう！</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
