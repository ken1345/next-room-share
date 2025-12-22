import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { supabase } from "@/lib/supabase";
import SectionTitle from "@/components/SectionTitle";
import { MdLocationOn, MdPerson } from 'react-icons/md';

export default async function GiveawaysGalleryServer() {
    noStore();
    const { data: giveaways, error } = await supabase
        .from('giveaways')
        .select('*, users(display_name, photo_url)')
        .order('created_at', { ascending: false })
        .limit(4);

    if (error) {
        console.error("Error fetching giveaways:", error);
    }

    const items = giveaways || [];

    return (
        <section className="bg-gray-50 py-12 border-t">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-6">
                    <SectionTitle title="新着のあげたい" subtitle="家具・家電をお得にゲット！最新の譲渡品" />
                    <Link href="/give">
                        <button className="text-[#bf0000] font-bold border border-[#bf0000] bg-white px-4 py-1 rounded-full hover:bg-[#bf0000] hover:text-white transition text-sm">
                            もっと見る
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.length === 0 ? (
                        <div className="col-span-4 text-center py-10 text-gray-400">
                            まだ投稿がありません。
                        </div>
                    ) : (
                        items.map((item) => (
                            <Link key={item.id} href={`/give/${item.id}`} className="block group h-full">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition h-full flex flex-col">
                                    <div className="h-48 bg-gray-200 relative">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                        ) : (
                                            <img src="/nophoto-notext.webp" alt="No Image" className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80" />
                                        )}
                                        {item.location && (
                                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1 font-bold">
                                                <MdLocationOn /> {item.location}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#bf0000] transition h-12">
                                            {item.title}
                                        </h3>

                                        <div className="flex items-center gap-2 border-t border-gray-50 pt-3 mt-auto">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                                {item.users?.photo_url ? (
                                                    <img src={item.users.photo_url} alt={item.users.display_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <MdPerson className="w-full h-full p-1 text-gray-400" />
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500 truncate">{item.users?.display_name || 'ゲスト'}</span>
                                            <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
