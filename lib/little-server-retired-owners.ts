import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { after } from 'next/server';
import { littleServerListingsEndpoint } from '@/lib/little-server-listings-endpoint';

export async function retireLittleServerListingOwner(ownerId: string) {
    const token = process.env.LITTLE_SERVER_LISTINGS_TOKEN;
    if (!token) throw new Error('Listing retirement is unavailable');
    const url = new URL(littleServerListingsEndpoint);
    url.searchParams.set('retire_owner', '1');
    const result = await fetch(url, {
        method: 'POST',
        headers: { 'X-Roommikke-Token': token, 'X-Roommikke-Owner': ownerId },
        redirect: 'error',
        cache: 'no-store',
        signal: AbortSignal.timeout(12000),
    });
    if (!result.ok || (await result.json()).retired !== true) {
        throw new Error('Could not retire listings');
    }
}

export async function excludeRetiredListingOwners<T extends { host_id: string }>(listings: T[]): Promise<T[]> {
    if (process.env.VERCEL_ENV !== 'production' || process.env.LITTLE_SERVER_LISTINGS_MODE !== 'little-server') {
        return listings;
    }
    if (!listings.length) return listings;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Listing retirement check is unavailable');
    const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const ids = [...new Set(listings.map(listing => listing.host_id))];
    const retired = new Set<string>();
    for (let offset = 0; offset < ids.length; offset += 100) {
        const { data, error } = await admin.from('listing_retired_hosts').select('host_id')
            .in('host_id', ids.slice(offset, offset + 100)).abortSignal(AbortSignal.timeout(5000));
        if (error) throw new Error('Listing retirement check failed');
        for (const row of data) retired.add(row.host_id);
    }
    if (retired.size) {
        after(async () => {
            const results = await Promise.allSettled([...retired].map(retireLittleServerListingOwner));
            if (results.some(result => result.status === 'rejected')) {
                console.error('[Listing retirement] Cleanup pending');
            }
        });
    }
    return listings.filter(listing => !retired.has(listing.host_id));
}
