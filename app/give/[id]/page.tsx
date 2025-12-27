import Link from 'next/link';
import { MdArrowBack, MdLocationOn, MdPerson, MdEmail } from 'react-icons/md';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function GiveDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { data: item } = await supabase
        .from('giveaways')
        .select('*, users(display_name, photo_url, gender, age, occupation)')
        .eq('id', id)
        .single();

    if (!item) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">投稿が見つかりませんでした</h1>
                <Link href="/give" className="text-[#bf0000] font-bold hover:underline flex items-center gap-1">
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
                    <Link href="/give" className="text-gray-500 hover:text-gray-800 font-bold flex items-center gap-1">
                        <MdArrowBack /> 一覧に戻る
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Image Hero */}
                    <div className="w-full h-64 md:h-96 bg-gray-200 relative">
                        {item.image_url ? (
                            <img src={item.image_url} alt={item.title} className="w-full h-full object-contain bg-black/5" />
                        ) : (
                            <img src="/nophoto-notext.webp" alt="No Image" className="w-full h-full object-cover bg-gray-100" />
                        )}
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-6 justify-between items-start mb-6">
                            <h1 className="text-2xl font-bold text-gray-800 leading-tight">{item.title}</h1>
                            <span className="text-xs text-gray-400 font-bold whitespace-nowrap">
                                {new Date(item.created_at).toLocaleString('ja-JP', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-8">
                            {item.location && (
                                <span className="bg-red-50 text-[#bf0000] px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 text-sm">
                                    <MdLocationOn /> {item.location}
                                </span>
                            )}
                        </div>

                        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-10">
                            {item.description}
                        </div>

                        {/* User Info */}
                        <div className="border-t pt-8">
                            <h3 className="font-bold text-gray-800 mb-4">投稿者</h3>
                            <Link href={item.user_id ? `/users/${item.user_id}` : '#'} className="flex items-center gap-4 group">
                                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shrink-0 group-hover:opacity-90 transition">
                                    {item.users?.photo_url ? (
                                        <img src={item.users.photo_url} alt={item.users.display_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <MdPerson size={32} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-lg group-hover:text-[#bf0000] transition">{item.users?.display_name || 'ゲスト'}</p>
                                    <div className="flex gap-3 text-xs text-gray-500 font-bold mt-1">
                                        <span>{item.users?.gender || '性別未設定'}</span>
                                        <span>{item.users?.age ? `${item.users.age}歳` : '年齢未設定'}</span>
                                        <span>{item.users?.occupation || '職業未設定'}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-center">
                        <Link href={`/give/${item.id}/contact`} className="w-full md:w-auto bg-[#bf0000] text-white font-bold px-8 py-4 rounded-xl shadow-md hover:bg-black transition flex items-center justify-center gap-2">
                            <MdEmail size={20} /> 譲ってほしいと連絡する
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
