import Link from 'next/link';
import PhotoPropertyCard from '@/components/PhotoPropertyCard';
import type { SeoPageData } from '@/lib/seo/page-data';

type SeoLandingPageProps = {
    data: SeoPageData;
};

export default function SeoLandingPage({ data }: SeoLandingPageProps) {
    return (
        <div className="bg-[#fcfbf7]">
            <section className="border-b border-stone-200 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-6">
                    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-stone-500">
                        <ol className="flex flex-wrap items-center gap-2">
                            {data.breadcrumbs.map((item, index) => (
                                <li key={item.href} className="flex items-center gap-2">
                                    {index > 0 && <span>/</span>}
                                    <Link href={item.href} className="hover:text-[#bf0000] hover:underline">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ol>
                    </nav>

                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-stone-900 md:text-4xl">{data.h1}</h1>
                            <div className="mt-4 space-y-3 text-base leading-7 text-stone-700">
                                {data.intro.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                        </div>

                        <aside className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                            <p className="text-sm font-semibold text-stone-500">掲載件数</p>
                            <p className="mt-2 text-3xl font-bold text-stone-900">{data.totalCount}件</p>
                            <p className="mt-3 text-sm leading-6 text-stone-600">
                                固定ページで概要を見たあと、検索ページで家賃や設備を追加して絞り込めます。
                            </p>
                            <Link
                                href={data.searchHref}
                                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#bf0000] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#970000]"
                            >
                                検索UIでさらに絞り込む
                            </Link>
                        </aside>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-10">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-stone-900">物件一覧</h2>
                        <p className="mt-2 text-sm text-stone-600">
                            固定URLのテーマに沿った募集を新着順で表示しています。
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {data.listings.map((listing) => (
                        <PhotoPropertyCard
                            key={listing.id}
                            horizontal
                            id={listing.id}
                            title={listing.title}
                            description={listing.description ?? undefined}
                            price={listing.price}
                            equipment={listing.equipment || []}
                            personalEquipment={listing.personal_equipment || []}
                            station={
                                listing.station_name
                                    ? `${listing.station_name} ${listing.minutes_to_station ?? ''}分`
                                    : (listing.address ?? '')
                            }
                            badges={[
                                listing.room_type === 'private'
                                    ? '個室'
                                    : listing.room_type === 'semi'
                                        ? '半個室'
                                        : 'ドミトリー',
                                ...(listing.amenities || []),
                            ]}
                            imageUrl={listing.images?.[0]}
                            image={!listing.images?.length ? 'bg-gray-200' : undefined}
                            viewCount={listing.view_count || 0}
                            favoritesCount={listing.favorites_count || 0}
                            inquiryCount={listing.inquiry_count || 0}
                            prefecture={listing.prefecture ?? undefined}
                            city={listing.city ?? undefined}
                            slug={listing.slug ?? undefined}
                            createdAt={listing.created_at ?? undefined}
                        />
                    ))}
                </div>
            </section>

            {data.relatedSections.length > 0 && (
                <section className="border-y border-stone-200 bg-white">
                    <div className="mx-auto max-w-6xl px-4 py-10">
                        <h2 className="text-2xl font-bold text-stone-900">関連ページ</h2>
                        <div className="mt-6 grid gap-6 md:grid-cols-2">
                            {data.relatedSections.map((section) => (
                                <div key={section.title} className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
                                    <h3 className="text-lg font-semibold text-stone-900">{section.title}</h3>
                                    <div className="mt-4 flex flex-wrap gap-3">
                                        {section.links.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-[#bf0000] hover:text-[#bf0000]"
                                            >
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="mx-auto max-w-6xl px-4 py-10">
                <h2 className="text-2xl font-bold text-stone-900">よくある質問</h2>
                <div className="mt-6 space-y-4">
                    {data.faqItems.map((item) => (
                        <details key={item.question} className="rounded-2xl border border-stone-200 bg-white p-5">
                            <summary className="cursor-pointer list-none text-base font-semibold text-stone-900">
                                {item.question}
                            </summary>
                            <p className="mt-3 text-sm leading-7 text-stone-700">{item.answer}</p>
                        </details>
                    ))}
                </div>
            </section>
        </div>
    );
}
