import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchListingsCount, fetchListingsServer, type ListingRecord, type SearchParams } from '@/lib/fetch-listings-server';
import {
    DEFAULT_FEATURE_LINKS,
    SEO_AREAS,
    SEO_CITIES,
    SEO_FEATURES,
    getSeoArea,
    getSeoCity,
    getSeoFeature,
    getSeoStation,
    type BreadcrumbItem,
    type SeoLinkCandidate,
    type SeoPageKind,
} from '@/lib/seo/config';

type BaseEntity =
    | { kind: 'area'; slug: string; name: string; areaSlug: string; searchParams: SearchParams }
    | { kind: 'city'; slug: string; name: string; areaSlug: string; searchParams: SearchParams }
    | { kind: 'station'; slug: string; name: string; areaSlug: string; searchParams: SearchParams }
    | { kind: 'feature'; slug: string; name: string; areaSlug: null; searchParams: SearchParams };

export type SeoFaqItem = {
    question: string;
    answer: string;
};

export type SeoVisibleLink = {
    label: string;
    href: string;
};

export type SeoPageData = {
    kind: SeoPageKind;
    pagePath: string;
    canonicalPath: string;
    title: string;
    description: string;
    h1: string;
    intro: string[];
    breadcrumbs: BreadcrumbItem[];
    faqItems: SeoFaqItem[];
    listings: SeoListing[];
    totalCount: number;
    searchParams: SearchParams;
    searchHref: string;
    robots: Metadata['robots'];
    relatedSections: Array<{ title: string; links: SeoVisibleLink[] }>;
};

export type SeoListing = ListingRecord;

function withTrailingSlash(path: string) {
    return path.endsWith('/') ? path : `${path}/`;
}

function toSearchHref(searchParams: SearchParams) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
        if (value) {
            params.set(key, value);
        }
    });

    const query = params.toString();
    return query ? `/search?${query}` : '/search';
}

function mergeSearchParams(base: SearchParams, extra?: Partial<SearchParams>) {
    return Object.fromEntries(
        Object.entries({ ...base, ...extra }).filter(([, value]) => value !== undefined && value !== null && value !== '')
    ) as SearchParams;
}

function buildPagePath(kind: SeoPageKind, slug: string, featureSlug?: string) {
    if (kind === 'feature') {
        return withTrailingSlash(`/features/${slug}`);
    }

    const basePath = `/${kind}s/${slug}`;
    return withTrailingSlash(featureSlug ? `${basePath}/${featureSlug}` : basePath);
}

function getBaseEntity(kind: SeoPageKind, slug: string): BaseEntity | null {
    if (kind === 'area') {
        const area = getSeoArea(slug);
        if (!area) return null;
        return {
            kind,
            slug: area.slug,
            name: area.name,
            areaSlug: area.slug,
            searchParams: { tab: 'area', pref: area.prefecture },
        };
    }

    if (kind === 'city') {
        const city = getSeoCity(slug);
        if (!city) return null;
        return {
            kind,
            slug: city.slug,
            name: city.name,
            areaSlug: city.areaSlug,
            searchParams: { tab: 'area', pref: city.prefecture, city: city.name },
        };
    }

    if (kind === 'station') {
        const station = getSeoStation(slug);
        if (!station) return null;
        return {
            kind,
            slug: station.slug,
            name: station.name,
            areaSlug: station.areaSlug,
            searchParams: { tab: 'station', station_pref: station.prefecture, station: station.name },
        };
    }

    if (kind === 'feature') {
        const feature = getSeoFeature(slug);
        if (!feature) return null;
        return {
            kind,
            slug: feature.slug,
            name: feature.shortLabel,
            areaSlug: null,
            searchParams: { ...feature.searchParams },
        };
    }

    return null;
}

function buildHeading(entity: BaseEntity, featureSlug?: string) {
    const feature = featureSlug ? getSeoFeature(featureSlug) : null;

    if (entity.kind === 'station') {
        return feature
            ? `${entity.name}駅周辺の${feature.shortLabel}ルームシェア募集一覧`
            : `${entity.name}駅周辺のルームシェア募集一覧`;
    }

    return feature
        ? `${entity.name}の${feature.shortLabel}ルームシェア募集一覧`
        : `${entity.name}のルームシェア募集一覧`;
}

