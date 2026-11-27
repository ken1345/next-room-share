import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'node:crypto';

const uuid = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/;
const maxProjectionBytes = 262144;

export async function POST(request: Request) {
    if (process.env.VERCEL_ENV !== 'production' || process.env.LITTLE_SERVER_LISTINGS_MODE !== 'little-server') {
        return new Response(null, { status: 404 });
    }
    const token = process.env.LITTLE_SERVER_LISTINGS_TOKEN;
    const supplied = request.headers.get('x-roommikke-token');
    if (!token || !supplied) return new Response(null, { status: 401 });
    const expected = Buffer.from(token);
    const actual = Buffer.from(supplied);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
        return new Response(null, { status: 401 });
    }

    if (Number(request.headers.get('content-length')) > maxProjectionBytes) {
        return new Response(null, { status: 413 });
    }
    const body = await request.arrayBuffer();
    if (body.byteLength > maxProjectionBytes) return new Response(null, { status: 413 });
    let listing;
    try {
        listing = JSON.parse(new TextDecoder().decode(body));
    } catch {
        return new Response(null, { status: 400 });
    }
    if (!listing || !uuid.test(listing.id ?? '') || !uuid.test(listing.host_id ?? '') ||
        typeof listing.title !== 'string' || !Number.isInteger(listing.price) ||
        (typeof listing.is_public !== 'boolean' && listing.is_public !== null)) {
        return new Response(null, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return new Response(null, { status: 503 });
    const admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await admin.rpc('project_little_server_listing', { listing_data: listing })
        .abortSignal(AbortSignal.timeout(5000));
    if (error) {
        console.error('[Listing projection] Supabase write failed:', error.code);
        return new Response(null, { status: 503 });
    }
    return new Response(null, { status: data === true ? 204 : 409 });
}
