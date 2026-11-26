import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';
import { littleServerListingsEndpoint } from '@/lib/little-server-listings';
const maxListingBytes = 131072;

async function authenticatedOwner(request: NextRequest) {
    const bearer = request.headers.get('authorization')?.match(/^Bearer (\S+)$/i)?.[1];
    if (!bearer) return undefined;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Supabase Auth configuration is unavailable');

    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data, error } = await supabase.auth.getUser(bearer);
    return error ? undefined : data.user?.id;
}

async function proxyListings(request: NextRequest) {
    if (request.method !== 'GET' && process.env.LITTLE_SERVER_LISTINGS_WRITES !== 'on') {
        return Response.json({ error: 'Listing writes are unavailable' }, { status: 405 });
    }
    const token = process.env.LITTLE_SERVER_LISTINGS_TOKEN;
    if (!token) return Response.json({ error: 'Listing service unavailable' }, { status: 503 });

    const url = new URL(littleServerListingsEndpoint);
    const params = request.nextUrl.searchParams;
    const isUpload = request.method === 'POST' && params.get('upload') === '1';
    const id = params.get('id') ?? (request.method === 'POST' ? randomUUID() : null);
    if (id !== null) url.searchParams.set('id', id);
    if (isUpload) url.searchParams.set('upload', '1');
    if (request.method === 'PATCH' && params.get('bump') === '1') url.searchParams.set('bump', '1');
    const page = params.get('page');
    if (page !== null) url.searchParams.set('page', page);

    try {
        const headers = new Headers({ 'X-Roommikke-Token': token });
        if (request.method !== 'GET' || params.get('mine') === '1') {
            const owner = await authenticatedOwner(request);
            if (!owner) return Response.json({ error: 'Unauthorized' }, { status: 401 });
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

        const result = await fetch(url, {
            method: request.method,
            headers,
            body,
            redirect: 'error',
            cache: 'no-store',
            signal: AbortSignal.timeout(8000),
        });
        if (result.status === 401 || result.status >= 500 ||
            !result.headers.get('content-type')?.startsWith('application/json')) {
            throw new Error('Listing service response unavailable');
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

export const GET = proxyListings;
export const POST = proxyListings;
export const PATCH = proxyListings;
export const DELETE = proxyListings;
