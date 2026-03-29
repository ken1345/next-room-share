import { fetchListingsCount, type SearchParams } from '@/lib/fetch-listings-server';
import { supabase } from '@/lib/supabase';
import {
    SEO_AREAS,
    SEO_CITIES,
    SEO_FEATURES,
    SEO_STATIONS,
} from '@/lib/seo/config';

export type SitemapItem = {
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: string;
};

type PropertySitemapListing = {
    id: string;
    slug?: string | null;
    updated_at?: string | null;
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://roommikke.jp';

function withTrailingSlash(path: string) {
    return path.endsWith('/') ? path : `${path}/`;
}

function absoluteUrl(path: string) {
    return `${baseUrl}${withTrailingSlash(path)}`;
}

async function createSitemapEntries(
    items: Array<{
        path: string;
        searchParams: SearchParams;
    }>
) {
    const now = new Date().toISOString();

    const entries = await Promise.all(
        items.map(async (item) => {
            const count = await fetchListingsCount(item.searchParams);
            if (count === 0) {
                return null;
            }

            return {
                loc: absoluteUrl(item.path),
                lastmod: now,
                changefreq: 'daily',
                priority: '0.8',
            } satisfies SitemapItem;
        })
    );

    return entries.filter((entry): entry is SitemapItem => entry !== null);
}

export async function getAreaSitemapItems() {
    const items = [
        ...SEO_AREAS.map((area) => ({
            path: `/areas/${area.slug}`,
            searchParams: { tab: 'area', pref: area.prefecture },
        })),
        ...SEO_AREAS.flatMap((area) =>
            SEO_FEATURES.map((feature) => ({
                path: `/areas/${area.slug}/${feature.slug}`,
                searchParams: { tab: 'area', pref: area.prefecture, ...feature.searchParams },
            }))
        ),
    ];

    return createSitemapEntries(items);
}

export async function getCitySitemapItems() {
    const items = [
        ...SEO_CITIES.map((city) => ({
            path: `/cities/${city.slug}`,
            searchParams: { tab: 'area', pref: city.prefecture, city: city.name },
        })),
        ...SEO_CITIES.flatMap((city) =>
            SEO_FEATURES.map((feature) => ({
                path: `/cities/${city.slug}/${feature.slug}`,
                searchParams: { tab: 'area', pref: city.prefecture, city: city.name, ...feature.searchParams },
            }))
        ),
    ];

    return createSitemapEntries(items);
}

export async function getStationSitemapItems() {
    const items = [
        ...SEO_STATIONS.map((station) => ({
            path: `/stations/${station.slug}`,
            searchParams: { tab: 'station', station_pref: station.prefecture, station: station.name },
        })),
        ...SEO_STATIONS.flatMap((station) =>
            SEO_FEATURES.map((feature) => ({
                path: `/stations/${station.slug}/${feature.slug}`,
                searchParams: { tab: 'station', station_pref: station.prefecture, station: station.name, ...feature.searchParams },
            }))
        ),
    ];

    return createSitemapEntries(items);
}

export async function getFeatureSitemapItems() {
    const items = SEO_FEATURES.map((feature) => ({
        path: `/features/${feature.slug}`,
        searchParams: { ...feature.searchParams },
    }));

    return createSitemapEntries(items);
}

export async function getPropertySitemapItems() {
    const { listings } = await fetchListingsForSitemap();
    const now = new Date().toISOString();

    return listings.map((listing: PropertySitemapListing) => ({
        loc: absoluteUrl(listing.slug ? `/rooms/${listing.slug}-${listing.id}` : `/rooms/${listing.id}`),
        lastmod: listing.updated_at || now,
        changefreq: 'daily',
        priority: '0.7',
    }));
}

async function fetchListingsForSitemap() {
    const { data, error } = await supabase
        .from('listings')
        .select('id, slug, updated_at')
        .eq('is_public', true)
        .order('updated_at', { ascending: false })
        .limit(5000);

    if (error) {
        console.error('Error fetching listing sitemap entries:', error);
        return { listings: [] };
    }

    return { listings: data || [] };
}

export function buildXml(items: SitemapItem[]) {
    const body = items
        .map(
            (item) => `<url><loc>${item.loc}</loc><lastmod>${item.lastmod}</lastmod><changefreq>${item.changefreq}</changefreq><priority>${item.priority}</priority></url>`
        )
        .join('');

    return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}

export function getSitemapIndexUrls() {
    return [
        absoluteUrl('/sitemap.xml'),
        absoluteUrl('/sitemap-areas.xml'),
        absoluteUrl('/sitemap-cities.xml'),
        absoluteUrl('/sitemap-stations.xml'),
        absoluteUrl('/sitemap-features.xml'),
        absoluteUrl('/sitemap-properties.xml'),
    ];
}