function buildDescription(entity: BaseEntity, featureSlug?: string) {
    const feature = featureSlug ? getSeoFeature(featureSlug) : null;

    if (entity.kind === 'station') {
        return feature
            ? `${entity.name}駅周辺で${feature.shortLabel}のルームシェア募集を掲載。通勤・通学のしやすさや暮らしやすさを見比べながら、お部屋を探せます。`
            : `${entity.name}駅周辺のルームシェア募集を掲載。通勤・通学しやすい立地や、暮らし方に合う住まいをまとめて探せます。`;
    }

    if (entity.kind === 'feature') {
        return `${entity.name}のルームシェア募集を掲載。東京・埼玉を中心に、こだわり条件に合う住まいを比較しながら探せます。`;
    }

    return feature
        ? `${entity.name}で${feature.shortLabel}のルームシェア募集を掲載。エリアの住みやすさと条件の両方を見比べながら、お部屋を探せます。`
        : `${entity.name}のルームシェア募集を掲載。個室ありや初期費用を抑えやすい物件など、条件に合う住まいを探せます。`;
}

function buildIntro(entity: BaseEntity, featureSlug?: string) {
    const feature = featureSlug ? getSeoFeature(featureSlug) : null;

    if (entity.kind === 'feature' && feature) {
        return [
            `${feature.shortLabel}の住まいを探すときは、家賃だけでなく共用部の使いやすさや入居条件の確認も大切です。`,
            `RoomMikkeでは、東京・埼玉を中心に${feature.shortLabel}のルームシェア募集を比較できます。`,
            `${feature.introFocus}に向いた物件を見つけやすいよう、関連エリアページや駅ページもあわせて用意しています。`,
        ];
    }

    if (entity.kind === 'station') {
        const area = entity.areaSlug ? getSeoArea(entity.areaSlug) : null;

        if (feature) {
            return [
                `${entity.name}駅周辺で${feature.shortLabel}のルームシェアを探したい方向けの固定ページです。`,
                `${area?.name ?? entity.name}内でもアクセスと生活利便性を両立しやすいエリアなので、通勤通学を重視した住まい探しに向いています。`,
                `${feature.introFocus}に合う募集を一覧で確認しながら、近い市区町村や関連条件にも広げて比較できます。`,
            ];
        }

        return [
            `${entity.name}駅周辺でルームシェアを探したい方向けの固定ページです。`,
            `${area?.name ?? entity.name}の中でもアクセスを重視しやすいエリアのため、通勤通学や休日の移動負担を抑えやすい住まいを比べやすくなります。`,
            `関連する条件ページや近い市区町村ページもあわせて見ることで、自分に合う候補を絞り込みやすくなります。`,
        ];
    }

    if (feature) {
        return [
            `${entity.name}で${feature.shortLabel}のルームシェアを探したい方向けの固定ページです。`,
            `${entity.name}は家賃帯や駅距離、共用設備の違いを見比べやすく、暮らし方に合う住まいを検討しやすいエリアです。`,
            `${feature.introFocus}に向いた募集を一覧で確認しつつ、関連する市区町村や駅ページにも移動できます。`,
        ];
    }

    return [
        `${entity.name}でルームシェアを探したい方向けの固定ページです。`,
        `${entity.name}は生活利便性やアクセス、住環境のバランスを見ながら住まいを選びやすく、はじめてのルームシェア探しにも向いています。`,
        `条件ページや周辺エリアの固定ページもあわせて使うことで、希望に近い募集を比較しやすくなります。`,
    ];
}

function buildFaq(entity: BaseEntity, featureSlug?: string): SeoFaqItem[] {
    const feature = featureSlug ? getSeoFeature(featureSlug) : null;
    const locationLabel = entity.kind === 'station' ? `${entity.name}駅周辺` : entity.name;

    if (!feature) {
        return [
            {
                question: `${locationLabel}でルームシェアを探すメリットは？`,
                answer: `${locationLabel}の家賃帯やアクセス、周辺環境を比較しながら候補を絞れる点がメリットです。通勤通学や生活動線に合わせて選びやすくなります。`,
            },
            {
                question: '見学前に確認しておきたいポイントは？',
                answer: '家賃や初期費用だけでなく、共用部の使い方、清掃ルール、入居者属性、最寄り駅までの動線も確認しておくとミスマッチを減らせます。',
            },
            {
                question: '条件を変えながら比較したいときは？',
                answer: '固定ページで方向性を決めたあと、検索ページで家賃帯や駅距離、設備条件を追加すると候補を絞り込みやすくなります。',
            },
        ];
    }

    return [
        {
            question: `${locationLabel}で${feature.shortLabel}の物件を探すときのポイントは？`,
            answer: `${feature.shortLabel}の条件に加えて、家賃、駅距離、共用設備、入居ルールまで一緒に比較するのがおすすめです。`,
        },
        {
            question: `${feature.shortLabel}の物件はどんな人に向いていますか？`,
            answer: feature.introFocus,
        },
        {
            question: '固定ページと検索ページの使い分けは？',
            answer: '固定ページではエリアや条件ごとの全体像をつかみ、検索ページでは家賃帯や設備などを追加して細かく絞り込む使い方が相性良好です。',
        },
        {
            question: `${feature.shortLabel}で比較するときの注意点は？`,
            answer: feature.faqTip,
        },
    ];
}

