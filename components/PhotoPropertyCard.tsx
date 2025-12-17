"use client";
import { MdTrain, MdVisibility, MdEmail, MdStar } from "react-icons/md";
import Link from "next/link";

import { getRoomUrl } from "@/lib/url-utils";

interface PhotoPropertyCardProps {
    id?: string | number;
    image?: string;
    imageUrl?: string;
    price: string | number;
    station: string;
    badges: string[];
    title: string;
    viewCount?: number;
    favoritesCount?: number;
    inquiryCount?: number;

    // Location for SEO URL
    prefecture?: string;
    city?: string;
    slug?: string;
}

export default function PhotoPropertyCard({ id, image, imageUrl, price, station, badges, title, viewCount, favoritesCount, inquiryCount, prefecture, city, slug }: PhotoPropertyCardProps) {
    // Format price: If raw value (>100), convert to Man-yen units (e.g. 12000 -> 1.2)
    // If small value (<100), assume already formatted.
    let displayPrice = price;
    const numPrice = Number(price);
    if (!isNaN(numPrice) && numPrice >= 100) {
        displayPrice = (numPrice / 10000).toFixed(0);
        // User asked for "1.2万" (1 decimal), but previous code was `toFixed(1)`.
        // User example "12000 -> 1.2万". 
        // I will use toFixed(1) but remove trailing .0 if needed? 
        // "1.2" is good. "5.0" might be better as "5". 
        // Let's stick to toFixed(1) as per previous implementation style, or user request "1.2".
        displayPrice = (numPrice / 10000).toFixed(1).replace(/\.0$/, '');
    }

    const CardContent = (
        <div className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl transition overflow-hidden border border-gray-100 flex flex-col h-full">
            {/* 写真エリア（大きく確保） */}
            <div className={`relative h-48 w-full ${image || 'bg-gray-200'} overflow-hidden`}>
                {/* Background Image with Zoom Effect */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                    style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : undefined}
                />

                {/* NEWバッジ */}
                <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10">NEW</span>

                {/* Subtle dark overlay on hover */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition z-0"></div>

                {/* 写真の上に価格を乗せる（モダンな手法） */}
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
                    <span className="text-xs text-gray-500 font-bold">家賃</span>
                    <span className="text-lg font-bold text-[#bf0000] ml-1">¥{displayPrice}万</span>
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
                            <span><MdStar className="inline text-yellow-500" /> {favoritesCount || 0}</span>
                            <span>問い合わせ：{inquiryCount || 0}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (id) {
        // If slug is provided, use it directly appended to ID
        // E.g. slug="tokyo-shibuya-ku" -> /rooms/tokyo-shibuya-ku-<ID>
        /*
           However, getRoomUrl logic was:
           if (cleanSlug) return `/rooms/${cleanSlug}-${id}`;
           So if we pass `slug` directly to a new `getRoomUrlFromSlug` OR modify `getRoomUrl`.
           Let's modify `getRoomUrl` signature or logic in `lib/url-utils.ts` shortly.
           For now, let's assume getRoomUrl checks for slug usage or we handle it here.
        */
        let url = `/rooms/${id}`;
        if (slug) {
            url = `/rooms/${slug}-${id}`;
        } else {
            url = getRoomUrl(String(id), prefecture, city);
        }

        return (
            <Link href={url} className="block h-full">
                {CardContent}
            </Link>
        );
    }

    return CardContent;
}
