import type { Metadata } from 'next';
import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';
import { supabase } from '@/lib/supabase';
import RoomDetailClient from '@/components/rooms/RoomDetailClient';

type PageProps = {
    params: Promise<{ id: string }>;
};

async function getListing(id: string) {
    const { data: listing, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !listing) return null;
    return listing;
}

async function getHost(hostId: string) {
    const { data: host, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', hostId)
        .single();

    if (error || !host) return null;
    return host;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const listing = await getListing(id);

    if (!listing) {
        return {
            title: '物件が見つかりません | NextRoomShare',
        };
    }

    return {
        title: `${listing.title} | NextRoomShare`,
        description: listing.description ? listing.description.substring(0, 120) : `${listing.address}のシェアハウス情報。`,
        openGraph: {
            title: listing.title,
            description: listing.description ? listing.description.substring(0, 120) : undefined,
            images: listing.images && listing.images.length > 0 ? [listing.images[0]] : [],
        },
    };
}

export default async function RoomPage({ params }: PageProps) {
    const { id } = await params;
    const listing = await getListing(id);

    if (!listing) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">物件が見つかりませんでした</h1>
                <Link href="/search" className="text-[#bf0000] font-bold hover:underline flex items-center gap-1">
                    <MdArrowBack /> 検索に戻る
                </Link>
            </div>
        );
    }

    const host = listing.host_id ? await getHost(listing.host_id) : null;

    return <RoomDetailClient property={listing} host={host} />;
}
