import { Suspense } from 'react';
import SearchClient from '@/components/search/SearchClient';
import { fetchListings } from '@/lib/fetch-listings';

export async function generateMetadata({ params }: { params: { prefecture: string } }) {
    const pref = decodeURIComponent(params.prefecture);
    return {
        title: `${pref}のルームシェア・シェアハウス募集 | ルームシェアmikke`,
        description: `${pref}のルームシェア、シェアハウス物件一覧。`,
    };
}

export default async function PrefecturePage({ params }: { params: { prefecture: string } }) {
    const pref = decodeURIComponent(params.prefecture);
    const { listings, count } = await fetchListings({ pref });

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchClient initialListings={listings || []} initialCount={count || 0} />
        </Suspense>
    );
}
