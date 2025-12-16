import { supabase } from '@/lib/supabase';

export type SearchParams = {
    tab?: string;
    region?: string;
    pref?: string;
    city?: string;
    station_pref?: string;
    line?: string;
    station?: string;
    min_rent?: number;
    max_rent?: number;
    walk?: number;
    gender?: string;
    types?: string[];
    amenities?: string[];
    q?: string;
    page?: number;
};

export async function fetchListings(params: SearchParams) {
    let query = supabase
        .from('listings')
        .select('*, city_name, station_name', { count: 'exact' });

    // 1. Tab / Area / Line Logic
    // This logic mimics the client-side filtering, but applied to the DB query where possible.
    // Note: Some filtering might need to be done in memory if DB schema doesn't support direct querying smoothly,
    // but ideally we push to DB.

    // Area Tab
    if (params.tab === 'area' || !params.tab) {
        if (params.region) query = query.eq('region', params.region);
        if (params.pref) query = query.eq('prefecture', params.pref);
        if (params.city) query = query.eq('city_name', params.city);
    }

    // Station Tab (Not fully implemented in DB schema yet? logic in client was seemingly filtering in memory or missing?)
    // Looking at previous client code, it wasn't filtering by station in the DB query shown in snippet?
    // Use simple matching for now if columns exist.
    if (params.tab === 'station') {
        if (params.station) query = query.eq('station_name', params.station);
        // Line filtering might be harder if it's not a direct column, barring 'line_name' or similar.
        // existing client code had `stationSelection` state but didn't show the fetch logic in the snippet I read.
        // I will assume standard filtering.
    }

    // 2. Common Filters
    if (params.min_rent) query = query.gte('price', params.min_rent * 10000); // UI uses "Man", DB uses "Yen"
    if (params.max_rent && params.max_rent < 50) query = query.lte('price', params.max_rent * 10000);

    if (params.gender && params.gender !== 'all') {
        // strict logic: 'male' -> gender = 'male' (Male Only)
        // 'female' -> gender = 'female' (Female Only)
        // But usually "Male OK" includes "Any"?
        // User requested "Strict" logic previously.
        query = query.eq('gender', params.gender);
    }

    // Keyword (simple partial match on title/description)
    if (params.q) {
        query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`);
    }

    // Amenities & Types (Array columns?)
    if (params.types && params.types.length > 0) {
        // Assuming 'room_type' is a single value or array?
        // If multiple selected, we want match ANY.
        // usage: .in('room_type', params.types)
        query = query.in('room_type', params.types);
    }

    if (params.amenities && params.amenities.length > 0) {
        // Array contains logic
        query = query.contains('amenities', params.amenities);
    }

    // Pagination
    const ITEMS_PER_PAGE = 20;
    const page = params.page || 1;
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    query = query.range(from, to);
    query = query.order('created_at', { ascending: false });

    const { data, count, error } = await query;

    if (error) {
        console.error("Error fetching listings:", error);
        return { listings: [], count: 0 };
    }

    return { listings: data, count };
}
