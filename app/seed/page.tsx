"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MOCK_PROPERTIES } from '@/data/mock-properties';
import Link from 'next/link';

export default function SeedPage() {
    const [status, setStatus] = useState('Idle');
    const [log, setLog] = useState<string[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
        };
        checkUser();
    }, []);

    const runSeed = async () => {
        if (!user) {
            setStatus('Error: Please login first');
            return;
        }

        setStatus('Seeding...');
        const newLog = [];

        try {
            // 1. Seed Listings
            for (const prop of MOCK_PROPERTIES) {
                // Parse Station: "JR山手線 渋谷駅 徒歩5分"
                // MOCK data format might vary, let's look at it.
                // Assuming "Line Station Min"
                const stationParts = prop.station.split(' ');
                const stationLine = stationParts.length > 2 ? stationParts[0] : null;
                const stationName = stationParts.length > 2 ? stationParts[1] : stationParts[0];
                const minutesStr = (stationParts.length > 2 ? stationParts[2] : stationParts[1])?.replace('徒歩', '').replace('分', '') || '0';
                const minutesToStation = parseInt(minutesStr);

                // Parse Area: "東京都渋谷区..." or "神奈川県横浜市..."
                let prefecture = '東京都';
                let city = '';
                if (prop.area.includes('東京都')) { prefecture = '東京都'; city = prop.area.replace('東京都', ''); }
                else if (prop.area.includes('神奈川県')) { prefecture = '神奈川県'; city = prop.area.replace('神奈川県', ''); }
                else if (prop.area.includes('大阪府')) { prefecture = '大阪府'; city = prop.area.replace('大阪府', ''); }
                else if (prop.area.includes('埼玉県')) { prefecture = '埼玉県'; city = prop.area.replace('埼玉県', ''); }
                else if (prop.area.includes('千葉県')) { prefecture = '千葉県'; city = prop.area.replace('千葉県', ''); }
                else if (prop.area.includes('福岡県')) { prefecture = '福岡県'; city = prop.area.replace('福岡県', ''); }

                // Parse Room Type from Badges
                let room_type = 'private'; // default
                if (prop.badges.includes('個室')) room_type = 'private';
                else if (prop.badges.includes('半個室')) room_type = 'semi';
                else if (prop.badges.includes('ドミトリー')) room_type = 'shared';
                else if (prop.badges.includes('シェアハウス')) room_type = 'shared';

                // Parse Gender
                let gender_restriction = 'any';
                if (prop.badges.includes('女性限定') || prop.badges.includes('女性専用')) gender_restriction = 'female';
                if (prop.badges.includes('男性限定')) gender_restriction = 'male';

                const amenities = prop.badges.filter(b =>
                    !['個室', 'ドミトリー', '半個室', '女性専用', '女性限定', '男性限定'].includes(b)
                );

                const { error } = await supabase.from('listings').insert({
                    title: prop.title,
                    description: `【${prop.area}】${prop.title} - ${prop.badges.join(', ')}`,
                    price: Math.floor(parseFloat(prop.price) * 10000),
                    address: prop.area,

                    // New Columns
                    prefecture,
                    city,
                    station_line: stationLine,
                    station_name: stationName,
                    minutes_to_station: minutesToStation,
                    room_type,
                    gender_restriction,

                    latitude: 35.681236 + (Math.random() - 0.5) * 0.1,
                    longitude: 139.767125 + (Math.random() - 0.5) * 0.1,
                    amenities: amenities,
                    images: [prop.image],
                    host_id: user.id
                });

                if (error) {
                    console.error('Listing error', error);
                    newLog.push(`Error adding listing ${prop.id}: ${error.message}`);
                } else {
                    newLog.push(`Added listing ${prop.id}`);
                }
            }

            // 2. Seed Stories
            const { MOCK_STORIES } = await import('@/data/mock-stories');
            for (const story of MOCK_STORIES) {
                const { error } = await supabase.from('stories').insert({
                    title: story.title,
                    excerpt: story.excerpt || story.body.substring(0, 100),
                    content: story.body, // MOCK_STORIES has 'body', schema has 'content'
                    author_id: user.id,
                    cover_image: story.image,
                    tags: story.tags
                });

                if (error) {
                    console.error('Story error', error);
                    newLog.push(`Error adding story ${story.id}: ${error.message}`);
                } else {
                    newLog.push(`Added story ${story.id}`);
                }
            }

            setStatus('Done');
        } catch (e: any) {
            console.error(e);
            setStatus('Error: ' + e.message);
        }
        setLog(newLog);
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Seeding Supabase</h1>

            {!user ? (
                <div className="bg-yellow-50 p-4 rounded text-yellow-800 mb-4">
                    Please <Link href="/login" className="underline font-bold">Login</Link> to run the seed.
                    Data will be owned by your user.
                </div>
            ) : (
                <div className="mb-4">
                    <p className="mb-2">Logged in as: <strong>{user.email}</strong></p>
                    <button
                        onClick={runSeed}
                        disabled={status === 'Seeding...'}
                        className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
                    >
                        {status === 'Seeding...' ? 'Seeding...' : 'Run Seed'}
                    </button>
                </div>
            )}

            <div className={`text-xl font-bold mb-4 ${status === 'Done' ? 'text-green-600' : status.startsWith('Error') ? 'text-red-600' : 'text-blue-600'}`}>
                Status: {status}
            </div>
            {log.length > 0 && (
                <pre className="bg-gray-100 p-4 rounded text-xs font-mono max-h-96 overflow-auto">
                    {log.join('\n')}
                </pre>
            )}
        </div>
    );
}
