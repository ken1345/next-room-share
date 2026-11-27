import 'server-only';
import { cache } from 'react';
import type { ListingRecord } from './fetch-listings-server';
import { isLittleServerListingPhoto } from './little-server-listing-photos';
import { littleServerListingsEndpoint } from './little-server-listings-endpoint';
import { excludeRetiredListingOwners } from './little-server-retired-owners';

export const useLittleServerListings = process.env.NEXT_PUBLIC_LISTINGS_BACKEND === 'little-server';

export type LittleServerListing = ListingRecord & {
    host_id: string;
    latitude: number | null;
    longitude: number | null;
    station_line: string | null;
    gender_restriction: string | null;
    building_type: string | null;
    updated_at: string | null;
    is_public: boolean | null;
};

const readPage = cache(async (page: number, id?: string): Promise<LittleServerListing[]> => {
    const token = process.env.LITTLE_SERVER_LISTINGS_TOKEN;
    if (!token) throw new Error('Missing Little Server listing configuration');
    const url = new URL(littleServerListingsEndpoint);
    if (id) url.searchParams.set('id', id);
    if (page > 1) url.searchParams.set('page', String(page));
    const response = await fetch(url, {
        headers: { 'X-Roommikke-Token': token },
        redirect: 'error',
        signal: AbortSignal.timeout(8000),
        next: { revalidate: 30, tags: ['little-server-listings'] },
    });
    if (!response.ok) throw new Error('Little Server listing service unavailable');
    const { listings } = await response.json() as { listings: LittleServerListing[] };
    return listings.map(listing => ({
        ...listing,
        images: (listing.images ?? []).filter(isLittleServerListingPhoto),
    }));
});

export const readPublicLittleServerListings = cache(async () => {
    const listings = [];
    for (let page = 1; ; page += 1) {
        const batch = await readPage(page);
        listings.push(...batch);
        if (batch.length < 100) return excludeRetiredListingOwners(listings);
    }
});

export const readPublicLittleServerListing = cache(async (id: string) => {
    if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(id)) return null;
    return (await excludeRetiredListingOwners(await readPage(1, id)))[0] ?? null;
});
