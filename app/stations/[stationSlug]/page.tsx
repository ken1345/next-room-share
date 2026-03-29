import type { Metadata } from 'next';
import SeoLandingPage from '@/components/seo/SeoLandingPage';
import { SEO_STATIONS } from '@/lib/seo/config';
import { buildSeoMetadata, buildSeoPageData } from '@/lib/seo/page-data';

type PageProps = {
    params: Promise<{ stationSlug: string }>;
};

export function generateStaticParams() {
    return SEO_STATIONS.map((station) => ({ stationSlug: station.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { stationSlug } = await params;
    return buildSeoMetadata('station', stationSlug);
}

export default async function StationSeoPage({ params }: PageProps) {
    const { stationSlug } = await params;
    const data = await buildSeoPageData('station', stationSlug);
    return <SeoLandingPage data={data} />;
}
