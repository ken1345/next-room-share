import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { littleServerListingsEndpoint } from '@/lib/little-server-listings-endpoint';
import { handleSupabaseListings } from '@/lib/supabase-listings-transition';
import { excludeRetiredListingOwners } from '@/lib/little-server-retired-owners';
import { withCurrentListingCounts } from '@/lib/listing-counts';
const maxListingBytes = 131072;
const listingIdPattern = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;

async function authenticatedOwner(request: NextRequest) {
    const bearer = request.headers.get('authorization')?.match(/^Bearer (\S+)$/i)?.[1];
    if (!bearer) return undefined;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Supabase Auth configuration is unavailable');

    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase.auth.getUser(bearer);
    if (error && error.status !== 400 && error.status !== 401 && error.status !== 403) {
        throw new Error('Supabase Auth is unavailable');
    }
    return error ? undefined : data.user?.id;
}

async function ensureListingReference(id: string, token: string, deviceTestOwners?: Set<string>) {
    const url = new URL(littleServerListingsEndpoint);
    url.searchParams.set('id', id);
    const response = await fetch(url, {
        headers: { 'X-Roommikke-Token': token },
        redirect: 'error',
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('Listing unavailable');

    const { listings } = await response.json() as {
        listings: { id: string; host_id: string; title: string; price: number; is_public: boolean }[];
    };
    const listing = listings.find(item => item.id === id && item.is_public);
    if (!listing) return Response.json({ error: 'Listing not found' }, { status: 404 });
    if (deviceTestOwners && !deviceTestOwners.has(listing.host_id)) {
        return Response.json({ error: 'Listing not found' }, { status: 404 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !adminKey) throw new Error('Supabase reference configuration is unavailable');
    const admin = createClient(supabaseUrl, adminKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const findReference = () => admin.from('listings').select('host_id').eq('id', id).maybeSingle();
    let { data: reference, error } = await findReference();
    if (error) throw error;

    if (!reference) {
        if (!deviceTestOwners && process.env.LITTLE_SERVER_LISTING_REFERENCES !== 'on') {
            return Response.json({ error: 'New listing connections are unavailable in this environment' }, { status: 503 });
        }
        const { error: insertError } = await admin.from('listings').upsert({
            id,
            host_id: listing.host_id,
            title: listing.title,
            price: listing.price,
            is_public: false,
        }, { onConflict: 'id', ignoreDuplicates: true });
        if (insertError) throw insertError;
        ({ data: reference, error } = await findReference());
        if (error) throw error;
    }

    if (reference?.host_id !== listing.host_id) {
        return Response.json({ error: 'Listing owner mismatch' }, { status: 409 });
    }
    return Response.json({ ready: true });
}

export async function handleListings(request: NextRequest, deviceTest = false) {
    if (!deviceTest && process.env.LITTLE_SERVER_LISTINGS_MODE === 'frozen' && request.method !== 'GET') {
        return Response.json({ error: '物件の更新を一時停止しています。しばらくしてからお試しください。' }, {
            status: 503,
            headers: { 'Cache-Control': 'no-store', 'Retry-After': '60' },
        });
    }
    const deviceTestOwners = deviceTest
        ? new Set((process.env.LITTLE_SERVER_DEVICE_TEST_ACCOUNTS ?? '').split(',').map(value => value.trim()).filter(Boolean))
        : undefined;
    const littleServerMode = deviceTest || process.env.LITTLE_SERVER_LISTINGS_MODE === 'little-server'
        || (process.env.VERCEL_ENV !== 'production' && process.env.NEXT_PUBLIC_LISTINGS_BACKEND === 'little-server');
    if (request.method !== 'GET' && littleServerMode && !deviceTest && process.env.LITTLE_SERVER_LISTINGS_WRITES !== 'on') {
        return Response.json({ error: 'Listing writes are unavailable' }, { status: 405 });
    }
    const token = deviceTest ? process.env.LITTLE_SERVER_DEVICE_TEST_TOKEN : process.env.LITTLE_SERVER_LISTINGS_TOKEN;
    const url = new URL(littleServerListingsEndpoint);
    const params = request.nextUrl.searchParams;
    const isReference = request.method === 'POST' && params.get('reference') === '1';
    const isUpload = request.method === 'POST' && params.get('upload') === '1';
    const id = params.get('id') ?? (request.method === 'POST' ? randomUUID() : null);
    if (id !== null && !listingIdPattern.test(id)) {
        return Response.json({ error: 'Invalid listing ID' }, { status: 400 });
    }
    if (id !== null) url.searchParams.set('id', id);
    if (isUpload) url.searchParams.set('upload', '1');
    const isBump = request.method === 'PATCH' && params.get('bump') === '1';
    if (isBump) url.searchParams.set('bump', '1');
    const page = params.get('page');
    if (page !== null) url.searchParams.set('page', page);

    try {
        const headers = new Headers();
        let owner: string | undefined;
        if (request.method !== 'GET' || params.get('mine') === '1') {
            owner = await authenticatedOwner(request);
            if (!owner) return Response.json({ error: 'Unauthorized' }, { status: 401 });
            if (deviceTestOwners && !deviceTestOwners.has(owner)) {
                return Response.json({ error: 'Account is not enabled for device tests' }, { status: 403 });
            }
            if (isReference) {
                const referenceId = params.get('id');
                if (!referenceId || !listingIdPattern.test(referenceId)) {
                    return Response.json({ error: 'Invalid listing ID' }, { status: 400 });
                }
                if (littleServerMode) {
                    if (!token) throw new Error('Listing service unavailable');
                    return await ensureListingReference(referenceId, token, deviceTestOwners);
                }
            }
            headers.set('X-Roommikke-Owner', owner);
        }

        let body: ArrayBuffer | undefined;
        if (request.method === 'POST' || request.method === 'PATCH') {
            const limit = isUpload ? 3 * 1024 * 1024 : maxListingBytes;
            if (Number(request.headers.get('content-length')) > limit) {
                return Response.json({ error: 'Listing data too large' }, { status: 413 });
            }
            body = await request.arrayBuffer();
            if (body.byteLength > limit) {
                return Response.json({ error: 'Listing data too large' }, { status: 413 });
            }
            headers.set('Content-Type', isUpload ? 'application/octet-stream' : 'application/json');
        }

        if (!littleServerMode && !isUpload) {
            return await handleSupabaseListings(request, id, page, owner, isReference, isBump, body);
        }
        if (!token) throw new Error('Listing service unavailable');
        headers.set('X-Roommikke-Token', token);
        if (!deviceTest && process.env.VERCEL_ENV === 'production' &&
            process.env.LITTLE_SERVER_LISTINGS_MODE === 'little-server' &&
            request.method !== 'GET' && !isUpload) {
            headers.set('X-Roommikke-Project-Legacy', '1');
        }
        const result = await fetch(url, {
            method: request.method,
            headers,
            body,
            redirect: 'error',
            cache: 'no-store',
            signal: AbortSignal.timeout(headers.has('X-Roommikke-Project-Legacy') ? 14000 : 8000),
        });
        if (result.status === 401 || result.status >= 500 ||
            !result.headers.get('content-type')?.startsWith('application/json')) {
            throw new Error('Listing service response unavailable');
        }
        if (result.ok && headers.has('X-Roommikke-Project-Legacy') &&
            result.headers.get('X-Roommikke-Legacy-Projected') !== '1') {
            throw new Error('Legacy listing projection was not confirmed');
        }
        if (request.method === 'GET' && result.ok) {
            const data = await result.json() as { listings: { id: string; host_id: string }[] };
            const visible = deviceTest ? data.listings : await excludeRetiredListingOwners(data.listings);
            const listings = await withCurrentListingCounts(visible);
            return Response.json({ listings }, { headers: { 'Cache-Control': 'no-store' } });
        }
        if (request.method !== 'GET' && !isUpload && result.ok) {
            revalidateTag('little-server-listings', { expire: 0 });
        }
        return new Response(result.body, {
            status: result.status,
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json; charset=utf-8',
            },
        });
    } catch {
        return Response.json({ error: 'Listing service unavailable' }, { status: 503 });
    }
}