function buildBreadcrumbs(kind: SeoPageKind, entity: BaseEntity, featureSlug?: string): BreadcrumbItem[] {
    const items: BreadcrumbItem[] = [{ label: 'ホーム', href: '/' }];

    if (kind === 'area') {
        items.push({ label: 'エリア', href: '/areas/tokyo/' });
        items.push({ label: entity.name, href: buildPagePath('area', entity.slug) });
    }

    if (kind === 'city') {
        const area = entity.areaSlug ? getSeoArea(entity.areaSlug) : null;
        items.push({ label: 'エリア', href: '/areas/tokyo/' });
        if (area) {
            items.push({ label: area.name, href: buildPagePath('area', area.slug) });
        }
        items.push({ label: entity.name, href: buildPagePath('city', entity.slug) });
    }

    if (kind === 'station') {
        const area = entity.areaSlug ? getSeoArea(entity.areaSlug) : null;
        items.push({ label: '駅', href: '/stations/shinjuku/' });
        if (area) {
            items.push({ label: area.name, href: buildPagePath('area', area.slug) });
        }
        items.push({ label: `${entity.name}駅`, href: buildPagePath('station', entity.slug) });
    }

    if (kind === 'feature') {
        items.push({ label: '条件', href: '/features/female/' });
        items.push({ label: entity.name, href: buildPagePath('feature', entity.slug) });
    }

    if (featureSlug && kind !== 'feature') {
        const feature = getSeoFeature(featureSlug);
        if (feature) {
            items.push({ label: feature.shortLabel, href: buildPagePath(kind, entity.slug, feature.slug) });
        }
    }

    return items;
}

async function filterVisibleLinks(candidates: SeoLinkCandidate[]) {
    const uniqueCandidates = candidates.filter(
        (candidate, index, self) => self.findIndex((item) => item.href === candidate.href) === index
    );

    const counts = await Promise.all(
        uniqueCandidates.map(async (candidate) => ({
            href: candidate.href,
            label: candidate.label,
            count: await fetchListingsCount(candidate.searchParams),
        }))
    );

    return counts
        .filter((item) => item.count > 0)
        .map((item) => ({ href: item.href, label: item.label }));
}

