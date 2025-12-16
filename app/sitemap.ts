import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://next-room-share.vercel.app';

    // 1. Static Routes
    const routes = [
        '',
        '/search',
        '/host',
        '/company',
        '/terms',
        '/privacy',
        '/commercial',
        '/faq',
        '/contact',
        '/guide/host',
        '/simulator',
        '/checklist',
        '/timeline',
        '/diagnosis',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // 2. Dynamic Listings
    const { data: listings } = await supabase
        .from('listings')
        .select('id, created_at')
        .eq('is_public', true);

    const listingRoutes = (listings || []).map((listing) => ({
        url: `${baseUrl}/rooms/${listing.id}`,
        lastModified: new Date(listing.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // 3. Dynamic Before/After Posts
    const { data: posts } = await supabase
        .from('before_after_posts')
        .select('id, created_at');

    const postRoutes = (posts || []).map((post) => ({
        url: `${baseUrl}/before-after/${post.id}`,
        lastModified: new Date(post.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...routes, ...listingRoutes, ...postRoutes];
}
