import { supabase } from '@/lib/supabase';
import { toRomaji, slugify } from '@/lib/romaji';
import regionMapping from '@/data/region-mapping.json';

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

type ListingRecord = {
    id: string;
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

export async function fetchListingsCount(searchParams: SearchParams) {
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
