import Link from 'next/link';
import { MdArrowForward } from 'react-icons/md';
import { supabase } from "@/lib/supabase";
import SectionTitle from "@/components/SectionTitle";

export default async function BeforeAfterGalleryServer() {
    const { data, error } = await supabase
        .from('before_after_posts')
        .select(`
      *,
      user:users ( display_name )
    `)
        .order('created_at', { ascending: false })
        .limit(6);

    if (error) {
        console.error("Error fetching homepage posts:", error);
    }

    const items = data || [];

    // Mock items for fallback/empty state to keep UI lively initially
    // Note: we can keep this logic in SSR too if DB is empty.
    const mockItems = [
        { id: 101, title: '6畳和室を北欧風にDIY', before_image_url: 'bg-gray-300', after_image_url: 'bg-orange-100', user: { display_name: 'DIY初心者' }, isMock: true },
        { id: 102, title: 'キッチン収納を100均グッズで', before_image_url: 'bg-gray-400', after_image_url: 'bg-blue-100', user: { display_name: '整理収納好き' }, isMock: true },
    ];

    const displayItems: any[] = items.length > 0 ? items : mockItems;

    return (
        <section className="bg-gray-50 py-16 border-t font-sans">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <SectionTitle title="何でもビフォーアフター" subtitle="みんなのDIY・模様替えをチェック！" />

                    <Link href="/before-after" className="bg-[#bf0000] text-white font-bold px-6 py-3 rounded-full shadow-md hover:bg-[#900000] transition flex items-center gap-2">
                        <MdArrowForward />
                        <span>投稿一覧を見る</span>
                    </Link>
                </div>

                {/* ギャラリーグリッド：スマホ1列、PC2列 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {displayItems.map((item) => (
                        <Link href={item.isMock ? '#' : `/before-after/${item.id}`} key={item.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group block ${item.isMock ? 'cursor-default pointer-events-none' : 'cursor-pointer'}`}>
                            <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="font-bold text-gray-800">{item.title}</h3>
                                <span className="text-xs text-gray-400 font-bold">by {item.user?.display_name || 'User'}</span>
                            </div>

                            <div className="flex h-64 relative">
                                {/* Before */}
                                <div className={`flex-1 ${item.isMock ? item.before_image_url : ''} flex items-center justify-center relative overflow-hidden bg-gray-100`}>
                                    {!item.isMock && <img src={item.before_image_url} alt="Before" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition" />}
                                    <span className="absolute top-2 left-2 bg-gray-600 text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-80 z-10">BEFORE</span>
                                    {item.isMock && <div className="text-gray-500 font-bold opacity-30">Photo</div>}
                                </div>

                                {/* 境界線の矢印 */}
                                <div className="absolute inset-y-0 left-1/2 -ml-4 flex items-center justify-center z-20">
                                    <div className="bg-white rounded-full p-1 shadow-md text-[#bf0000]">
                                        <MdArrowForward />
                                    </div>
                                </div>

                                {/* After */}
                                <div className={`flex-1 ${item.isMock ? item.after_image_url : ''} flex items-center justify-center relative overflow-hidden bg-gray-100`}>
                                    {!item.isMock && <img src={item.after_image_url} alt="After" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition" />}
                                    <span className="absolute top-2 right-2 bg-[#bf0000] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">AFTER</span>
                                    {item.isMock && <div className="text-gray-500 font-bold opacity-30">Photo</div>}
                                    {/* ホバー時のオーバーレイ */}
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition z-0"></div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
