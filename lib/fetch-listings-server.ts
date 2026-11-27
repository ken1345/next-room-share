import { supabase } from '@/lib/supabase';
import { toRomaji, slugify } from '@/lib/romaji';
import regionMapping from '@/data/region-mapping.json';
import { readPublicLittleServerListings, useLittleServerListings, type LittleServerListing } from './little-server-listings';
import { withCurrentListingCounts } from './listing-counts';

export type SearchParams = {
    tab?: string;
    q?: string;
    min_rent?: string;
    max_rent?: string;
    walk?: string;
    gender?: string;
    amenities?: string;
    equipment?: string;
    personal_equipment?: string;
    types?: string;
    region?: string;
    pref?: string;
    city?: string;
    station_pref?: string;
    line?: string;
    station?: string;
    feature?: string;
    page?: string;
};

type FetchListingsOptions = {
    page?: number;
    itemsPerPage?: number;
};

export type ListingRecord = {
    id: string;
    title: string;
    price: number;
    description?: string | null;
    equipment?: string[] | null;
    personal_equipment?: string[] | null;
    station_name?: string | null;
    minutes_to_station?: number | null;
    address?: string | null;
    room_type?: string | null;
    amenities?: string[] | null;
    images?: string[] | null;
    view_count?: number | null;
    favorites_count?: number | null;
    inquiry_count?: number | null;
    created_at?: string | null;
    slug?: string | null;
    prefecture?: string | null;
    city?: string | null;
};

function applyFeatureFilter(query: ReturnType<typeof buildListingsQuery>, feature: string) {
    if (feature === 'pet' || feature === 'pet-friendly') {
        return query.contains('amenities', ['ペット相談可']);
    }

    if (feature === 'wifi') {
        return query.contains('amenities', ['高速インターネット(光回線)']);
    }

    if (feature === 'foreigner' || feature === 'foreigners-welcome') {
        return query.contains('amenities', ['外国人歓迎']);
    }

    if (feature === 'female') {
        return query.eq('gender_restriction', 'female');
    }

    if (feature === 'cheap' || feature === 'low-initial-cost') {
        return query.lte('price', 50000);
    }

    if (feature === 'private-room') {
        return query.eq('room_type', 'private');
    }

    if (feature === 'furnished') {
        return query.or('equipment.cs.{"冷蔵庫"},equipment.cs.{"電子レンジ"},equipment.cs.{"エアコン"},equipment.cs.{"ベッド"}');
    }

    if (feature === 'work-from-home') {
        return query.or('amenities.cs.{"高速インターネット(光回線)"},equipment.cs.{"Wifi"},equipment.cs.{"デスク"},equipment.cs.{"エアコン"}');
    }

    if (feature === 'diy') {
        return query.contains('amenities', ['DIY可']);
    }

    if (feature === 'gamer') {
        return query.contains('amenities', ['高速インターネット(光回線)']);
    }

    if (feature === 'new') {
        return query.or('amenities.cs.{"新築"},amenities.cs.{"リノベ"}');
    }

    return query;
}

function buildListingsQuery(searchParams: SearchParams, countOnly = false) {
    let query = supabase
        .from('listings')
        .select('*', countOnly ? { count: 'exact', head: true } : { count: 'exact' })
        .eq('is_public', true);

    if (!countOnly) {
        query = query.order('updated_at', { ascending: false });
    }

    if (searchParams.q) {
        const q = searchParams.q;
        const orQuery = `title.ilike.%${q}%,description.ilike.%${q}%,address.ilike.%${q}%,prefecture.ilike.%${q}%,city.ilike.%${q}%,station_name.ilike.%${q}%,station_line.ilike.%${q}%`;
        query = query.or(orQuery);
    }

    const activeTab = searchParams.tab || 'area';

    if (activeTab === 'area') {
        if (searchParams.pref) {
            query = query.eq('prefecture', searchParams.pref);
        } else if (searchParams.region) {
            const targetPrefectures = Object.entries(regionMapping)
                .filter(([, region]) => region === searchParams.region)
                .map(([prefecture]) => prefecture);

            if (targetPrefectures.length > 0) {
                query = query.in('prefecture', targetPrefectures);
            }
        }

        if (searchParams.city) {
            query = query.eq('city', searchParams.city);
        }
    }

    if (activeTab === 'station') {
        if (searchParams.station_pref) {
            query = query.eq('prefecture', searchParams.station_pref);
        }
        if (searchParams.line) {
            query = query.ilike('station_line', `%${searchParams.line}%`);
        }
        if (searchParams.station) {
            query = query.ilike('station_name', `%${searchParams.station}%`);
        }
    }

    if (searchParams.types) {
        const types = searchParams.types.split(',');
        const typeCodes: string[] = [];
        if (types.includes('個室')) typeCodes.push('private');
        if (types.includes('半個室')) typeCodes.push('semi');
        if (types.includes('ドミトリー') || types.includes('シェアハウス')) typeCodes.push('shared');

        if (typeCodes.length > 0) {
            query = query.in('room_type', typeCodes);
        }
    }

    if (searchParams.min_rent) {
        query = query.gte('price', Number(searchParams.min_rent) * 10000);
    }

    if (searchParams.max_rent) {
        query = query.lte('price', Number(searchParams.max_rent) * 10000);
    }

    if (searchParams.gender && searchParams.gender !== 'all') {
        query = query.eq('gender_restriction', searchParams.gender);
    }

    if (searchParams.amenities) {
        const amenities = searchParams.amenities.split(',');
        if (amenities.length > 0) {
            query = query.contains('amenities', amenities);
        }
    }

    if (searchParams.equipment) {
        const equipment = searchParams.equipment.split(',');
        if (equipment.length > 0) {
            query = query.contains('equipment', equipment);
        }
    }

    if (searchParams.personal_equipment) {
        const personalEquipment = searchParams.personal_equipment.split(',');
        if (personalEquipment.length > 0) {
            query = query.contains('personal_equipment', personalEquipment);
        }
    }

    if (searchParams.walk) {
        query = query.lte('minutes_to_station', Number(searchParams.walk));
    }

    if (searchParams.feature) {
        query = applyFeatureFilter(query, searchParams.feature);
    }

    return query;
}

