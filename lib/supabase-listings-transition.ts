import 'server-only';
import { createClient } from '@supabase/supabase-js';

const editableColumns = new Set([
    'title', 'description', 'price', 'address', 'latitude', 'longitude',
    'prefecture', 'city', 'station_line', 'station_name', 'minutes_to_station',
    'room_type', 'gender_restriction', 'building_type', 'slug', 'slug_jp',
    'amenities', 'equipment', 'personal_equipment', 'images', 'is_public',
]);
const listingColumns = 'id, host_id, title, description, price, address, latitude, longitude, prefecture, city, station_line, station_name, minutes_to_station, room_type, gender_restriction, building_type, slug, slug_jp, amenities, equipment, personal_equipment, images, is_public, view_count, favorites_count, inquiry_count, created_at, updated_at';

function reply(body: unknown, status = 200) {
    return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function handleSupabaseListings(
    request: Request,
    id: string | null,
    page: string | null,
    owner: string | undefined,
    reference: boolean,
    bump: boolean,
    body?: ArrayBuffer,
) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Supabase listing configuration unavailable');
    const authorization = owner ? request.headers.get('authorization') : null;
    const supabase = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: authorization ? { headers: { Authorization: authorization } } : undefined,
    });

    if (request.method === 'GET') {
        const pageNumber = Number(page ?? 1);
        if (!Number.isSafeInteger(pageNumber) || pageNumber < 1 || pageNumber > 100000) {
            return reply({ error: 'Invalid page' }, 400);
        }
        const offset = (pageNumber - 1) * 100;
        let query = supabase.from('listings').select(listingColumns);
        query = owner ? query.eq('host_id', owner) : query.eq('is_public', true);
        if (id) query = query.eq('id', id);
        const { data, error } = await query.order('updated_at', { ascending: false, nullsFirst: false })
            .order('id').range(offset, offset + 99).abortSignal(AbortSignal.timeout(8000));
        if (error) throw error;
        return reply({
            listings: data.map(row => ({
                ...row,
                favorites_count: row.favorites_count ?? 0,
                inquiry_count: row.inquiry_count ?? 0,
            })),
        });
    }

    if (!owner || !id) return reply({ error: 'Listing ID and authentication are required' }, 400);
    if (reference) {
        const { data, error } = await supabase.from('listings').select('id')
            .eq('id', id).eq('is_public', true).maybeSingle();
        if (error) throw error;
        return data ? reply({ ready: true }) : reply({ error: 'Listing not found' }, 404);
    }
    if (request.method === 'DELETE') {
        const { data, error } = await supabase.from('listings').delete()
            .eq('id', id).eq('host_id', owner).select('id').maybeSingle();
        if (error) throw error;
        return data ? reply({ deleted: true }) : reply({ error: 'Listing not found' }, 404);
    }
    if (bump) {
        const cutoff = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();
        const { data, error } = await supabase.from('listings').update({ updated_at: new Date().toISOString() })
            .eq('id', id).eq('host_id', owner).or(`updated_at.is.null,updated_at.lte.${cutoff}`)
            .select('id').maybeSingle();
        if (error) throw error;
        return data ? reply({ id }) : reply({ error: 'Listing cannot be bumped yet' }, 409);
    }

    let input: unknown;
    try {
        input = JSON.parse(new TextDecoder().decode(body));
    } catch {
        return reply({ error: 'Invalid listing data' }, 400);
    }
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
        return reply({ error: 'Invalid listing data' }, 400);
    }
    const fields = Object.keys(input);
    if (!fields.length || fields.some(field => !editableColumns.has(field))) {
        return reply({ error: 'Unsupported listing field' }, 400);
    }
    const values = { ...input, updated_at: new Date().toISOString() };
    const query = supabase.from('listings');
    const write = request.method === 'POST'
        ? query.insert({ ...values, id, host_id: owner })
        : query.update(values).eq('id', id).eq('host_id', owner);
    const { data, error } = await write.select('id').maybeSingle();
    if (error?.code === '23505') return reply({ error: 'Listing already exists' }, 409);
    if (error?.code?.startsWith('22') || error?.code?.startsWith('23')) {
        return reply({ error: 'Invalid listing data' }, 400);
    }
    if (error?.code === '42501') return reply({ error: 'Listing write not permitted' }, 403);
    if (error) throw error;
    return data ? reply({ id }, request.method === 'POST' ? 201 : 200) : reply({ error: 'Listing not found' }, 404);
}
