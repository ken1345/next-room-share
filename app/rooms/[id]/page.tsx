"use client";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MOCK_PROPERTIES } from '@/data/mock-properties';
import { MdTrain, MdLocationOn, MdAttachMoney, MdArrowBack, MdCheck, MdPerson, MdEmail, MdShare, MdFavoriteBorder } from 'react-icons/md';


// ================= Refactored RoomDetailsPage =================

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function RoomDetailsPage() {
    const params = useParams();
    const id = params.id as string; // UUID

    const [property, setProperty] = useState<any>(null);
    const [host, setHost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;

            // Fetch Property
            const { data: propData, error: propError } = await supabase
                .from('listings')
                .select('*')
                .eq('id', id)
                .single();

            if (propError) {
                console.error("Error fetching property:", propError);
                setLoading(false);
                return;
            }

            setProperty(propData);

            // Fetch Host
            if (propData.host_id) {
                const { data: hostData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', propData.host_id)
                    .single();
                setHost(hostData);
            }

            setLoading(false);
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">読み込み中...</div>;
    }

    if (!property) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">物件が見つかりませんでした</h1>
                <Link href="/search" className="text-[#bf0000] font-bold hover:underline flex items-center gap-1">
                    <MdArrowBack /> 検索に戻る
                </Link>
            </div>
        );
    }

    // Safely parse arrays if they are null strings (Supabase sometimes returns null for arrays)
    const amenities = property.amenities || [];
    const images = property.images || [];
    const mainImage = images.length > 0 ? images[0] : null;

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans">
            {/* Header (Back & Actions) */}
            <div className="bg-white sticky top-0 z-40 border-b shadow-sm px-4 h-16 flex items-center justify-between container mx-auto max-w-5xl">
                <Link href="/" className="text-gray-500 hover:text-gray-800 font-bold flex items-center gap-1 text-sm bg-gray-100 px-3 py-1.5 rounded-full transition">
                    <MdArrowBack /> 検索に戻る
                </Link>
                <div className="flex gap-2">
                    <button className="text-gray-400 hover:text-[#bf0000] p-2 rounded-full hover:bg-red-50 transition">
                        <MdFavoriteBorder size={24} />
                    </button>
                    <button className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition">
                        <MdShare size={24} />
                    </button>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl">
                {/* Hero Section (Photo Gallery Style) */}
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[400px] mt-4 md:rounded-2xl overflow-hidden mx-4 md:mx-0 shadow-sm">
                    {/* Main Image */}
                    <div
                        className={`col-span-2 row-span-2 bg-cover bg-center relative group cursor-pointer ${!mainImage ? 'bg-gray-200' : ''}`}
                        style={mainImage ? { backgroundImage: `url('${mainImage}')` } : undefined}
                    >
                        {!mainImage && <div className="flex w-full h-full items-center justify-center text-gray-400 font-bold">No Image</div>}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition"></div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 mt-6 px-4 md:px-0">
                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {/* Title & Stats */}
                        <div className="mb-8 border-b pb-6">
                            <div className="flex gap-2 mb-3">
                                {amenities.slice(0, 3).map((badge: string, i: number) => (
                                    <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold border border-gray-200">
                                        {badge}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight mb-4">{property.title}</h1>
                            <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-500">
                                <span className="flex items-center gap-1"><MdLocationOn className="text-[#bf0000]" /> {property.address}</span>
                                <span className="flex items-center gap-1"><MdTrain className="text-gray-400" /> 最寄駅未設定</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8 border-b pb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">物件について</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {property.description || '詳細な説明はまだありません。ホストに問い合わせてみましょう。'}
                            </p>
                        </div>

                        {/* Amenities / Details */}
                        <div className="mb-8 border-b pb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">設備・条件</h2>
                            <div className="grid grid-cols-2 gap-4 text-sm font-bold text-gray-600">
                                {amenities.map((item: string, i: number) => (
                                    <div key={i} className="flex items-center gap-2"><MdCheck className="text-green-500" /> {item}</div>
                                ))}
                                {amenities.length === 0 && <div className="text-gray-400">登録された設備はありません</div>}
                            </div>
                        </div>

                        {/* Host Info */}
                        <div className="mb-8 pb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">ホストについて</h2>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
                                <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 overflow-hidden">
                                    {host?.photo_url ? (
                                        <img src={host.photo_url} alt="Host" className="w-full h-full object-cover" />
                                    ) : (
                                        <MdPerson size={32} />
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-800 mb-1">{host?.display_name || 'Host'}</p>
                                    <Link href={`/messages/new?host=${host?.id}`} className="text-sm text-[#bf0000] font-bold hover:underline">
                                        メッセージを送る
                                    </Link>
                                </div>
                            </div>
                        </div>


                    </main>

                    {/* Sidebar (Sticky CTA) */}
                    <aside className="w-full md:w-96 flex-shrink-0">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 md:sticky md:top-24">
                            <div className="flex items-end gap-1 mb-6 border-b border-gray-100 pb-4">
                                <span className="text-3xl font-bold text-[#bf0000]">¥{property.price}</span>
                                <span className="text-sm font-bold text-gray-500 mb-1">万 / 月</span>
                            </div>

                            <Link href={`/rooms/${id}/contact`} className="w-full bg-[#bf0000] text-white font-bold py-4 rounded-xl shadow-md hover:bg-black transition text-lg flex items-center justify-center gap-2 mb-3">
                                <MdEmail /> 空室確認・問い合わせ
                            </Link>
                            <button className="w-full bg-white text-gray-700 border border-gray-300 font-bold py-3 rounded-xl hover:bg-gray-50 transition">
                                見学をリクエスト
                            </button>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Mobile Bottom Action Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 px-6 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
                <div>
                    <span className="block text-xs font-bold text-gray-500">家賃</span>
                    <span className="text-xl font-bold text-[#bf0000]">¥{property.price}万</span>
                </div>
                <Link href={`/rooms/${id}/contact`} className="bg-[#bf0000] text-white font-bold py-3 px-8 rounded-full shadow-md">
                    問い合わせ
                </Link>
            </div>
        </div>
    );
}
