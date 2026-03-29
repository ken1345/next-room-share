import type { MetadataRoute } from 'next';
import { getSitemapIndexUrls } from '@/lib/seo/sitemap';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/account/', '/admin/', '/api/'],
        },
        sitemap: getSitemapIndexUrls(),
    };
}
