import { buildXml, getPropertySitemapItems } from '@/lib/seo/sitemap';

export async function GET() {
    const xml = buildXml(await getPropertySitemapItems());
    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
        },
    });
}
