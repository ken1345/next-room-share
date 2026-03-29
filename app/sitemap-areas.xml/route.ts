import { buildXml, getAreaSitemapItems } from '@/lib/seo/sitemap';

export async function GET() {
    const xml = buildXml(await getAreaSitemapItems());
    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
