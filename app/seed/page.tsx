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
                // Transform to match schema roughly
                const stationParts = prop.station.split(' ');
                const stationName = stationParts[0] || 'Unknown';
                const minutesStr = stationParts[1]?.replace('分', '') || '0';
                const minutesToStation = parseInt(minutesStr);

                const amenities = prop.badges.filter(b =>
                    !['個室', 'ドミトリー', '半個室', '女性専用', '女性限定', '男性限定'].includes(b)
                );

                const { error } = await supabase.from('listings').insert({
                    title: prop.title,
                    description: `【${prop.area}】${prop.title} - ${prop.badges.join(', ')}`,
                    price: Math.floor(parseFloat(prop.price) * 10000),
                    address: prop.area, // Simplified
                    latitude: 35.681236 + (Math.random() - 0.5) * 0.1, // Randomize slightly around Tokyo
                    longitude: 139.767125 + (Math.random() - 0.5) * 0.1,
                    amenities: amenities,
                    images: [prop.image], // Use the mock image URL directly
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
