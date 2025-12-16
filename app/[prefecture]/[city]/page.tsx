import { Suspense } from 'react';
import { Metadata } from 'next';
import SearchClient from '@/components/search/SearchClient';
import { fetchListingsServer } from '@/lib/fetch-listings-server';

export async function generateMetadata({ params }: { params: Promise<{ prefecture: string; city: string }> }): Promise<Metadata> {
    const { prefecture, city } = await params;
    const pref = decodeURIComponent(prefecture);
    const cityName = decodeURIComponent(city);
    return {
        title: `${pref}${cityName}のルームシェア・シェアハウス募集 | ルームシェアmikke`,
        description: `${pref}${cityName}のルームシェア、シェアハウス物件一覧。`,
    };
}

export default async function CityPage({ params }: { params: Promise<{ prefecture: string; city: string }> }) {
    const { prefecture, city } = await params;
    const pref = decodeURIComponent(prefecture);
    const cityName = decodeURIComponent(city);
    const { listings, count } = await fetchListingsServer({ pref, city: cityName });

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchClient listings={listings || []} totalCount={count || 0} />
        </Suspense>
    );
}
