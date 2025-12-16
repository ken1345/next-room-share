import { Suspense } from 'react';
import SearchClient from '@/components/search/SearchClient';
import { fetchListings } from '@/lib/fetch-listings';

export async function generateMetadata({ params }: { params: { tag: string } }) {
    const tag = decodeURIComponent(params.tag);
    return {
        title: `${tag}のルームシェア・シェアハウス募集 | ルームシェアmikke`,
        description: `${tag}条件のルームシェア、シェアハウス物件一覧。`,
    };
}

export default async function FeaturePage({ params }: { params: { tag: string } }) {
    const tag = decodeURIComponent(params.tag);
    // Assuming 'tag' maps to 'amenities' or 'types' or 'keyword'
    // For simplicity, let's treat it as a keyword or amenity search
    // Depending on implementation, you might map "pet" -> amenity "ペット可"

    let listings = [];
    let count = 0;

    // Simple mapping example (can be expanded)
    if (tag === 'pet') {
        ({ listings, count } = await fetchListings({ amenities: ['ペット可'] }));
    } else {
        // Default fallback: search as keyword
        ({ listings, count } = await fetchListings({ q: tag }));
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchClient initialListings={listings || []} initialCount={count || 0} />
        </Suspense>
    );
}
