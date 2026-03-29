import type { Metadata } from 'next';
import SeoLandingPage from '@/components/seo/SeoLandingPage';
import { SEO_AREAS } from '@/lib/seo/config';
import { buildSeoMetadata, buildSeoPageData } from '@/lib/seo/page-data';

type PageProps = {
    params: Promise<{ areaSlug: string }>;
};

export function generateStaticParams() {
    return SEO_AREAS.map((area) => ({ areaSlug: area.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { areaSlug } = await params;
    return buildSeoMetadata('area', areaSlug);
}

export default async function AreaSeoPage({ params }: PageProps) {
    const { areaSlug } = await params;
    const data = await buildSeoPageData('area', areaSlug);
    return <SeoLandingPage data={data} />;
}
