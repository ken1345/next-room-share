import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { supabase } from "@/lib/supabase";
import PhotoPropertyCard from "@/components/PhotoPropertyCard";
import SectionTitle from "@/components/SectionTitle";

export default async function ListingGalleryServer() {
    noStore();
    const { data: listings, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(8);

    if (error) {
        console.error("Error fetching listings:", error);
        // Continue with empty list or show error? Empty list is safer for Partial Rendering.
    }

    const items = listings || [];

    return (
        <section className="bg-gray-50 py-12 border-t">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-6">
                    <SectionTitle title="新着のルームシェア" subtitle="本日公開！写真で選ぶ最新物件" />
                    <Link href="/search">
                        <button className="text-[#bf0000] font-bold border border-[#bf0000] bg-white px-4 py-1 rounded-full hover:bg-[#bf0000] hover:text-white transition text-sm">
                            もっと見る
                        </button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.length === 0 ? (
                        <div className="col-span-4 text-center py-10 text-gray-400">
                            まだ投稿された物件はありません。
                        </div>
                    ) : (
                        items.map((l) => (
                            <PhotoPropertyCard
                                key={l.id}
                                id={l.id}
                                // Use stored image URL or mock fallback
                                imageUrl={l.images && l.images.length > 0 ? l.images[0] : undefined}
                                image={(!l.images || l.images.length === 0) ? 'bg-gray-200' : undefined}
                                price={l.price}
                                station={l.address ? l.address.split(' ')[0] : '駅指定なし'} // Simple fallback
                                badges={l.amenities ? l.amenities.slice(0, 2) : []}
                                title={l.title}
                                viewCount={l.view_count || 0}
                                favoritesCount={l.favorites_count || 0}
                                inquiryCount={l.inquiry_count || 0}
                                prefecture={l.prefecture}
                                city={l.city}
                                slug={l.slug}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
