import { Suspense } from 'react';
import type { Metadata } from 'next';
import SearchClient from '@/components/search/SearchClient';
import { fetchListingsServer, SearchParams } from '@/lib/fetch-listings-server';
import Loading from '@/app/loading'; // Assuming loading.tsx exists or we use inline suspense fallback

// Static metadata removed in favor of generateMetadata below
// export const metadata: Metadata = { ... };

// Next.js 15+ Page Props (searchParams is a Promise)
type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const resolvedParams = await searchParams;

    // Dynamic Title Logic
    let titleParts = [];

    // 1. Feature / Concept
    const feature = typeof resolvedParams.feature === 'string' ? resolvedParams.feature : null;
    if (feature) {
        const featureMap: Record<string, string> = {
            'pet': 'ペット可',
            'wifi': '高速ネット・Wifi無料',
            'foreigner': '外国人歓迎',
            'female': '女性専用',
            'cheap': '格安（3万円以下）',
            'diy': 'DIY可',
            'gamer': 'ゲーマー向け',
            'gym': 'ジム付き',
            'theater': 'シアタールーム付き',
            'sauna': 'サウナ付き',
        };
        if (featureMap[feature]) titleParts.push(featureMap[feature]);
    }

    // 2. Area
    const pref = typeof resolvedParams.pref === 'string' ? resolvedParams.pref : null;
    const city = typeof resolvedParams.city === 'string' ? resolvedParams.city : null;
    const region = typeof resolvedParams.region === 'string' ? resolvedParams.region : null;

    if (city) titleParts.push(city);
    else if (pref) titleParts.push(pref);
    else if (region) titleParts.push(region);

    // 3. Station
    const station = typeof resolvedParams.station === 'string' ? resolvedParams.station : null;
    if (station) titleParts.push(`${station}駅`);
    else if (typeof resolvedParams.line === 'string') titleParts.push(resolvedParams.line);

    // 4. Keyword
    const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : null;
    if (q) titleParts.push(`「${q}」`);

    // Base Title
    // If specific filters exist, append "のシェアハウス・ルームシェア募集"
    // If no filters, just "物件検索"
    let pageTitle = '物件検索';

    if (titleParts.length > 0) {
        pageTitle = `${titleParts.join(' ')}のシェアハウス・ルームシェア募集`;
    } else {
        pageTitle = '物件検索 | 全国のシェアハウス・ルームシェア募集';
    }

    return {
        title: `${pageTitle} | ルームシェアmikke`,
        description: `${titleParts.join(' ')}のシェアハウス、ルームシェア、ゲストハウスをお探しならルームシェアmikke。初期費用を抑えて、気の合う仲間と新しい生活を始めよう。`,
    };
}

export default async function SearchPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;

    // Normalize search params to our type
    const normalizedParams: SearchParams = {
        tab: typeof resolvedParams.tab === 'string' ? resolvedParams.tab : undefined,
        q: typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined,
        min_rent: typeof resolvedParams.min_rent === 'string' ? resolvedParams.min_rent : undefined,
        max_rent: typeof resolvedParams.max_rent === 'string' ? resolvedParams.max_rent : undefined,
        walk: typeof resolvedParams.walk === 'string' ? resolvedParams.walk : undefined,
        gender: typeof resolvedParams.gender === 'string' ? resolvedParams.gender : undefined,
        amenities: typeof resolvedParams.amenities === 'string' ? resolvedParams.amenities : undefined,
        equipment: typeof resolvedParams.equipment === 'string' ? resolvedParams.equipment : undefined,
        personal_equipment: typeof resolvedParams.personal_equipment === 'string' ? resolvedParams.personal_equipment : undefined,
        types: typeof resolvedParams.types === 'string' ? resolvedParams.types : undefined,
        region: typeof resolvedParams.region === 'string' ? resolvedParams.region : undefined,
        pref: typeof resolvedParams.pref === 'string' ? resolvedParams.pref : undefined,
        city: typeof resolvedParams.city === 'string' ? resolvedParams.city : undefined,
        station_pref: typeof resolvedParams.station_pref === 'string' ? resolvedParams.station_pref : undefined,
        line: typeof resolvedParams.line === 'string' ? resolvedParams.line : undefined,
        station: typeof resolvedParams.station === 'string' ? resolvedParams.station : undefined,
        feature: typeof resolvedParams.feature === 'string' ? resolvedParams.feature : undefined,
        page: typeof resolvedParams.page === 'string' ? resolvedParams.page : undefined,
    };

    const { listings, count } = await fetchListingsServer(normalizedParams);

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SearchClient listings={listings || []} totalCount={count || 0} />
        </Suspense>
    );
}
