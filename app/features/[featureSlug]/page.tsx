import type { Metadata } from 'next';
import SeoLandingPage from '@/components/seo/SeoLandingPage';
import { SEO_FEATURES } from '@/lib/seo/config';
import { buildSeoMetadata, buildSeoPageData } from '@/lib/seo/page-data';

type PageProps = {
    params: Promise<{ featureSlug: string }>;
};

export function generateStaticParams() {
    return SEO_FEATURES.map((feature) => ({ featureSlug: feature.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { featureSlug } = await params;
    return buildSeoMetadata('feature', featureSlug);
}

export default async function FeatureSeoPage({ params }: PageProps) {
    const { featureSlug } = await params;
    const data = await buildSeoPageData('feature', featureSlug);
    return <SeoLandingPage data={data} />;
}
