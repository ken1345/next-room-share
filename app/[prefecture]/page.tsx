import { Suspense } from 'react';
import { Metadata } from 'next';
import SearchClient from '@/components/search/SearchClient';
import { fetchListingsServer } from '@/lib/fetch-listings-server';

export async function generateMetadata({ params }: { params: Promise<{ prefecture: string }> }): Promise<Metadata> {
    const { prefecture } = await params;
    const pref = decodeURIComponent(prefecture);
    return {
        title: `${pref}のルームシェア・シェアハウス募集 | ルームシェアmikke`,
        description: `${pref}のルームシェア、シェアハウス物件一覧。`,
    };
}

export default async function PrefecturePage({ params }: { params: Promise<{ prefecture: string }> }) {
    const { prefecture } = await params;
    const pref = decodeURIComponent(prefecture);
    const { listings, count } = await fetchListingsServer({ pref });

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchClient listings={listings || []} totalCount={count || 0} />
        </Suspense>
    );
}
