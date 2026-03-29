import type { Metadata } from 'next';
import SeoLandingPage from '@/components/seo/SeoLandingPage';
import { SEO_FEATURES, SEO_STATIONS } from '@/lib/seo/config';
import { buildSeoMetadata, buildSeoPageData } from '@/lib/seo/page-data';

type PageProps = {
    params: Promise<{ stationSlug: string; featureSlug: string }>;
};

export function generateStaticParams() {
    return SEO_STATIONS.flatMap((station) =>
        SEO_FEATURES.map((feature) => ({
            stationSlug: station.slug,
            featureSlug: feature.slug,
        }))
    );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { stationSlug, featureSlug } = await params;
    return buildSeoMetadata('station', stationSlug, featureSlug);
}

export default async function StationFeatureSeoPage({ params }: PageProps) {
    const { stationSlug, featureSlug } = await params;
    const data = await buildSeoPageData('station', stationSlug, featureSlug);
    return <SeoLandingPage data={data} />;
}
