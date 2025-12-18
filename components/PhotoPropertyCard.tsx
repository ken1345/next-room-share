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
    description?: string;
    viewCount?: number;
    favoritesCount?: number;
    inquiryCount?: number;

    // Location for SEO URL
    prefecture?: string;
    city?: string;
    slug?: string;
    horizontal?: boolean;
    equipment?: string[];
    personalEquipment?: string[];
}

export default function PhotoPropertyCard({ id, image, imageUrl, price, station, badges, title, description, viewCount, favoritesCount, inquiryCount, prefecture, city, slug, horizontal = false, equipment = [], personalEquipment = [] }: PhotoPropertyCardProps) {
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
        <div className={`group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl transition overflow-hidden border border-gray-100 flex ${horizontal ? 'flex-row h-auto' : 'flex-col h-full'}`}>
            {/* 写真エリア */}
            <div className={`relative flex-shrink-0 ${horizontal ? 'w-48 h-48' : 'h-36 w-full'} ${image || 'bg-gray-200'} overflow-hidden`}>
                {/* Background Image with Zoom Effect */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
                    style={imageUrl ? { backgroundImage: `url('${imageUrl}')` } : undefined}
                />

                {/* NEWバッジ */}
                <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10">NEW</span>

                {/* Subtle dark overlay on hover */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition z-0"></div>

                {/* 写真の上に価格を乗せる（モダンな手法） - Horizontalの場合は右下、Verticalも右下だがHorizontalだと画像内右下 */}
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1 rounded-lg shadow-sm">
                    <span className="text-[10px] md:text-xs text-gray-500 font-bold">家賃</span>
                    <span className="text-sm md:text-lg font-bold text-[#bf0000] ml-1">¥{displayPrice}万</span>
                </div>
            </div>

            {/* 情報エリア */}
            <div className="p-3 flex flex-col flex-grow relative">
                {/* Header Row: Badges and Stats (Horizontal Only) */}
                <div className="flex justify-between items-start mb-1">
                    <div className="flex gap-1 flex-wrap">
                        {horizontal ? (
                            // Horizontal: Max 5 + count
                            <>
                                {badges.slice(0, 5).map((badge, i) => (
                                    <span key={i} className="text-[10px] bg-gray-100 text-gray-800 px-2 py-0.5 rounded border border-gray-200">
                                        {badge}
                                    </span>
                                ))}
                                {badges.length > 5 && (
                                    <span className="text-[10px] text-gray-500 px-1 py-0.5">
                                        +{badges.length - 5}
                                    </span>
                                )}
                            </>
                        ) : (
                            // Vertical: Max 3 + "..."
                            <>
                                {badges.slice(0, 3).map((badge, i) => (
                                    <span key={i} className="text-[10px] bg-gray-100 text-gray-800 px-2 py-0.5 rounded border border-gray-200">
                                        {badge}
                                    </span>
                                ))}
                                {badges.length > 3 && (
                                    <span className="text-[10px] text-gray-500 px-1 py-0.5 font-bold">
                                        ...
                                    </span>
                                )}
                            </>
                        )}
                    </div>

                    {horizontal && (viewCount !== undefined || favoritesCount !== undefined || inquiryCount !== undefined) && (
                        <div className="flex gap-2 text-[10px] text-gray-600 whitespace-nowrap ml-2">
                            <span>閲覧:{viewCount || 0}</span>
                            <span><MdStar className="inline text-yellow-500" /> {favoritesCount || 0}</span>
                            <span>問い合わせ:{inquiryCount || 0}</span>
                        </div>
                    )}
                </div>

                {/* タイトル */}
                <h3 className="font-bold text-gray-900 text-sm md:text-base leading-snug mb-1 group-hover:text-[#bf0000] transition line-clamp-1">
                    {title}
                </h3>

                {/* Horizontal: Location Line immediately below Title */}
                {horizontal ? (
                    <div className="flex items-center text-xs font-bold text-gray-700 mb-2">
                        <span className="mr-2">{prefecture}{city}</span>
                        <MdTrain className="mr-1 text-gray-500" />
                        {station}
                    </div>
                ) : null}

                {/* Description - Expanded for Horizontal */}
                {description && (
                    <p className={`text-xs text-gray-800 leading-relaxed mb-2 ${horizontal ? 'line-clamp-4 flex-grow' : 'line-clamp-2 md:line-clamp-3'}`}>
                        {description}
                    </p>
                )}

                {/* Footer Area: Stats (Vertical) or Equipment (Horizontal) */}
                <div className="mt-auto pt-2 border-t border-gray-200 flex flex-col gap-1 text-xs font-bold text-gray-600">

                    {/* Vertical Mode Location */}
                    {!horizontal && (
                        <div className="flex items-center text-gray-700">
                            <span className="mr-2 font-bold">{prefecture}{city}</span>
                            <MdTrain className="mr-1 text-gray-600" />
                            {station}
                        </div>
                    )}

                    {horizontal ? (
                        /* Horizontal Mode: Show Equipment */
                        <div className="flex flex-col gap-1">
                            {equipment.length > 0 && (
                                <div className="flex flex-wrap gap-1 items-center">
                                    <span className="text-[10px] text-green-700 font-bold bg-green-50 border border-green-200 px-1 rounded">共用:</span>
                                    {equipment.slice(0, 5).map(e => <span key={e} className="text-[10px] text-green-800 bg-green-50 px-1.5 rounded border border-green-100">{e}</span>)}
                                    {equipment.length > 5 && <span className="text-[10px] text-gray-500">+{equipment.length - 5}</span>}
                                </div>
                            )}
                            {personalEquipment.length > 0 && (
                                <div className="flex flex-wrap gap-1 items-center">
                                    <span className="text-[10px] text-blue-700 font-bold bg-blue-50 border border-blue-200 px-1 rounded">個室:</span>
                                    {personalEquipment.slice(0, 5).map(e => <span key={e} className="text-[10px] text-blue-800 bg-blue-50 px-1.5 rounded border border-blue-100">{e}</span>)}
                                    {personalEquipment.length > 5 && <span className="text-[10px] text-gray-500">+{personalEquipment.length - 5}</span>}
                                </div>
                            )}
                            {/* Stats moved to header */}
                        </div>
                    ) : (
                        /* Vertical Mode: Show Stats */
                        (viewCount !== undefined || favoritesCount !== undefined || inquiryCount !== undefined) && (
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-600">
                                <span>閲覧：{viewCount || 0}</span>
                                <span><MdStar className="inline text-yellow-500" /> {favoritesCount || 0}</span>
                                <span>問い合わせ：{inquiryCount || 0}</span>
                            </div>
                        )
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
