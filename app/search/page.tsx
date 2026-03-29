import { Suspense } from 'react';
import type { Metadata } from 'next';
import SearchClient from '@/components/search/SearchClient';
import { fetchListingsServer, type SearchParams } from '@/lib/fetch-listings-server';

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const FEATURE_LABELS: Record<string, string> = {
    pet: 'ペット可',
    'pet-friendly': 'ペット可',
    wifi: '高速ネット',
    foreigner: '外国人歓迎',
    'foreigners-welcome': '外国人歓迎',
    female: '女性専用',
    cheap: '初期費用を抑えやすい',
    'low-initial-cost': '初期費用を抑えやすい',
    'private-room': '個室あり',
    furnished: '家具家電付き',
    'work-from-home': '在宅ワーク向き',
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const pieces: string[] = [];

    const feature = typeof resolvedParams.feature === 'string' ? resolvedParams.feature : undefined;
    const pref = typeof resolvedParams.pref === 'string' ? resolvedParams.pref : undefined;
    const city = typeof resolvedParams.city === 'string' ? resolvedParams.city : undefined;
    const station = typeof resolvedParams.station === 'string' ? resolvedParams.station : undefined;
    const keyword = typeof resolvedParams.q === 'string' ? resolvedParams.q : undefined;

    if (feature && FEATURE_LABELS[feature]) pieces.push(FEATURE_LABELS[feature]);
    if (city) pieces.push(city);
    else if (pref) pieces.push(pref);
    if (station) pieces.push(`${station}駅`);
    if (keyword) pieces.push(`「${keyword}」`);

    const title = pieces.length > 0 ? `${pieces.join(' ')}のルームシェア検索` : 'ルームシェア検索';

    return {
        title: `${title} | RoomMikke`,
        description: '家賃、エリア、駅、設備条件を自由に組み合わせてルームシェア物件を探せます。',
        alternates: {
            canonical: '/search',
        },
        robots: {
            index: false,
            follow: true,
        },
    };
}

export default async function SearchPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams;

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
