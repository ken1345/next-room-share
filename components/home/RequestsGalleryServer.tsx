import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { supabase } from "@/lib/supabase";
import SectionTitle from "@/components/SectionTitle";
import { MdLocationOn, MdCalendarToday, MdPerson } from 'react-icons/md';

export default async function RequestsGalleryServer() {
    noStore();
    const { data: requests, error } = await supabase
        .from('room_requests')
        .select('*, users(display_name, photo_url)')
        .order('created_at', { ascending: false })
        .limit(4);

    if (error) {
        console.error("Error fetching requests:", error);
    }

    const items = requests || [];

    return (
        <section className="bg-white py-12 border-t">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-6">
                    <SectionTitle title="新着の部屋を借りたい" subtitle="エリア・予算でマッチング！最新のリクエスト" />
                    <Link href="/request">
                        <button className="text-[#bf0000] font-bold border border-[#bf0000] bg-white px-4 py-1 rounded-full hover:bg-[#bf0000] hover:text-white transition text-sm">
                            もっと見る
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.length === 0 ? (
                        <div className="col-span-4 text-center py-10 text-gray-400">
                            まだリクエストはありません。
                        </div>
                    ) : (
                        items.map((req) => (
                            <Link key={req.id} href={`/request/${req.id}`} className="block group h-full">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-red-100 transition h-full flex flex-col relative">
                                    <div className="mb-3">
                                        <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-[#bf0000] transition h-14">
                                            {req.title}
                                        </h3>
                                    </div>

                                    <div className="space-y-2 mb-4 flex-1">
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <MdLocationOn className="text-[#bf0000]" />
                                            <span className="truncate">{req.area || 'エリア未定'}</span>
                                        </div>
                                        {req.budget_max ? (
                                            <div className="text-sm font-bold text-gray-700">
                                                予算: ~{req.budget_max.toLocaleString()}円
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-400">予算未定</div>
                                        )}
                                        {req.move_in_date && (
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <MdCalendarToday /> {new Date(req.move_in_date).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 border-t border-gray-100 pt-3 mt-auto">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                            {req.users?.photo_url ? (
                                                <img src={req.users.photo_url} alt={req.users.display_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <MdPerson className="w-full h-full p-1 text-gray-400" />
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500 truncate">{req.users?.display_name || 'ゲスト'}</span>
                                        <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </span>
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