async function withListingSlugs(listings: ListingRecord[]) {
    return Promise.all(
        listings.map(async (listing) => {
            if (listing.slug && listing.slug.length > 0) {
                return listing;
            }

            const locationString = `${listing.prefecture || ''} ${listing.city || ''}`.trim();
            let slug = '';

            if (locationString) {
                try {
                    const romaji = await toRomaji(locationString);
                    slug = slugify(romaji);
                } catch (error) {
                    console.error('Romaji conversion failed for listing', listing.id, error);
                }
            }

            return {
                ...listing,
                slug,
            };
        })
    );
}

function matchesLittleServerFeature(listing: LittleServerListing, feature?: string) {
    const amenities = listing.amenities ?? [];
    const equipment = listing.equipment ?? [];
    const hasFiber = amenities.includes('高速インターネット(光回線)');
    switch (feature) {
        case 'pet': case 'pet-friendly': return amenities.includes('ペット相談可');
        case 'wifi': case 'gamer': return hasFiber;
        case 'foreigner': case 'foreigners-welcome': return amenities.includes('外国人歓迎');
        case 'female': return listing.gender_restriction === 'female';
        case 'cheap': case 'low-initial-cost': return listing.price <= 50000;
        case 'private-room': return listing.room_type === 'private';
        case 'furnished': return ['冷蔵庫', '電子レンジ', 'エアコン', 'ベッド'].some(item => equipment.includes(item));
        case 'work-from-home': return hasFiber || ['Wifi', 'デスク', 'エアコン'].some(item => equipment.includes(item));
        case 'diy': return amenities.includes('DIY可');
        case 'new': return amenities.includes('新築') || amenities.includes('リノベ');
        default: return true;
    }
}

async function filterLittleServerListings(params: SearchParams) {
    const requestedTypes = params.types?.split(',') ?? [];
    const typeCodes = [
        ...(requestedTypes.includes('個室') ? ['private'] : []),
        ...(requestedTypes.includes('半個室') ? ['semi'] : []),
        ...(requestedTypes.includes('ドミトリー') || requestedTypes.includes('シェアハウス') ? ['shared'] : []),
    ];
    const regionPrefectures = Object.entries(regionMapping)
        .filter(([, region]) => region === params.region).map(([prefecture]) => prefecture);
    const contains = (value: string | null | undefined, query: string) => value?.toLowerCase().includes(query.toLowerCase());
    const includesAll = (values: string[] | null | undefined, requested?: string) =>
        !requested || requested.split(',').every(value => values?.includes(value));

    return (await readPublicLittleServerListings()).filter(listing => {
        if (params.q && ![listing.title, listing.description, listing.address, listing.prefecture,
            listing.city, listing.station_name, listing.station_line].some(value => contains(value, params.q!))) return false;

        if (!params.tab || params.tab === 'area') {
            if (params.pref && listing.prefecture !== params.pref) return false;
            if (!params.pref && regionPrefectures.length && !regionPrefectures.includes(listing.prefecture ?? '')) return false;
            if (params.city && listing.city !== params.city) return false;
        }
        if (params.tab === 'station') {
            if (params.station_pref && listing.prefecture !== params.station_pref) return false;
            if (params.line && !contains(listing.station_line, params.line)) return false;
            if (params.station && !contains(listing.station_name, params.station)) return false;
        }
        if (typeCodes.length && !typeCodes.includes(listing.room_type ?? '')) return false;
        if (params.min_rent && !(listing.price >= Number(params.min_rent) * 10000)) return false;
        if (params.max_rent && !(listing.price <= Number(params.max_rent) * 10000)) return false;
        if (params.walk && (listing.minutes_to_station == null || !(listing.minutes_to_station <= Number(params.walk)))) return false;
        if (params.gender && params.gender !== 'all' && listing.gender_restriction !== params.gender) return false;
        return includesAll(listing.amenities, params.amenities) &&
            includesAll(listing.equipment, params.equipment) &&
            includesAll(listing.personal_equipment, params.personal_equipment) &&
            matchesLittleServerFeature(listing, params.feature);
    });
}

export async function fetchListingsCount(searchParams: SearchParams) {
    if (useLittleServerListings) return (await filterLittleServerListings(searchParams)).length;

    const { count, error } = await buildListingsQuery(searchParams, true);

    if (error) {
        console.error('Error fetching listings count:', error);
        return 0;
    }

    return count || 0;
}

export async function fetchListingsServer(searchParams: SearchParams, options: FetchListingsOptions = {}) {
    const itemsPerPage = options.itemsPerPage ?? 20;
    const currentPage = options.page ?? (Number(searchParams.page) > 0 ? Number(searchParams.page) : 1);
    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    if (useLittleServerListings) {
        const listings = await filterLittleServerListings(searchParams);
        const page = await withCurrentListingCounts(listings.slice(from, to + 1));
        return { listings: await withListingSlugs(page), count: listings.length };
    }

    const { data, count, error } = await buildListingsQuery(searchParams).range(from, to);

    if (error) {
        console.error('Error fetching listings server:', error);
        return { listings: [], count: 0 };
    }

    const listingsWithSlugs = await withListingSlugs(data || []);

    return {
        listings: listingsWithSlugs,
        count: count || 0,
    };
}
