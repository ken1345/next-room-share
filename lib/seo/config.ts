import type { SearchParams } from '@/lib/fetch-listings-server';

export type SeoPageKind = 'area' | 'city' | 'station' | 'feature';

export type SeoFeatureConfig = {
    slug: string;
    label: string;
    shortLabel: string;
    searchParams: Partial<SearchParams>;
    searchHref: string;
    introFocus: string;
    faqTip: string;
};

export type SeoAreaConfig = {
    slug: string;
    name: string;
    prefecture: string;
    region: string;
    relatedCitySlugs: string[];
    relatedStationSlugs: string[];
};

export type SeoCityConfig = {
    slug: string;
    name: string;
    prefecture: string;
    areaSlug: string;
    relatedStationSlugs: string[];
};

export type SeoStationConfig = {
    slug: string;
    name: string;
    prefecture: string;
    areaSlug: string;
    relatedCitySlugs: string[];
};

export type BreadcrumbItem = {
    label: string;
    href: string;
};

export type SeoLinkCandidate = {
    label: string;
    href: string;
    searchParams: SearchParams;
};

export const SEO_FEATURES: SeoFeatureConfig[] = [
    {
        slug: 'female',
        label: '女性専用の',
        shortLabel: '女性専用',
        searchParams: { feature: 'female' },
        searchHref: '/search?feature=female',
        introFocus: 'セキュリティや生活動線を重視しながら、落ち着いて住まいを探したい方',
        faqTip: '女性専用物件では、共用部の管理体制や入居条件も確認しておくと安心です。',
    },
    {
        slug: 'pet-friendly',
        label: 'ペット相談可の',
        shortLabel: 'ペット可',
        searchParams: { feature: 'pet-friendly' },
        searchHref: '/search?feature=pet',
        introFocus: '大切なペットと一緒に暮らせる住まいを探したい方',
        faqTip: 'ペット可の募集でも、頭数や種類、共用部の利用ルールは物件ごとに異なります。',
    },
    {
        slug: 'foreigners-welcome',
        label: '外国人歓迎の',
        shortLabel: '外国人歓迎',
        searchParams: { feature: 'foreigners-welcome' },
        searchHref: '/search?feature=foreigner',
        introFocus: '国際交流しやすい環境や多様な入居者層を重視したい方',
        faqTip: '外国人歓迎の募集では、入居時の必要書類や言語サポートの有無も見ておきましょう。',
    },
    {
        slug: 'low-initial-cost',
        label: '初期費用を抑えやすい',
        shortLabel: '初期費用を抑えやすい',
        searchParams: { feature: 'low-initial-cost' },
        searchHref: '/search?feature=cheap',
        introFocus: '引っ越し費用をできるだけ抑えて、新生活を始めたい方',
        faqTip: '家賃が安くても、デポジットや共益費を含めた総額で比較するのがおすすめです。',
    },
    {
        slug: 'private-room',
        label: '個室ありの',
        shortLabel: '個室あり',
        searchParams: { feature: 'private-room' },
        searchHref: '/search?types=%E5%80%8B%E5%AE%A4',
        introFocus: 'プライバシーを確保しつつ、共用部も活用したい方',
        faqTip: '個室ありの募集では、鍵の有無や広さ、収納量まで見ておくと住みやすさが変わります。',
    },
    {
        slug: 'furnished',
        label: '家具家電付きの',
        shortLabel: '家具家電付き',
        searchParams: { feature: 'furnished' },
        searchHref: '/search?equipment=%E5%86%B7%E8%94%B5%E5%BA%AB,%E9%9B%BB%E5%AD%90%E3%83%AC%E3%83%B3%E3%82%B8,%E3%82%A8%E3%82%A2%E3%82%B3%E3%83%B3',
        introFocus: 'すぐに入居しやすい、生活の立ち上がりが早い住まいを探したい方',
        faqTip: '家具家電付きの募集は、利用できる設備の範囲や故障時の対応も確認しておくと安心です。',
    },
    {
        slug: 'work-from-home',
        label: '在宅ワーク向きの',
        shortLabel: '在宅ワーク向き',
        searchParams: { feature: 'work-from-home' },
        searchHref: '/search?feature=wifi',
        introFocus: '通信環境や部屋の使いやすさを重視して働ける住まいを探したい方',
        faqTip: '在宅ワーク向きの募集は、回線環境だけでなく生活音や共用部のルールもチェックしたいポイントです。',
    },
];

export const SEO_AREAS: SeoAreaConfig[] = [
    {
        slug: 'tokyo',
        name: '東京都',
        prefecture: '東京都',
        region: '関東',
        relatedCitySlugs: ['setagaya', 'shinjuku-city'],
        relatedStationSlugs: ['shinjuku', 'ikebukuro'],
    },
    {
        slug: 'saitama',
        name: '埼玉県',
        prefecture: '埼玉県',
        region: '関東',
        relatedCitySlugs: ['kawaguchi', 'omiya-city'],
        relatedStationSlugs: ['omiya', 'kawaguchi-station'],
    },
];

export const SEO_CITIES: SeoCityConfig[] = [
    {
        slug: 'kawaguchi',
        name: '川口市',
        prefecture: '埼玉県',
        areaSlug: 'saitama',
        relatedStationSlugs: ['kawaguchi-station', 'omiya'],
    },
    {
        slug: 'setagaya',
        name: '世田谷区',
        prefecture: '東京都',
        areaSlug: 'tokyo',
        relatedStationSlugs: ['shinjuku', 'ikebukuro'],
    },
    {
        slug: 'shinjuku-city',
        name: '新宿区',
        prefecture: '東京都',
        areaSlug: 'tokyo',
        relatedStationSlugs: ['shinjuku', 'ikebukuro'],
    },
    {
        slug: 'omiya-city',
        name: 'さいたま市大宮区',
        prefecture: '埼玉県',
        areaSlug: 'saitama',
        relatedStationSlugs: ['omiya', 'kawaguchi-station'],
    },
];

export const SEO_STATIONS: SeoStationConfig[] = [
    {
        slug: 'shinjuku',
        name: '新宿',
        prefecture: '東京都',
        areaSlug: 'tokyo',
        relatedCitySlugs: ['shinjuku-city', 'setagaya'],
    },
    {
        slug: 'ikebukuro',
        name: '池袋',
        prefecture: '東京都',
        areaSlug: 'tokyo',
        relatedCitySlugs: ['shinjuku-city', 'setagaya'],
    },
    {
        slug: 'omiya',
        name: '大宮',
        prefecture: '埼玉県',
        areaSlug: 'saitama',
        relatedCitySlugs: ['omiya-city', 'kawaguchi'],
    },
    {
        slug: 'kawaguchi-station',
        name: '川口',
        prefecture: '埼玉県',
        areaSlug: 'saitama',
        relatedCitySlugs: ['kawaguchi', 'omiya-city'],
    },
];

export const DEFAULT_FEATURE_LINKS = ['female', 'private-room', 'pet-friendly', 'work-from-home'];

export function getSeoFeature(slug: string) {
    return SEO_FEATURES.find((item) => item.slug === slug);
}

export function getSeoArea(slug: string) {
    return SEO_AREAS.find((item) => item.slug === slug);
}

export function getSeoCity(slug: string) {
    return SEO_CITIES.find((item) => item.slug === slug);
}

export function getSeoStation(slug: string) {
    return SEO_STATIONS.find((item) => item.slug === slug);
}
