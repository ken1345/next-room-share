"use client";
import { MdTrain, MdVisibility, MdEmail } from "react-icons/md";
import Link from "next/link";

interface PhotoPropertyCardProps {
    id?: string | number;
    image?: string;
    imageUrl?: string;
    price: string;
    station: string;
    badges: string[];
    title: string;
    viewCount?: number;
    favoritesCount?: number;
    inquiryCount?: number;
}

export default function PhotoPropertyCard({ id, image, imageUrl, price, station, badges, title, viewCount, favoritesCount, inquiryCount }: PhotoPropertyCardProps) {
    const CardContent = (
        <div className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl transition overflow-hidden border border-gray-100 flex flex-col h-full">
            {/* 写真エリア（大きく確保） */}
            <div
                className={`relative h-48 w-full ${image || 'bg-gray-200'} overflow-hidden bg-cover bg-center`}
                style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : undefined}
            >
                {/* NEWバッジ */}
                <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10">NEW</span>

                {/* 画像拡大アニメーション */}
                <div className="w-full h-full bg-gray-300 opacity-50 group-hover:scale-110 transition duration-700"></div>

                {/* 写真の上に価格を乗せる（モダンな手法） */}
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
                    <span className="text-xs text-gray-500 font-bold">家賃</span>
                    <span className="text-lg font-bold text-[#bf0000] ml-1">¥{price}万</span>
                </div>
            </div>

            {/* 情報エリア */}
            <div className="p-3 flex flex-col flex-grow">
                {/* タグ列 */}
                <div className="flex gap-1 mb-2 flex-wrap">
                    {badges.map((badge, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                            {badge}
                        </span>
                    ))}
                </div>

                {/* タイトル */}
                <h3 className="font-bold text-gray-800 text-sm md:text-base leading-snug mb-2 group-hover:text-[#bf0000] transition line-clamp-2">
                    {title}
                </h3>

                {/* 最寄り駅 */}
                {/* 最寄り駅 & Stats */}
                <div className="mt-auto pt-2 border-t border-gray-100 flex flex-col gap-1 text-xs font-bold text-gray-500">
                    <div className="flex items-center">
                        <MdTrain className="mr-1 text-gray-400" /> {station}
                    </div>
                    {(viewCount !== undefined || favoritesCount !== undefined || inquiryCount !== undefined) && (
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-400">
                            <span>閲覧：{viewCount || 0}</span>
                            <span>♡：{favoritesCount || 0}</span>
                            <span>問い合わせ：{inquiryCount || 0}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (id) {
        return (
            <Link href={`/rooms/${id}`} className="block h-full">
                {CardContent}
            </Link>
        );
    }

    return CardContent;
}
