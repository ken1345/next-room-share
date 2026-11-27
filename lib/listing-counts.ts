import 'server-only';
import { createClient } from '@supabase/supabase-js';

export async function withCurrentListingCounts<T extends { id: string }>(listings: T[]) {
    if (!listings.length) return listings;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
        console.error('[Listing counts] Supabase configuration unavailable');
        return listings;
    }
    const admin = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { fetch: (input, options) => fetch(input, { ...options, cache: 'no-store' }) },
    });
    const ids = [...new Set(listings.map(listing => listing.id))];
    const { data: counters, error } = await admin.from('listings')
        .select('id, view_count, favorites_count, inquiry_count')
        .in('id', ids)
        .abortSignal(AbortSignal.timeout(5000));
    if (error) {
        console.error('[Listing counts] Supabase lookup failed:', error.code);
        return listings;
    }

    const countersById = new Map(counters.map(row => [row.id, row]));
    return listings.map(listing => {
        const row = countersById.get(listing.id);
        return {
            ...listing,
            view_count: row?.view_count ?? 0,
            favorites_count: row?.favorites_count ?? 0,
            inquiry_count: row?.inquiry_count ?? 0,
        };
    });
}
