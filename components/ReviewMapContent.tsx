"use client";
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { supabase } from '@/lib/supabase';
import { MdStar, MdAddLocation } from 'react-icons/md';

// Fix for default marker icon in Next.js
const customIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to handle map clicks
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function ReviewMapContent() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newPin, setNewPin] = useState<{ lat: number, lng: number } | null>(null);
    const [formName, setFormName] = useState('');
    const [formRating, setFormRating] = useState(5);
    const [formComment, setFormComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchReviews = async () => {
        const { data, error } = await supabase
            .from('reviews')
            .select(`
                id,
                rating,
                comment,
                listing:listings (
                    id,
                    title,
                    latitude,
                    longitude
                ),
                user:users ( display_name )
            `)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error("Error fetching reviews for map:", error);
        } else {
            const validReviews = data?.map((r: any) => {
                const listing = Array.isArray(r.listing) ? r.listing[0] : r.listing;
                const user = Array.isArray(r.user) ? r.user[0] : r.user;
                return { ...r, listing, user };
            }).filter(r =>

                r.listing &&
                r.listing.latitude &&
                r.listing.longitude
            ) || [];
            setReviews(validReviews);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleMapClick = (lat: number, lng: number) => {
        setNewPin({ lat, lng });
        setFormName('');
        setFormRating(5);
        setFormComment('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPin) return;

        setSubmitting(true);

        // 1. Check Auth
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            alert('口コミを投稿するにはログインが必要です。');
            setSubmitting(false);
            return;
        }

        const user = session.user;

        // 2. Insert Listing (Dummy for location)
        // Note: 'price' is required, setting to 0. 'host_id' is required.
        const { data: listing, error: listingError } = await supabase
            .from('listings')
            .insert({
                title: formName || '無題のスポット',
                description: 'User submitted valid spot.',
                price: 0,
                latitude: newPin.lat,
                longitude: newPin.lng,
                host_id: user.id
            })
            .select()
            .single();

        if (listingError) {
            alert('場所の保存に失敗しました: ' + listingError.message);
            setSubmitting(false);
            return;
        }

        // 3. Insert Review
        const { error: reviewError } = await supabase
            .from('reviews')
            .insert({
                listing_id: listing.id,
                user_id: user.id,
                rating: formRating,
                comment: formComment
            });

        if (reviewError) {
            alert('口コミの保存に失敗しました: ' + reviewError.message);
        } else {
            alert('投稿しました！');
            setNewPin(null);
            fetchReviews(); // Refresh map
        }
        setSubmitting(false);
    };


    if (loading) {
        return <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading Map...</div>;
    }

    // Default center (Japan)
    const center: [number, number] = [36.2048, 138.2529];

    return (
        <MapContainer
            center={center}
            zoom={5}
            style={{ height: '500px', width: '100%', borderRadius: '0.75rem', zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapClickHandler onMapClick={handleMapClick} />

            {/* Existing Reviews */}
            {reviews.map((review) => (
                <Marker
                    key={review.id}
                    position={[review.listing.latitude, review.listing.longitude]}
                    icon={customIcon}
                >
                    <Popup>
                        <div className="min-w-[200px]">
                            <h3 className="font-bold text-gray-800 text-sm mb-1">{review.listing.title}</h3>
                            <div className="flex items-center text-yellow-500 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <MdStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                                ))}
                            </div>
                            <p className="text-xs text-gray-600 mb-2 line-clamp-3">"{review.comment}"</p>
                            <div className="text-[10px] text-gray-400 text-right">- {review.user?.display_name || 'Guest'}</div>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* New Pin Form */}
            {newPin && (
                <Marker position={[newPin.lat, newPin.lng]} icon={customIcon}>
                    <Popup eventHandlers={{ remove: () => setNewPin(null) }}>
                        <div className="min-w-[250px] p-1">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-1">
                                <MdAddLocation className="text-[#bf0000]" /> スポットを追加
                            </h3>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">名称・場所名</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                        placeholder="例：〇〇シェアハウス"
                                        required
                                        value={formName}
                                        onChange={e => setFormName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">評価</label>
                                    <select
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                        value={formRating}
                                        onChange={e => setFormRating(Number(e.target.value))}
                                    >
                                        <option value="5">★★★★★ (5)</option>
                                        <option value="4">★★★★☆ (4)</option>
                                        <option value="3">★★★☆☆ (3)</option>
                                        <option value="2">★★☆☆☆ (2)</option>
                                        <option value="1">★☆☆☆☆ (1)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 block mb-1">口コミ</label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm h-20"
                                        placeholder="住み心地や環境について..."
                                        required
                                        value={formComment}
                                        onChange={e => setFormComment(e.target.value)}
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-[#bf0000] text-white font-bold py-2 rounded shadow-sm hover:bg-[#900000] transition text-xs disabled:opacity-50"
                                >
                                    {submitting ? '保存中...' : '投稿する'}
                                </button>
                            </form>
                        </div>
                    </Popup>
                </Marker>
            )}

        </MapContainer>
    );
}
