import type { NextRequest } from 'next/server';
import { handleListings } from '@/lib/little-server-listings-route';

const route = (request: NextRequest) => handleListings(request);

export const GET = route;
export const POST = route;
export const PATCH = route;
export const DELETE = route;
