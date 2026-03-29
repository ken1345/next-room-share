import type { Metadata } from 'next';
import SeoLandingPage from '@/components/seo/SeoLandingPage';
import { SEO_CITIES } from '@/lib/seo/config';
import { buildSeoMetadata, buildSeoPageData } from '@/lib/seo/page-data';

type PageProps = {
    params: Promise<{ citySlug: string }>;
};

export function generateStaticParams() {
    return SEO_CITIES.map((city) => ({ citySlug: city.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { citySlug } = await params;
    return buildSeoMetadata('city', citySlug);
}

export default async function CitySeoPage({ params }: PageProps) {
    const { citySlug } = await params;
    const data = await buildSeoPageData('city', citySlug);
    return <SeoLandingPage data={data} />;
}
