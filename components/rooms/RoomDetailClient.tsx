"use client";

import Link from 'next/link';
import { MdTrain, MdLocationOn, MdArrowBack, MdCheck, MdPerson, MdEmail, MdFavoriteBorder, MdFavorite, MdFlag, MdStar, MdStarBorder } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ImageGallery from '@/components/ImageGallery';

// Using functional component with props
interface RoomDetailClientProps {
    property: any;
    host: any;
    currentUser?: any;
}

export default function RoomDetailClient({ property, host, currentUser: initialUser }: RoomDetailClientProps) {
    // Supabase client from project lib

    // Use local state for user to handle client-side fetching
    const [user, setUser] = useState(initialUser);

    const [isLiked, setIsLiked] = useState(false);
    const [backUrl, setBackUrl] = useState('/search');

    useEffect(() => {
        // Fetch User if not provided
        if (!user) {
            const fetchUser = async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) setUser(session.user);
            };
            fetchUser();
        }

        // Handle Back URL
        const lastUrl = sessionStorage.getItem('last_search_url');
        if (lastUrl) {
            setBackUrl(lastUrl);
        }

        // Increment View Count
        // ... (rest of logic)
        const incrementView = async () => {
            if (property?.id) {
                await supabase.rpc('increment_view_count', { listing_id: property.id });
            }
        };
        incrementView();

        // Check Like Status
        const checkLikeStatus = async () => {
            if (user && property?.id) {
                const { data } = await supabase
                    .from('favorites')
                    .select('id')
                    .eq('user_id', user.id)
                    .eq('listing_id', property.id)
                    .single();
                setIsLiked(!!data);
            }
        };
        checkLikeStatus();

    }, [property?.id, user, supabase]);

    const handleToggleLike = async () => {
        if (!user) {
            alert("ウォッチリスト登録にはログインが必要です");
            return;
        }

        if (isLiked) {
            // Unlike
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('user_id', user.id)
                .eq('listing_id', property.id);

            if (!error) setIsLiked(false);
        } else {
            // Like
            const { error } = await supabase
                .from('favorites')
                .insert({
                    user_id: user.id,
                    listing_id: property.id
                });

            if (!error) setIsLiked(true);
        }
    };

    // Safely parse arrays
    const amenities = property.amenities || [];
    const equipment = property.equipment || [];
    const images = property.images || [];

    const buildingTypeLabel: { [key: string]: string } = {
        'detached': '一戸建て',
        'mansion': 'マンション',
        'apartment': 'アパート',
        'other': 'その他'
    };
    const buildingTypeName = property.building_type ? buildingTypeLabel[property.building_type] || property.building_type : '建物種別不明';


    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans">
            {/* Header (Back & Actions) */}
            <div className="px-4 mt-6 container mx-auto max-w-5xl">
                <Link href={backUrl} className="text-gray-500 hover:text-gray-800 font-bold flex items-center gap-1 text-sm w-fit transition">
                    <MdArrowBack /> 検索に戻る
                </Link>
            </div>

            <div className="container mx-auto max-w-5xl">
                {/* Hero Section (Boxed Layout) */}
                <div className="mt-4 md:mt-6 mx-0 md:mx-4 lg:mx-0">
                    <ImageGallery images={images} title={property.title} />
                </div>

                <div className="flex flex-col md:flex-row gap-8 mt-6 px-4 md:px-0">
                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {/* Title & Stats */}
                        <div className="mb-8 border-b pb-6">

                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight mb-4">{property.title}</h1>
                            <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-500">
                                <span className="flex items-center gap-1"><MdLocationOn className="text-[#bf0000]" /> {property.address}</span>
                                <span className="flex items-center gap-1"><MdTrain className="text-gray-400" /> 最寄駅未設定</span>
                                <span className="flex items-center gap-1 bg-gray-100 px-2 rounded text-gray-600 border border-gray-200">{buildingTypeName}</span>
                                {property.updated_at && (
                                    <span className="text-xs font-normal text-gray-400 self-center ml-auto">
                                        最終更新: {new Date(property.updated_at).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8 border-b pb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">物件について</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {property.description || '詳細な説明はまだありません。ホストに問い合わせてみましょう。'}
                            </p>
                        </div>

                        {/* Shared Facilities */}
                        <div className="mb-8 border-b pb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">共用設備</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm font-bold text-gray-600">
                                {equipment.map((item: string, i: number) => (
                                    <div key={i} className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-2 rounded-lg"><MdCheck className="text-blue-500" /> {item}</div>
                                ))}
                                {equipment.length === 0 && <div className="text-gray-400">登録された設備はありません</div>}
                            </div>
                        </div>

                        {/* Personal Equipment */}
                        <div className="mb-8 border-b pb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">個室設備（部屋にあるもの）</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm font-bold text-gray-600">
                                {property.personal_equipment && property.personal_equipment.length > 0 ? (
                                    property.personal_equipment.map((item: string, i: number) => (
                                        <div key={i} className="flex items-center gap-2 bg-green-50 text-green-800 px-3 py-2 rounded-lg"><MdCheck className="text-green-500" /> {item}</div>
                                    ))
                                ) : (
                                    <div className="text-gray-400">登録された個室設備はありません</div>
                                )}
                            </div>
                        </div>

                        {/* Amenities / Features */}
                        <div className="mb-8 border-b pb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">特徴・こだわり</h2>
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
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 overflow-hidden mb-2">
                                        {host?.photo_url ? (
                                            <img src={host.photo_url} alt="Host" className="w-full h-full object-cover" />
                                        ) : (
                                            <MdPerson size={48} />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 w-full text-center md:text-left">
                                    <p className="font-bold text-xl text-gray-800 mb-4">{host?.display_name || 'Host'}</p>

                                    <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-4 mb-4">
                                        <div className="text-center md:text-left border-r border-gray-100 last:border-0">
                                            <p className="text-xs text-gray-400 font-bold mb-1">性別</p>
                                            <p className="font-bold text-gray-800">{host?.gender || '-'}</p>
                                        </div>
                                        <div className="text-center md:text-left border-r border-gray-100 last:border-0">
                                            <p className="text-xs text-gray-400 font-bold mb-1">年齢</p>
                                            <p className="font-bold text-gray-800">{host?.age ? `${host.age}歳` : '-'}</p>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <p className="text-xs text-gray-400 font-bold mb-1">職業</p>
                                            <p className="font-bold text-gray-800">{host?.occupation || '-'}</p>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>


                    </main>

                    {/* Sidebar (Sticky CTA) */}
                    <aside className="w-full md:w-96 flex-shrink-0">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 md:sticky md:top-24">
                            <div className="flex items-end justify-center gap-1 mb-6 border-b border-gray-100 pb-4">
                                <span className="text-3xl font-bold text-[#bf0000]">¥{property.price}</span>
                                <span className="text-sm font-bold text-gray-500 mb-1"> / 月</span>
                            </div>

                            <button
                                onClick={() => {
                                    if (!user) {
                                        alert("お問い合わせにはログインが必要です");
                                        window.location.href = `/login?redirect=/rooms/${property.id}/contact`;
                                    } else {
                                        window.location.href = `/rooms/${property.id}/contact`;
                                    }
                                }}
                                className="w-full bg-[#bf0000] text-white font-bold py-4 rounded-xl shadow-md hover:bg-black transition text-lg flex items-center justify-center gap-2 mb-3"
                            >
                                <MdEmail /> 空室確認・問い合わせ
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleToggleLike}
                                    className={`flex-1 font-bold py-3 rounded-xl border transition flex items-center justify-center gap-2 ${isLiked
                                        ? 'bg-yellow-50 text-yellow-500 border-yellow-200'
                                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {isLiked ? <MdStar size={24} /> : <MdStarBorder size={24} />}
                                    {isLiked ? 'リスト登録済' : 'ウォッチリスト'}
                                </button>
                                <button
                                    onClick={() => {
                                        if (!user) {
                                            alert("通報するにはログインが必要です");
                                            window.location.href = `/login?redirect=/rooms/${property.id}/report`;
                                        } else {
                                            window.location.href = `/rooms/${property.id}/report`;
                                        }
                                    }}
                                    className="bg-gray-50 text-gray-400 font-bold py-3 px-4 rounded-xl border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition"
                                    title="この物件を通報する"
                                >
                                    <MdFlag size={20} />
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Mobile Bottom Action Bar */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 px-6 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
                    <div>
                        <span className="block text-xs font-bold text-gray-500">家賃</span>
                        <span className="text-xl font-bold text-[#bf0000]">¥{property.price}</span>
                    </div>
                    <Link href={`/rooms/${property.id}/contact`} className="bg-[#bf0000] text-white font-bold py-3 px-8 rounded-full shadow-md">
                        問い合わせ
                    </Link>
                </div>
            </div>
        </div>
    );
}
