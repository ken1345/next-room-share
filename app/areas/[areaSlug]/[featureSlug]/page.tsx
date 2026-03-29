import type { Metadata } from 'next';
import SeoLandingPage from '@/components/seo/SeoLandingPage';
import { SEO_AREAS, SEO_FEATURES } from '@/lib/seo/config';
import { buildSeoMetadata, buildSeoPageData } from '@/lib/seo/page-data';

type PageProps = {
    params: Promise<{ areaSlug: string; featureSlug: string }>;
};

export function generateStaticParams() {
    return SEO_AREAS.flatMap((area) =>
        SEO_FEATURES.map((feature) => ({
            areaSlug: area.slug,
            featureSlug: feature.slug,
        }))
    );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { areaSlug, featureSlug } = await params;
    return buildSeoMetadata('area', areaSlug, featureSlug);
}

export default async function AreaFeatureSeoPage({ params }: PageProps) {
    const { areaSlug, featureSlug } = await params;
    const data = await buildSeoPageData('area', areaSlug, featureSlug);
    return <SeoLandingPage data={data} />;
}
