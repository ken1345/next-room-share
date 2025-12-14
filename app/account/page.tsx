"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdPerson, MdEmail, MdArrowForwardIos } from 'react-icons/md';
import { supabase } from '@/lib/supabase';

import PhotoPropertyCard from '@/components/PhotoPropertyCard';

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [myListings, setMyListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                // Fetch additional user data from public.users table (Postgres)
                try {
                    const { data: profile } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    if (profile) {
                        setUserData(profile);
                    } else {
                        // Create profile if missing logic (simplified for brevity or existing logic kept if preferred, but usually handled by triggers or signup)
                        // Keeping existing logic structure if needed, but assuming profile exists for now or handled elsewhere
                        const { data: newProfile, error: insertError } = await supabase
                            .from('users')
                            .insert({
                                id: session.user.id,
                                email: session.user.email,
                                display_name: session.user.user_metadata?.full_name || 'User',
                                photo_url: session.user.user_metadata?.avatar_url || null,
                            })
                            .select()
                            .single();
                        if (!insertError) setUserData(newProfile);
                    }

                    // Fetch Listings
                    const { data: listings, error: listingsError } = await supabase
                        .from('listings')
                        .select('*')
                        .eq('host_id', session.user.id)
                        .order('created_at', { ascending: false });

                    if (listings) {
                        setMyListings(listings);
                    }

                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            } else {
                router.push('/login');
            }
            setLoading(false);
        };

        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) router.push('/login');
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) return null;

    // Determine values to display (prefer Public Profile table, fallback to Auth metadata)
    const displayName = userData?.display_name || user.user_metadata?.full_name || user.user_metadata?.display_name || 'Guest User';
    const email = userData?.email || user.email;
    const photoURL = userData?.photo_url || user.user_metadata?.avatar_url || user.user_metadata?.picture;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <div className="bg-white border-b shadow-sm mb-6">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">アカウント</h1>
                    <Link href="/settings" className="text-sm font-bold text-gray-500 hover:text-gray-800 transition">
                        設定
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-2xl space-y-8">
                {/* Profile Section */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 shrink-0 overflow-hidden">
                        {photoURL ? (
                            <img src={photoURL} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                            <MdPerson size={40} />
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-1">{displayName}</h2>
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                            <MdEmail /> {email}
                        </div>
                        <div className="mt-4">
                            <Link href="/account/edit" className="inline-block text-sm font-bold text-[#bf0000] border border-[#bf0000] px-6 py-2 rounded-full hover:bg-[#bf0000] hover:text-white transition">
                                プロフィールを編集
                            </Link>
                        </div>
                    </div>
                </section>

                {/* My Listings Section */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">掲載中の物件</h3>
                    {myListings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {myListings.map((l) => (
                                <div key={l.id} className="h-[280px]">
                                    <PhotoPropertyCard
                                        id={l.id}
                                        imageUrl={l.images && l.images.length > 0 ? l.images[0] : undefined}
                                        image={(!l.images || l.images.length === 0) ? 'bg-gray-200' : undefined}
                                        price={(Number(l.price) / 10000).toFixed(1)}
                                        station={l.address ? l.address.split(' ')[0] : '駅指定なし'}
                                        badges={l.amenities ? l.amenities.slice(0, 2) : []}
                                        title={l.title}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8 text-center text-gray-500">
                            <p>掲載中の物件はありません。</p>
                            <Link href="/host" className="inline-block mt-4 text-[#bf0000] font-bold hover:underline">
                                物件を掲載する
                            </Link>
                        </div>
                    )}
                </section>

                {/* Messages Section */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">メッセージ</h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8 text-center text-gray-500">
                        <p>現在メッセージはありません。</p>
                        <p className="text-sm mt-2">物件に問い合わせるとここにメッセージが表示されます。</p>
                    </div>
                </section>

                <div className="pt-4 flex justify-center">
                    <button
                        onClick={handleSignOut}
                        className="text-gray-400 hover:text-gray-600 font-bold text-sm underline transition"
                    >
                        ログアウト
                    </button>
                </div>
            </div>
        </div>
    );
}
