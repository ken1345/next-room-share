"use client";
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MOCK_PROPERTIES } from '@/data/mock-properties';
import { MdTrain, MdLocationOn, MdAttachMoney, MdArrowBack, MdCheck, MdPerson, MdEmail, MdShare, MdFavoriteBorder } from 'react-icons/md';


export default function RoomDetailsPage() {
    const params = useParams();
    const id = Number(params.id);
    const property = MOCK_PROPERTIES.find(p => p.id === id);

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

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans">
            {/* Header (Back & Actions) */}
            <div className="bg-white sticky top-0 z-40 border-b shadow-sm px-4 h-16 flex items-center justify-between container mx-auto max-w-5xl">
                <Link href="/search" className="text-gray-500 hover:text-gray-800 font-bold flex items-center gap-1 text-sm bg-gray-100 px-3 py-1.5 rounded-full transition">
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
                    <div className={`col-span-2 row-span-2 ${property.image} bg-cover bg-center relative group cursor-pointer`}>
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition"></div>
                    </div>
                    {/* Sub Images */}
                    <div className="hidden md:block bg-orange-50 bg-cover bg-center relative cursor-pointer hover:opacity-90 transition"></div>
                    <div className="hidden md:block bg-blue-50 bg-cover bg-center relative cursor-pointer hover:opacity-90 transition"></div>
                    <div className="hidden md:block bg-green-50 bg-cover bg-center relative cursor-pointer hover:opacity-90 transition"></div>
                    <div className="hidden md:block bg-yellow-50 bg-cover bg-center relative cursor-pointer hover:opacity-90 transition flex items-center justify-center bg-gray-200">
                        <span className="font-bold text-gray-500 flex items-center gap-1"><MdArrowBack className="rotate-180" /> 全ての写真を表示</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 mt-6 px-4 md:px-0">
                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {/* Title & Stats */}
                        <div className="mb-8 border-b pb-6">
                            <div className="flex gap-2 mb-3">
                                {property.badges.map((badge, i) => (
                                    <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold border border-gray-200">
                                        {badge}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight mb-4">{property.title}</h1>
                            <div className="flex flex-wrap gap-4 text-sm font-bold text-gray-500">
                                <span className="flex items-center gap-1"><MdLocationOn className="text-[#bf0000]" /> {property.area}</span>
                                <span className="flex items-center gap-1"><MdTrain className="text-gray-400" /> {property.station}</span>
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
                                <div className="flex items-center gap-2"><MdCheck className="text-green-500" /> {property.type === 'private' ? '個室' : 'ドミトリー'}</div>
                                <div className="flex items-center gap-2"><MdCheck className="text-green-500" /> 即入居可</div>
                                <div className="flex items-center gap-2"><MdCheck className="text-green-500" /> 家具家電付き</div>
                                <div className="flex items-center gap-2"><MdCheck className="text-green-500" /> ネット無料</div>
                            </div>
                        </div>

                        {/* Host Info */}
                        <div className="mb-8 pb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">ホストについて</h2>
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
                                <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                                    <MdPerson size={32} />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-800 mb-1">Room Share Host</p>
                                    <p className="text-xs text-gray-400 mb-3">登録日: 2023年10月</p>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        こんにちは！シェアハウスの管理をしています。
                                        快適な暮らしをサポートしますので、お気軽にお問い合わせください。
                                    </p>
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

                            <p className="text-xs text-center text-gray-400 mt-4">
                                契約が成立するまで支払いは発生しません
                            </p>
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
