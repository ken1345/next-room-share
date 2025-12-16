import { supabase } from '@/lib/supabase';
import { toRomaji, slugify } from '@/lib/romaji';

// Define the shape of our search parameters
export type SearchParams = {
    tab?: string;
    q?: string;
    min_rent?: string;
    max_rent?: string;
    walk?: string;
    gender?: string;
    amenities?: string;
    types?: string;

    // Area params
    region?: string;
    pref?: string;
    city?: string;

    // Station params
    station_pref?: string;
    line?: string;
    station?: string;

    // Feature param
    feature?: string;

    // Pagination
    page?: string;
};

export const fetchListingsServer = async (searchParams: SearchParams) => {
    const ITEMS_PER_PAGE = 20;
    const page = Number(searchParams.page) || 1;
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    let query = supabase
        .from('listings')
        .select('*', { count: 'exact' })
        .eq('is_public', true)
        .order('created_at', { ascending: false });

    // 1. Keyword Filter (Applied partially on server if possible, or we fetch all and filter client side? 
    // Supabase 'textSearch' or 'ilike' can work. 
    // But our previous client logic filtered across MANY fields (title, desc, address, station etc).
    // Doing complex OR logic across many columns in Supabase single query can be tricky without a generated column or RPC.
    // For now, to match Client logic exactly, we might need to be careful.
    // "Text search" with 'or' syntax: .or(`title.ilike.%${q}%,description.ilike.%${q}%...`)
    if (searchParams.q) {
        const q = searchParams.q;
        // Note: Supabase .or() with ilike is possible.
        // Ensure to wrap in parentheses if combined with other filters.
        // Columns: title, description, address, prefecture, city, station_name, station_line
        const orQuery = `title.ilike.%${q}%,description.ilike.%${q}%,address.ilike.%${q}%,prefecture.ilike.%${q}%,city.ilike.%${q}%,station_name.ilike.%${q}%,station_line.ilike.%${q}%`;
        query = query.or(orQuery);
    }

    // 2. Area Filter
    const activeTab = searchParams.tab || 'area';

    if (activeTab === 'area') {
        if (searchParams.pref) {
            query = query.eq('prefecture', searchParams.pref);
        } else if (searchParams.region) {
            // Region filtering
            // Invert the region mapping to find all prefectures for the selected region
            // region-mapping.json is simple: "Prefecture": "Region"
            // We need "Region": ["Prefecture1", "Prefecture2"]
            // Since this is a server function, we can do this mapping at runtime or statically.
            // Given the small size, iterating is fine.
            // region-mapping.json is simple: "Prefecture": "Region"
            // We need "Region": ["Prefecture1", "Prefecture2"]
            // Since this is a server function, we can do this mapping at runtime or statically.
            // Given the small size, iterating is fine.
            const region = searchParams.region;
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const regionMapping: { [key: string]: string } = require('@/data/region-mapping.json');

            const targetPrefectures = Object.entries(regionMapping)
                .filter(([_, r]) => r === region)
                .map(([pref]) => pref);

            if (targetPrefectures.length > 0) {
                query = query.in('prefecture', targetPrefectures);
            }
        }

        if (searchParams.city) {
            query = query.eq('city', searchParams.city);
        }
    }

    // 3. Station Filter
    if (activeTab === 'station') {
        if (searchParams.station_pref) {
            query = query.eq('prefecture', searchParams.station_pref);
        }
        if (searchParams.line) {
            // station_line stored as string? or array?
            // In `PhotoPropertyCard`, it expects `station_line` string.
            // Supabase `ilike` for partial match
            query = query.ilike('station_line', `%${searchParams.line}%`);
        }
        if (searchParams.station) {
            query = query.ilike('station_name', `%${searchParams.station}%`);
        }
    }

    // 4. Room Type Filter
    // types=個室,ドミトリー
    if (searchParams.types) {
        const types = searchParams.types.split(',');
        const typeCodes: string[] = [];
        if (types.includes('個室')) typeCodes.push('private');
        if (types.includes('半個室')) typeCodes.push('semi');
        if (types.includes('ドミトリー') || types.includes('シェアハウス')) typeCodes.push('shared');

        // .in()
        if (typeCodes.length > 0) {
            query = query.in('room_type', typeCodes);
        }
    }

    // 5. Rent Filter
    // Stored as integer yen. Params as 'man-en'.
    if (searchParams.min_rent) {
        const min = Number(searchParams.min_rent) * 10000;
        query = query.gte('price', min);
    }
    if (searchParams.max_rent) {
        const max = Number(searchParams.max_rent) * 10000;
        // Assuming max limit of slide (50) means "no upper limit" or similar?
        // Client logic: `if (p.price > rentMax * 10000) return false`.
        // If param is set, apply it.
        query = query.lte('price', max);
    }

    // 6. Gender Filter
    if (searchParams.gender && searchParams.gender !== 'all') {
        if (searchParams.gender === 'male') {
            // Logic: gender_restriction='male' OR amenities includes '男性限定'/'男性専用'
            // This OR logic combined with AND of other filters is hard in single chain.
            // .or() applies to the whole row unless scoped?
            // Actually Supabase `.or()` *inside* a filter chain is tricky.
            // Easier to do post-filtering for complex ORs if dataset is small, BUT for pagination we need DB filtering.

            // Let's try to approximate or use strict column check if `gender_restriction` is reliable.
            // If `amenities` is JSONB or Array, we can use .cs (contains)
            // `gender_restriction` column exists.
            // Let's rely on `gender_restriction` column primarily if possible.
            // query = query.eq('gender_restriction', 'male');

            // However, dealing with "Amenities string" creates complexity.
            // "amenities" is text[] or jsonb?
            // In fetch-listings.ts (previous session), it was just returned.
            // Ideally we rely on `gender_restriction` column.
            query = query.eq('gender_restriction', 'male');
        } else if (searchParams.gender === 'female') {
            query = query.eq('gender_restriction', 'female');
        }
    }

    // 7. Amenities Filter (AND logic)
    if (searchParams.amenities) {
        const amenities = searchParams.amenities.split(',');
        // In Supabase, if `amenities` is text[], `.contains('amenities', ['Wifi'])` works.
        // If it's pure text, we need multiple ilikes?
        // Let's assume it is an array based on usage.
        if (amenities.length > 0) {
            query = query.contains('amenities', amenities);
        }
    }

    // 8. Walk Time
    if (searchParams.walk) {
        const minutes = Number(searchParams.walk);
        query = query.lte('minutes_to_station', minutes);
    }

    // 9. Feature Params
    if (searchParams.feature) {
        const f = searchParams.feature;
        if (f === 'pet') query = query.contains('amenities', ['ペット相談可']);
        if (f === 'wifi') query = query.contains('amenities', ['高速インターネット(光回線)']); // or 'インターネット無料'
        if (f === 'foreigner') query = query.contains('amenities', ['外国人歓迎']);
        if (f === 'female') query = query.eq('gender_restriction', 'female'); // Approximating feature=female to restriction
        if (f === 'cheap') query = query.lte('price', 30000);
        if (f === 'diy') query = query.contains('amenities', ['DIY可']);
        if (f === 'gamer') query = query.contains('amenities', ['高速インターネット(光回線)']);
        // For gym/theater/sauna, relying on text search within amenities if specific tag doesn't exist
        // But .contains works on exact array elements. 
        // If we need partial match on array elements, that's hard in PostgREST.
        // We might skip these complex partial matches on Server for now, OR fetch and filter.
        // Given the small scale, Fetching more and filtering in memory is safer?
        // But we need pagination.
        // Let's hope the tags are standardized or use .textSearch on a joined column if available.
        // For now, let's omit the complex partial text matches for gym/theater/sauna in SQL and accept that 
        // standard tags are needed, or handle post-fetch (which breaks exact pagination).
        // Let's stick to simple filters for now.
    }

    // Apply Pagination Range
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
        console.error('Error fetching listings server:', error);
        return { listings: [], count: 0 };
    }

    // Post-processing for "complex text matches" if absolutely necessary? 
    // No, let's return what we have.

    // Generate Slugs for all listings (or use DB slug)
    const listingsWithSlugs = await Promise.all((data || []).map(async (l) => {
        // If DB already has a valid slug, use it.
        if (l.slug && l.slug.length > 0) {
            return l;
        }

        // Fallback: Generate runtime if missing
        // Construct base string: "Prefecture City"
        const locationString = `${l.prefecture || ''} ${l.city || ''}`;

        let pathSlug = '';
        if (locationString.trim()) {
            try {
                const romaji = await toRomaji(locationString);
                pathSlug = slugify(romaji);
            } catch (e) {
                console.error("Romaji conversion failed for", l.id, e);
            }
        }

        // Final safety: if pathSlug is empty, try to use just prefecture from map if possible.
        // (Handled inside toRomaji fallback ideally)

        return {
            ...l,
            slug: pathSlug // Add slug to listing object
        };
    }));

    return { listings: listingsWithSlugs, count };
};