async function buildRelatedSections(entity: BaseEntity, featureSlug?: string) {
    const feature = featureSlug ? getSeoFeature(featureSlug) : null;
    const area = entity.areaSlug ? getSeoArea(entity.areaSlug) : null;

    const parentCandidates: SeoLinkCandidate[] = [];
    const siblingCandidates: SeoLinkCandidate[] = [];
    const placeCandidates: SeoLinkCandidate[] = [];
    const featureCandidates: SeoLinkCandidate[] = [];

    if (entity.kind === 'city' || entity.kind === 'station') {
        if (area) {
            parentCandidates.push({
                label: `${area.name}のページへ`,
                href: buildPagePath('area', area.slug),
                searchParams: { tab: 'area', pref: area.prefecture },
            });
        }
    }

    if (entity.kind !== 'feature' && feature) {
        parentCandidates.push({
            label: feature.shortLabel,
            href: buildPagePath('feature', feature.slug),
            searchParams: { ...feature.searchParams },
        });
    }

    if (entity.kind === 'area' && !feature) {
        DEFAULT_FEATURE_LINKS.forEach((slug) => {
            const item = getSeoFeature(slug);
            if (!item) return;
            siblingCandidates.push({
                label: `${entity.name}×${item.shortLabel}`,
                href: buildPagePath('area', entity.slug, item.slug),
                searchParams: mergeSearchParams(entity.searchParams, item.searchParams),
            });
        });
    }

    if ((entity.kind === 'city' || entity.kind === 'station') && !feature) {
        DEFAULT_FEATURE_LINKS.slice(0, 3).forEach((slug) => {
            const item = getSeoFeature(slug);
            if (!item) return;
            siblingCandidates.push({
                label: `${entity.name}×${item.shortLabel}`,
                href: buildPagePath(entity.kind, entity.slug, item.slug),
                searchParams: mergeSearchParams(entity.searchParams, item.searchParams),
            });
        });
    }

    if (entity.kind === 'feature') {
        SEO_AREAS.forEach((seoArea) => {
            featureCandidates.push({
                label: `${seoArea.name}の${entity.name}`,
                href: buildPagePath('area', seoArea.slug, entity.slug),
                searchParams: mergeSearchParams({ tab: 'area', pref: seoArea.prefecture }, entity.searchParams),
            });
        });
    } else {
        SEO_FEATURES.filter((item) => item.slug !== featureSlug)
            .slice(0, 4)
            .forEach((item) => {
                featureCandidates.push({
                    label: item.shortLabel,
                    href: buildPagePath('feature', item.slug),
                    searchParams: { ...item.searchParams },
                });
            });
    }

    if (entity.kind === 'area') {
        const areaConfig = getSeoArea(entity.slug);
        areaConfig?.relatedCitySlugs.forEach((slug) => {
            const city = getSeoCity(slug);
            if (!city) return;
            placeCandidates.push({
                label: city.name,
                href: buildPagePath('city', city.slug),
                searchParams: { tab: 'area', pref: city.prefecture, city: city.name },
            });
        });
        areaConfig?.relatedStationSlugs.forEach((slug) => {
            const station = getSeoStation(slug);
            if (!station) return;
            placeCandidates.push({
                label: `${station.name}駅`,
                href: buildPagePath('station', station.slug),
                searchParams: { tab: 'station', station_pref: station.prefecture, station: station.name },
            });
        });
    }

    if (entity.kind === 'city') {
        const cityConfig = getSeoCity(entity.slug);
        cityConfig?.relatedStationSlugs.forEach((slug) => {
            const station = getSeoStation(slug);
            if (!station) return;
            placeCandidates.push({
                label: `${station.name}駅`,
                href: buildPagePath('station', station.slug),
                searchParams: { tab: 'station', station_pref: station.prefecture, station: station.name },
            });
        });
    }

    if (entity.kind === 'station') {
        const stationConfig = getSeoStation(entity.slug);
        stationConfig?.relatedCitySlugs.forEach((slug) => {
            const city = getSeoCity(slug);
            if (!city) return;
            placeCandidates.push({
                label: city.name,
                href: buildPagePath('city', city.slug),
                searchParams: { tab: 'area', pref: city.prefecture, city: city.name },
            });
        });
    }

    if (entity.kind === 'feature') {
        SEO_CITIES.slice(0, 4).forEach((city) => {
            placeCandidates.push({
                label: city.name,
                href: buildPagePath('city', city.slug, entity.slug),
                searchParams: mergeSearchParams({ tab: 'area', pref: city.prefecture, city: city.name }, entity.searchParams),
            });
        });
    }

    const [parents, siblings, features, places] = await Promise.all([
        filterVisibleLinks(parentCandidates),
        filterVisibleLinks(siblingCandidates),
        filterVisibleLinks(featureCandidates),
        filterVisibleLinks(placeCandidates),
    ]);

    return [
        { title: '上位ページ', links: parents },
        { title: '関連条件', links: siblings.length > 0 ? siblings : features },
        { title: '関連地域・駅', links: places },
        { title: '条件から探す', links: features },
    ].filter((section) => section.links.length > 0);
}

export async function buildSeoPageData(kind: SeoPageKind, slug: string, featureSlug?: string): Promise<SeoPageData> {
    const entity = getBaseEntity(kind, slug);
    if (!entity) {
        notFound();
    }

    const feature = featureSlug ? getSeoFeature(featureSlug) : null;
    if (featureSlug && !feature) {
        notFound();
    }

    const searchParams = mergeSearchParams(entity.searchParams, feature?.searchParams);
    const totalCount = await fetchListingsCount(searchParams);

    if (totalCount === 0) {
        notFound();
    }

    const { listings } = await fetchListingsServer(searchParams, { page: 1, itemsPerPage: 20 });
    const canonicalPath = buildPagePath(kind, slug, featureSlug);

    return {
        kind,
        pagePath: canonicalPath,
        canonicalPath,
        title: `${buildHeading(entity, featureSlug)} | RoomMikke`,
        description: buildDescription(entity, featureSlug),
        h1: buildHeading(entity, featureSlug),
        intro: buildIntro(entity, featureSlug),
        breadcrumbs: buildBreadcrumbs(kind, entity, featureSlug),
        faqItems: buildFaq(entity, featureSlug),
        listings,
        totalCount,
        searchParams,
        searchHref: feature?.searchHref ?? toSearchHref(searchParams),
        robots: { index: true, follow: true },
        relatedSections: await buildRelatedSections(entity, featureSlug),
    };
}

export async function buildSeoMetadata(kind: SeoPageKind, slug: string, featureSlug?: string): Promise<Metadata> {
    const data = await buildSeoPageData(kind, slug, featureSlug);

    return {
        title: data.title,
        description: data.description,
        alternates: {
            canonical: data.canonicalPath,
        },
        robots: data.robots,
        openGraph: {
            title: data.title,
            description: data.description,
            url: data.canonicalPath,
            type: 'website',
        },
    };
}
