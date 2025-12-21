import Link from 'next/link';
import { MdArrowBack, MdLocationOn, MdCalendarToday, MdPerson, MdEmail } from 'react-icons/md';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data: req } = await supabase
        .from('room_requests')
        .select('*, users(display_name, photo_url, gender, age, occupation)')
        .eq('id', id)
        .single();

    if (!req) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">リクエストが見つかりませんでした</h1>
                <Link href="/request" className="text-[#bf0000] font-bold hover:underline flex items-center gap-1">
                    <MdArrowBack /> 一覧に戻る
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center">
                    <Link href="/request" className="text-gray-500 hover:text-gray-800 font-bold flex items-center gap-1">
                        <MdArrowBack /> 一覧に戻る
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-6">
                            <h1 className="text-2xl font-bold text-gray-800 leading-tight">{req.title}</h1>
                            <span className="text-xs text-gray-400 font-bold whitespace-nowrap">
                                {new Date(req.created_at).toLocaleString('ja-JP', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-8">
                            <span className="bg-red-50 text-[#bf0000] px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 text-sm">
                                <MdLocationOn /> {req.area || 'エリア未定'}
                            </span>
                            {req.budget_max && (
                                <span className="bg-gray-100 px-3 py-1.5 rounded-lg font-bold text-gray-700 text-sm">
                                    予算: {req.budget_max.toLocaleString()}円まで
                                </span>
                            )}
                            {req.move_in_date && (
                                <span className="bg-gray-100 px-3 py-1.5 rounded-lg font-bold text-gray-700 text-sm flex items-center gap-1">
                                    <MdCalendarToday /> {new Date(req.move_in_date).toLocaleDateString()} 入居希望
                                </span>
                            )}
                        </div>

                        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-10">
                            {req.content}
                        </div>

                        {/* User Info */}
                        <div className="border-t pt-8">
                            <h3 className="font-bold text-gray-800 mb-4">投稿者</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                    {req.users?.photo_url ? (
                                        <img src={req.users.photo_url} alt={req.users.display_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <MdPerson size={32} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-lg">{req.users?.display_name || 'ゲスト'}</p>
                                    <div className="flex gap-3 text-xs text-gray-500 font-bold mt-1">
                                        <span>{req.users?.gender || '性別未設定'}</span>
                                        <span>{req.users?.age ? `${req.users.age}歳` : '年齢未設定'}</span>
                                        <span>{req.users?.occupation || '職業未設定'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-center">
                        <Link href={`/request/${req.id}/contact`} className="w-full md:w-auto bg-[#bf0000] text-white font-bold px-8 py-4 rounded-xl shadow-md hover:bg-black transition flex items-center justify-center gap-2">
                            <MdEmail size={20} /> このユーザーに連絡する
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
