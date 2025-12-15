"use client";
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { supabase } from '@/lib/supabase';
import { MdStar, MdRoom } from 'react-icons/md';

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

export default function ReviewMapContent() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
                .limit(20);

            if (error) {
                console.error("Error fetching reviews for map:", error);
            } else {
                // Filter out reviews without valid location data
                const validReviews = data?.filter(r =>
                    r.listing &&
                    r.listing.latitude &&
                    r.listing.longitude
                ) || [];
                setReviews(validReviews);
            }
            setLoading(false);
        };

        fetchReviews();
    }, []);

    if (loading) {
        return <div className="h-[400px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading Map...</div>;
    }

    // Default center (Japan)
    const center: [number, number] = [36.2048, 138.2529];

    return (
        <MapContainer
            center={center}
            zoom={5}
            style={{ height: '400px', width: '100%', borderRadius: '0.75rem', zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
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
        </MapContainer>
    );
}
