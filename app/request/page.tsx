import Link from 'next/link';
import { Suspense } from 'react';
import { MdAdd, MdPersonSearch, MdLocationOn, MdCalendarToday, MdChevronLeft } from 'react-icons/md';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function RequestPage({ searchParams }: { searchParams: { area?: string } }) {
    const areaQuery = searchParams?.area || '';

    let query = supabase
        .from('room_requests')
        .select('*, users(display_name, photo_url)')
        .order('created_at', { ascending: false });

    if (areaQuery) {
        query = query.ilike('area', `%${areaQuery}%`);
    }

    const { data: requests } = await query;

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
                            <MdPersonSearch className="text-[#bf0000]" /> 部屋を借りたい
                        </h1>
                        <p className="text-xs text-gray-500 font-bold mt-1">希望の条件を投稿して、ホストからのオファーを待ちましょう</p>
                    </div>
                    <div className="w-16"></div> {/* Spacer */}
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                {/* Search & Post */}
                <div className="mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <form className="w-full md:w-auto flex-1 flex items-center gap-2">
                            <div className="relative flex-1">
                                <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    name="area"
                                    defaultValue={areaQuery}
                                    placeholder="エリアで絞り込み (例: 新宿)"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold focus:outline-none focus:border-[#bf0000]"
                                />
                            </div>
                            <button type="submit" className="bg-gray-800 text-white font-bold px-4 py-3 rounded-lg hover:bg-black transition text-sm whitespace-nowrap">
                                検索
                            </button>
                        </form>
                        <Link href="/request/new">
                            <button className="w-full md:w-auto bg-[#bf0000] text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-[#900000] transition flex items-center justify-center gap-2 whitespace-nowrap">
                                <MdAdd className="text-xl" /> 投稿する
                            </button>
                        </Link>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {requests && requests.length > 0 ? (
                        requests.map((req: any) => (
                            <div key={req.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3">
                                <div className="flex items-start justify-between">
                                    <h2 className="font-bold text-lg text-gray-800">{req.title}</h2>
                                    <span className="text-xs text-gray-400">
                                        {new Date(req.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                    <span className="bg-red-50 text-[#bf0000] px-2 py-1 rounded font-bold flex items-center gap-1">
                                        <MdLocationOn /> {req.area || 'エリア未定'}
                                    </span>
                                    {req.budget_max && (
                                        <span className="bg-gray-100 px-2 py-1 rounded font-bold">
                                            予算: ~{req.budget_max.toLocaleString()}円
                                        </span>
                                    )}
                                    {req.move_in_date && (
                                        <span className="bg-gray-100 px-2 py-1 rounded font-bold flex items-center gap-1">
                                            <MdCalendarToday /> {new Date(req.move_in_date).toLocaleDateString()} 入居可
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {req.content}
                                </p>

                                <div className="border-t pt-3 flex items-center gap-2 mt-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                        {req.users?.photo_url ? (
                                            <img src={req.users.photo_url} alt={req.users.display_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 text-xs">No Img</div>
                                        )}
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">{req.users?.display_name || 'ゲスト'}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-gray-400">
                            <p className="font-bold text-lg">まだ投稿がありません</p>
                            <p className="text-sm">あなたの希望を投稿してみましょう！</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
