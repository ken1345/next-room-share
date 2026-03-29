import type { Metadata } from 'next';
import SeoLandingPage from '@/components/seo/SeoLandingPage';
import { SEO_CITIES, SEO_FEATURES } from '@/lib/seo/config';
import { buildSeoMetadata, buildSeoPageData } from '@/lib/seo/page-data';

type PageProps = {
    params: Promise<{ citySlug: string; featureSlug: string }>;
};

export function generateStaticParams() {
    return SEO_CITIES.flatMap((city) =>
        SEO_FEATURES.map((feature) => ({
            citySlug: city.slug,
            featureSlug: feature.slug,
        }))
    );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { citySlug, featureSlug } = await params;
    return buildSeoMetadata('city', citySlug, featureSlug);
}

export default async function CityFeatureSeoPage({ params }: PageProps) {
    const { citySlug, featureSlug } = await params;
    const data = await buildSeoPageData('city', citySlug, featureSlug);
    return <SeoLandingPage data={data} />;
}
