import { Suspense } from 'react';
import SearchClient from '@/components/search/SearchClient';
import { fetchListings } from '@/lib/fetch-listings';

export async function generateMetadata({ params }: { params: { prefecture: string; city: string } }) {
    const pref = decodeURIComponent(params.prefecture);
    const city = decodeURIComponent(params.city);
    return {
        title: `${pref}${city}のルームシェア・シェアハウス募集 | ルームシェアmikke`,
        description: `${pref}${city}のルームシェア、シェアハウス物件一覧。`,
    };
}

export default async function CityPage({ params }: { params: { prefecture: string; city: string } }) {
    const pref = decodeURIComponent(params.prefecture);
    const city = decodeURIComponent(params.city);
    const { listings, count } = await fetchListings({ pref, city });

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchClient initialListings={listings || []} initialCount={count || 0} />
        </Suspense>
    );
}
