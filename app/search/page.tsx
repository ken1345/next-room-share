import { Suspense } from 'react';
import type { Metadata } from 'next';
import SearchClient from '@/components/search/SearchClient';
import { fetchListingsServer, SearchParams } from '@/lib/fetch-listings-server';
import Loading from '@/app/loading'; // Assuming loading.tsx exists or we use inline suspense fallback

export const metadata: Metadata = {
    title: '物件検索 | NextRoomShare',
    description: 'エリアや沿線、こだわり条件からシェアハウス・ルームシェアを探せます。',
};

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
