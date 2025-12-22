"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdPerson, MdEmail, MdArrowForwardIos, MdEdit, MdPause, MdPlayArrow } from 'react-icons/md';
import { supabase } from '@/lib/supabase';

import PhotoPropertyCard from '@/components/PhotoPropertyCard';

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [userData, setUserData] = useState<any>(null);
    const [myListings, setMyListings] = useState<any[]>([]);
    const [myRequests, setMyRequests] = useState<any[]>([]);
    const [myGiveaways, setMyGiveaways] = useState<any[]>([]);
    const [favorites, setFavorites] = useState<any[]>([]);
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

                    // Fetch My Listings with Thread Count
                    const { data: listingsData, error: listingsError } = await supabase
                        .from('listings')
                        .select('*')
                        .eq('host_id', session.user.id)
                        .order('created_at', { ascending: false });

                    if (listingsData) {
                        setMyListings(listingsData);
                    }

                    // Fetch My Requests
                    const { data: requestsData } = await supabase
                        .from('room_requests')
                        .select('*')
                        .eq('user_id', session.user.id)
                        .order('created_at', { ascending: false });
                    if (requestsData) setMyRequests(requestsData);

                    // Fetch My Giveaways
                    const { data: giveawaysData } = await supabase
                        .from('giveaways')
                        .select('*')
                        .eq('user_id', session.user.id)
                        .order('created_at', { ascending: false });
                    if (giveawaysData) setMyGiveaways(giveawaysData);



                    // Fetch Favorites
                    const { data: favoritesData } = await supabase
                        .from('favorites')
                        .select(`
                            id,
                            listing:listings(*)
                        `)
                        .eq('user_id', session.user.id)
                        .order('created_at', { ascending: false });

                    if (favoritesData) {
                        setFavorites(favoritesData.map(f => f.listing));
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

    const handleDelete = async (id: number) => {
        if (!window.confirm("本当に削除しますか？\n※この操作は取り消せません。")) return;

        const { data, error } = await supabase
            .from('listings')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            alert("削除に失敗しました: " + error.message);
        } else if (data && data.length > 0) {
            setMyListings(prev => prev.filter(item => item.id !== id));
        } else {
            // RLS assumed to have blocked it if no error but no data returned
            alert("削除できませんでした。権限がない可能性があります。");
        }
    };

    const handleDeleteRequest = async (id: string) => {
        if (!window.confirm("本当に削除しますか？")) return;
        const { data, error } = await supabase
            .from('room_requests')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            alert("削除失敗: " + error.message);
        } else if (data && data.length > 0) {
            setMyRequests(prev => prev.filter(i => i.id !== id));
        } else {
            alert("削除できませんでした。権限がない可能性があります。");
        }
    };

    const handleDeleteGiveaway = async (id: string) => {
        if (!window.confirm("本当に削除しますか？")) return;
        const { data, error } = await supabase
            .from('giveaways')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            alert("削除失敗: " + error.message);
        } else if (data && data.length > 0) {
            setMyGiveaways(prev => prev.filter(i => i.id !== id));
        } else {
            alert("削除できませんでした。権限がない可能性があります。");
        }
    };

    const handleToggleVisibility = async (id: number, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        const confirmMsg = newStatus
            ? "この物件の募集を再開しますか？\n公開ページに表示されるようになります。"
            : "この物件の募集を一時停止しますか？\n公開ページから非表示になります（削除はされません）。";

        if (!window.confirm(confirmMsg)) return;

        const { error } = await supabase
            .from('listings')
            .update({ is_public: newStatus })
            .eq('id', id);

        if (error) {
            alert("更新に失敗しました: " + error.message);
        } else {
            setMyListings(prev => prev.map(item =>
                item.id === id ? { ...item, is_public: newStatus } : item
            ));
        }
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
                                <div key={l.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${!(l.is_public ?? true) ? 'border-gray-300 opacity-75 grayscale-[0.5]' : 'border-gray-100'}`}>
                                    <div className="h-auto relative">
                                        {!(l.is_public ?? true) && (
                                            <div className="absolute top-2 right-2 z-10 bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">停止中</div>
                                        )}
                                        <PhotoPropertyCard
                                            id={l.id}
                                            imageUrl={l.images && l.images.length > 0 ? l.images[0] : undefined}
                                            image={(!l.images || l.images.length === 0) ? 'bg-gray-200' : undefined}
                                            price={l.price}
                                            station={l.address ? l.address.split(' ')[0] : '駅指定なし'}
                                            badges={l.amenities ? l.amenities.slice(0, 2) : []}
                                            title={l.title}
                                            viewCount={l.view_count || 0}
                                            favoritesCount={l.favorites_count || 0}
                                            inquiryCount={l.inquiry_count || 0}
                                            prefecture={l.prefecture}
                                            city={l.city}
                                            createdAt={l.created_at}
                                        />
                                    </div>
                                    <div className="p-2 flex gap-2 bg-gray-50 border-t border-gray-100">
                                        <Link href={`/host?edit=${l.id}`} className="flex-1 text-center text-xs font-bold text-gray-600 bg-white py-2 rounded border border-gray-200 hover:text-[#bf0000] hover:border-[#bf0000] transition">
                                            <span className="flex items-center justify-center gap-1"><MdEdit /> 編集</span>
                                        </Link>
                                        <button onClick={() => handleDelete(l.id)} className="flex-1 text-center text-xs font-bold text-red-500 bg-white py-2 rounded border border-red-100 hover:bg-red-50 hover:border-red-500 transition">
                                            削除
                                        </button>
                                    </div>
                                    {/* Visibility Toggle */}
                                    <div className="px-2 pb-2">
                                        <button
                                            onClick={() => handleToggleVisibility(l.id, l.is_public ?? true)}
                                            className={`w-full py-2 rounded text-xs font-bold flex items-center justify-center gap-1 border transition ${(l.is_public ?? true)
                                                ? 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100'
                                                : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                                                }`}
                                        >
                                            {(l.is_public ?? true) ? (
                                                <><MdPause /> 募集停止する</>
                                            ) : (
                                                <><MdPlayArrow /> 募集再開する</>
                                            )}
                                        </button>
                                    </div>
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

                {/* My Requests Section */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">掲載中のリクエスト</h3>
                    {myRequests.length > 0 ? (
                        <div className="space-y-4">
                            {myRequests.map((req) => (
                                <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div className="mb-2">
                                        <h4 className="font-bold text-gray-800">{req.title}</h4>
                                        <p className="text-xs text-gray-500">{new Date(req.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-2 text-xs">
                                        <Link href={`/request/${req.id}/edit`} className="bg-gray-100 text-gray-600 px-3 py-2 rounded font-bold hover:bg-gray-200 transition flex items-center gap-1">
                                            <MdEdit /> 編集
                                        </Link>
                                        <button onClick={() => handleDeleteRequest(req.id)} className="bg-red-50 text-red-500 px-3 py-2 rounded font-bold hover:bg-red-100 transition">
                                            削除
                                        </button>
                                        <Link href={`/request/${req.id}`} className="ml-auto text-[#bf0000] font-bold hover:underline flex items-center">
                                            確認 <MdArrowForwardIos className="text-xs" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm px-1">リクエストはありません。</p>
                    )}
                </section>

                {/* My Giveaways Section */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">掲載中の「あげたい」</h3>
                    {myGiveaways.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {myGiveaways.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                                    <div className="h-32 bg-gray-200 relative">
                                        {item.image_url ? (
                                            <img src={item.image_url} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-bold text-gray-800 text-sm line-clamp-1 mb-1">{item.title}</h4>
                                        <p className="text-xs text-gray-500 mb-3">{new Date(item.created_at).toLocaleDateString()}</p>
                                        <div className="flex gap-2 text-xs">
                                            <Link href={`/give/${item.id}/edit`} className="bg-gray-100 text-gray-600 px-3 py-2 rounded font-bold hover:bg-gray-200 transition flex items-center gap-1 flex-1 justify-center">
                                                <MdEdit /> 編集
                                            </Link>
                                            <button onClick={() => handleDeleteGiveaway(item.id)} className="bg-red-50 text-red-500 px-3 py-2 rounded font-bold hover:bg-red-100 transition flex-1">
                                                削除
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm px-1">「あげたい」投稿はありません。</p>
                    )}
                </section>

                {/* Favorites Section */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">ウォッチリスト</h3>
                    {favorites.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {favorites.map((l) => (
                                <div key={l.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="h-auto relative">
                                        <PhotoPropertyCard
                                            id={l.id}
                                            imageUrl={l.images && l.images.length > 0 ? l.images[0] : undefined}
                                            image={(!l.images || l.images.length === 0) ? 'bg-gray-200' : undefined}
                                            price={l.price}
                                            station={l.address ? l.address.split(' ')[0] : '駅指定なし'}
                                            badges={l.amenities ? l.amenities.slice(0, 2) : []}
                                            title={l.title}
                                            description={l.description}
                                            viewCount={l.view_count || 0}
                                            favoritesCount={l.favorites_count || 0}
                                            inquiryCount={l.inquiry_count || 0}
                                            prefecture={l.prefecture}
                                            city={l.city}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8 text-center text-gray-500">
                            <p>ウォッチリストに登録された物件はありません。</p>
                        </div>
                    )}
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
