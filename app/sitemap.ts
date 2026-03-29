import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://roommikke.jp';
    const now = new Date();

    return [
        {
            url: `${baseUrl}/`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/company`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/stories`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];
}
