"use client";

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { MOCK_PROPERTIES } from '@/data/mock-properties';

// Review Data from ReviewMap.tsx
const REVIEWS = [
    { id: 1, lat: 35.658034, lng: 139.701636, title: "渋谷・神泉エリア", rating: 5, text: "駅近なのに静か。スーパーも近くて自炊派には最高です。" },
    { id: 2, lat: 35.702258, lng: 139.560431, title: "三鷹の森ハウス", rating: 4, text: "公園が目の前！休日はシェアメイトとピクニックしてます。" },
    { id: 3, lat: 35.714013, lng: 139.796648, title: "浅草リバーサイド", rating: 5, text: "隅田川の花火が屋上から見えます。外国人の入居者が多め。" },
    { id: 4, lat: 34.702485, lng: 135.495951, title: "梅田スカイシェア", rating: 4, text: "大阪駅まで徒歩圏内。便利すぎて引っ越せません。" },
    { id: 5, lat: 33.590184, lng: 130.401733, title: "博多グルメハウス", rating: 5, text: "近くに美味しい屋台がたくさん。太ります（笑）" },
];

export default function SeedPage() {
    const [status, setStatus] = useState('Idle');
    const [log, setLog] = useState<string[]>([]);

    useEffect(() => {
        const seed = async () => {
            setStatus('Seeding...');
            const newLog = [];

            try {
                const batch = writeBatch(db);

                // 1. Seed Users & Accounts
                // User 1 (Acts as Guest in mock scenario)
                const user1Ref = doc(db, 'users', 'user-1');
                const user1SystemId = 'MEMBER_001';
                batch.set(user1Ref, {
                    name: 'Guest User',
                    systemId: user1SystemId,
                    email: 'user1@example.com',
                    image: null,
                    createdAt: new Date()
                });
                const user1AccountRef = doc(db, 'accounts', user1SystemId);
                batch.set(user1AccountRef, {
                    userId: 'user-1',
                    createdAt: new Date()
                });
                newLog.push('Added user-1 & account MEMBER_001');

                // User 2 (Acts as Host in mock scenario)
                const user2Ref = doc(db, 'users', 'user-2'); // Renamed from host-1 for neutrality
                const user2SystemId = 'MEMBER_002'; // Consistent ID format
                batch.set(user2Ref, {
                    name: 'Host User',
                    systemId: user2SystemId,
                    email: 'user2@example.com',
                    image: null,
                    createdAt: new Date()
                });
                const user2AccountRef = doc(db, 'accounts', user2SystemId);
                batch.set(user2AccountRef, {
                    userId: 'user-2',
                    createdAt: new Date()
                });
                newLog.push('Added user-2 & account MEMBER_002');

                // 2. Seed Reviews
                for (const rev of REVIEWS) {
                    const ref = doc(db, 'reviews', String(rev.id));
                    batch.set(ref, {
                        ...rev,
                        createdAt: new Date()
                    });
                    newLog.push(`Added review ${rev.id}`);
                }

                // 3. Seed Listings
                for (const prop of MOCK_PROPERTIES) {
                    const ref = doc(db, 'listings', String(prop.id));

                    // Transform to match schema roughly
                    const stationParts = prop.station.split(' ');
                    const stationName = stationParts[0] || 'Unknown';
                    const minutesStr = stationParts[1]?.replace('分', '') || '0';
                    const minutesToStation = parseInt(minutesStr);

                    let genderRestriction = 'any';
                    if (prop.badges.includes('女性専用') || prop.badges.includes('女性限定')) {
                        genderRestriction = 'female';
                    } else if (prop.badges.includes('男性限定')) {
                        genderRestriction = 'male';
                    }

                    const amenities = prop.badges.filter(b =>
                        !['個室', 'ドミトリー', '半個室', '女性専用', '女性限定', '男性限定'].includes(b)
                    );

                    batch.set(ref, {
                        ...prop,
                        rent: Math.floor(parseFloat(prop.price) * 10000), // Convert e.g. 5.4 -> 54000
                        city: prop.area,
                        minutesToStation,
                        stationName,
                        genderRestriction,
                        amenities,
                        hostId: 'user-2', // Updated to new ID (was host-1)
                        createdAt: new Date()
                    });
                    newLog.push(`Added listing ${prop.id}`);
                }

                await batch.commit();
                newLog.push('Committed batch (Users, Reviews, Listings)');

                // 4. Seed Thread & Messages (separate writes for flexibility)
                const threadRef = doc(db, 'threads', 'thread-1');
                await setDoc(threadRef, {
                    listingId: '1',
                    hostId: 'user-2', // Updated
                    userId: 'user-1',
                    lastMessageAt: new Date(),
                    createdAt: new Date()
                });
                newLog.push('Created thread-1');

                const messagesRef = collection(db, 'threads', 'thread-1', 'messages');
                await setDoc(doc(messagesRef, 'msg-1'), {
                    senderId: 'user-1',
                    content: '物件に興味があります。',
                    sentAt: new Date()
                });
                await setDoc(doc(messagesRef, 'msg-2'), {
                    senderId: 'user-2', // Updated
                    content: 'ありがとうございます。',
                    sentAt: new Date()
                });
                newLog.push('Added messages to thread-1');

                // 5. Seed Contact (Inquiry Form Data)
                const contactRef = doc(db, 'contacts', 'contact-1');
                await setDoc(contactRef, {
                    listingId: '1',
                    userId: 'user-1',
                    hostId: 'user-2', // Updated
                    threadId: 'thread-1', // Link to thread
                    name: '山田 太郎', // Mock data matches form placeholder/default
                    age: 25,
                    gender: 'male',
                    occupation: '会社員',
                    currentPrefecture: '東京都',
                    duration: '1-5months',
                    moveInDate: '2025-01-01',
                    message: '物件に興味があり、内覧を希望します。よろしくお願いします。',
                    createdAt: new Date()
                });
                newLog.push('Added contact-1 (Inquiry data)');

                // 6. Seed Stories
                const { MOCK_STORIES } = await import('@/data/mock-stories');
                for (const story of MOCK_STORIES) {
                    const storyRef = doc(db, 'stories', String(story.id));
                    await setDoc(storyRef, {
                        ...story,
                        createdAt: new Date()
                    });
                    newLog.push(`Added story ${story.id}`);
                }
                newLog.push('Added stories');

                setStatus('Done');
            } catch (e: any) {
                console.error(e);
                setStatus('Error: ' + e.message);
            }
            setLog(newLog);
        };

        seed();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Seeding Firebase</h1>
            <div className={`text-xl font-bold mb-4 ${status === 'Done' ? 'text-green-600' : status.startsWith('Error') ? 'text-red-600' : 'text-blue-600'}`}>
                Status: {status}
            </div>
            <pre className="bg-gray-100 p-4 rounded text-xs font-mono">
                {log.join('\n')}
            </pre>
        </div>
    );
}
