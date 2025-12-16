import { Suspense } from 'react';
import type { Metadata } from 'next';
import SearchClient from '@/components/search/SearchClient';
import { fetchListingsServer, SearchParams } from '@/lib/fetch-listings-server';
import Loading from '@/app/loading'; // Assuming loading.tsx exists or we use inline suspense fallback

// Static metadata removed in favor of generateMetadata below
// export const metadata: Metadata = { ... };

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    // Dynamic Title Logic
    let titleParts = [];

    // 1. Feature / Concept
    const feature = typeof searchParams.feature === 'string' ? searchParams.feature : null;
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
    const pref = typeof searchParams.pref === 'string' ? searchParams.pref : null;
    const city = typeof searchParams.city === 'string' ? searchParams.city : null;
    const region = typeof searchParams.region === 'string' ? searchParams.region : null;

    if (city) titleParts.push(city);
    else if (pref) titleParts.push(pref);
    else if (region) titleParts.push(region);

    // 3. Station
    const station = typeof searchParams.station === 'string' ? searchParams.station : null;
    if (station) titleParts.push(`${station}駅`);
    else if (typeof searchParams.line === 'string') titleParts.push(searchParams.line);

    // 4. Keyword
    const q = typeof searchParams.q === 'string' ? searchParams.q : null;
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
        title: `${pageTitle} | NextRoomShare`,
        description: `${titleParts.join(' ')}のシェアハウス、ルームシェア、ゲストハウスをお探しならNextRoomShare。初期費用を抑えて、気の合う仲間と新しい生活を始めよう。`,
    };
}

// Next.js 13/14 Page Props
type PageProps = {
    searchParams: { [key: string]: string | string[] | undefined };
};

export default async function SearchPage({ searchParams }: PageProps) {
    // Normalize search params to our type
    const normalizedParams: SearchParams = {
        tab: typeof searchParams.tab === 'string' ? searchParams.tab : undefined,
        q: typeof searchParams.q === 'string' ? searchParams.q : undefined,
        min_rent: typeof searchParams.min_rent === 'string' ? searchParams.min_rent : undefined,
        max_rent: typeof searchParams.max_rent === 'string' ? searchParams.max_rent : undefined,
        walk: typeof searchParams.walk === 'string' ? searchParams.walk : undefined,
        gender: typeof searchParams.gender === 'string' ? searchParams.gender : undefined,
        amenities: typeof searchParams.amenities === 'string' ? searchParams.amenities : undefined,
        types: typeof searchParams.types === 'string' ? searchParams.types : undefined,
        region: typeof searchParams.region === 'string' ? searchParams.region : undefined,
        pref: typeof searchParams.pref === 'string' ? searchParams.pref : undefined,
        city: typeof searchParams.city === 'string' ? searchParams.city : undefined,
        station_pref: typeof searchParams.station_pref === 'string' ? searchParams.station_pref : undefined,
        line: typeof searchParams.line === 'string' ? searchParams.line : undefined,
        station: typeof searchParams.station === 'string' ? searchParams.station : undefined,
        feature: typeof searchParams.feature === 'string' ? searchParams.feature : undefined,
        page: typeof searchParams.page === 'string' ? searchParams.page : undefined,
    };

    const { listings, count } = await fetchListingsServer(normalizedParams);

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SearchClient listings={listings || []} totalCount={count || 0} />
        </Suspense>
    );
}
