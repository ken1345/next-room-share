"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { MdPerson, MdImage } from 'react-icons/md';
import { useRouter } from 'next/navigation';

type Thread = {
    id: string;
    listing_id: string;
    host_id: string;
    seeker_id: string;
    updated_at: string;
    listing: {
        title: string;
        images: string[];
    } | null;
    host: {
        display_name: string;
        photo_url: string;
        email: string;
    } | null;
    seeker: {
        display_name: string;
        photo_url: string;
        email: string;
    } | null;
    last_message_sender_id?: string;
    last_message_content?: string;
    last_message_created_at?: string;
    last_message_read_at?: string | null; // Changed from is_read
};

export default function MessagesListPage() {
    const [user, setUser] = useState<any>(null);
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchThreads = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login?redirect=/messages');
                return;
            }
            setUser(session.user);

            // Fetch threads where user is host OR seeker
            // Supabase postgrest doesn't support "OR" across columns easily in one .eq chain without .or() syntax
            const { data, error } = await supabase
                .from('threads')
                .select(`
                    *,
                    listing:listings(title, images),
                    host:host_id(display_name, photo_url, email),
                    seeker:seeker_id(display_name, photo_url, email)
                `)
                .or(`host_id.eq.${session.user.id},seeker_id.eq.${session.user.id}`)
                .order('updated_at', { ascending: false });

            if (error) {
                console.error("Error fetching threads:", error);
            } else if (data) {
                const threadsWithLastMsg = await Promise.all(data.map(async (t: any) => {
                    // Fetch last message for each thread to determine sender/status
                    const { data: lastMsgs } = await supabase
                        .from('messages')
                        .select('sender_id, content, created_at, read_at') // Fetch read_at
                        .eq('thread_id', t.id)
                        .order('created_at', { ascending: false })
                        .limit(1);

                    const lastMsg = lastMsgs?.[0];
                    return {
                        ...t,
                        last_message_sender_id: lastMsg?.sender_id,
                        last_message_content: lastMsg?.content,
                        last_message_created_at: lastMsg?.created_at,
                        last_message_read_at: lastMsg?.read_at // Store read_at
                    };
                }));

                // Sort by last message created_at (descending)
                threadsWithLastMsg.sort((a, b) => {
                    const timeA = a.last_message_created_at ? new Date(a.last_message_created_at).getTime() : new Date(a.updated_at).getTime();
                    const timeB = b.last_message_created_at ? new Date(b.last_message_created_at).getTime() : new Date(b.updated_at).getTime();
                    return timeB - timeA;
                });

                // Cast to expected type or ensure type compatibility implicitly
                setThreads(threadsWithLastMsg as Thread[]);
            }
            setLoading(false);
        };

        fetchThreads();
    }, [router]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (threads.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h2 className="text-xl font-bold text-gray-700 mb-4">メッセージはまだありません</h2>
                <Link href="/search" className="text-[#bf0000] hover:underline">
                    部屋を探す
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="container mx-auto max-w-2xl px-4 py-8">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">メッセージ一覧</h1>
                <div className="space-y-4">
                    {threads.map(thread => {
                        const isHost = user.id === thread.host_id;
                        const counterpart = isHost ? thread.seeker : thread.host;
                        const counterpartName = counterpart?.display_name || counterpart?.email?.split('@')[0] || 'ユーザー';
                        const counterpartImage = counterpart?.photo_url;

                        let lastSenderLabel = "";
                        let lastContent = thread.last_message_content || "メッセージなし";

                        // Check Unread Status
                        // Unread if: Last message is NOT from me AND read_at is null
                        const isUnread = thread.last_message_sender_id !== user.id && !thread.last_message_read_at;

                        if (thread.last_message_sender_id) {
                            if (thread.last_message_sender_id === user.id) {
                                lastSenderLabel = "あなた";
                            } else {
                                lastSenderLabel = "相手";
                            }
                        }


                        // Formatting Date (Use last message time preferentially)
                        const targetDate = thread.last_message_created_at ? thread.last_message_created_at : thread.updated_at;
                        const date = new Date(targetDate);
                        const dateStr = date.toLocaleDateString();
                        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        return (
                            <Link href={`/messages/${thread.id}`} key={thread.id} className={`block bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition relative ${isUnread ? 'bg-red-50/30' : ''}`}>
                                {isUnread && (
                                    <div className="absolute top-2 left-2 w-3 h-3 bg-[#bf0000] rounded-full shadow-sm z-10"></div>
                                )}
                                <div className="flex items-start gap-4">
                                    {/* Icon / Image */}
                                    <div className="shrink-0 w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-100">
                                        {counterpartImage ? (
                                            <img src={counterpartImage} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <MdPerson size={24} className="text-gray-400" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={`font-bold text-gray-800 truncate pr-6 ${isUnread ? 'text-[#bf0000]' : ''}`}>{counterpartName}</h3>
                                            <span className={`text-xs shrink-0 ${isUnread ? 'text-[#bf0000] font-bold' : 'text-gray-400'}`}>{dateStr} {timeStr}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 font-bold mb-1 truncate">
                                            {thread.listing?.title || "物件名なし"}
                                        </p>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 truncate">
                                            <span className="shrink-0 font-bold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded mr-1" style={{ fontSize: '10px' }}>
                                                最終メッセージ
                                            </span>
                                            {thread.last_message_sender_id && (
                                                <span className={`font-bold shrink-0 ${thread.last_message_sender_id === user.id ? 'text-gray-500' : 'text-[#bf0000]'}`}>
                                                    {lastSenderLabel}:
                                                </span>
                                            )}
                                            <span className="text-gray-400 truncate">
                                                {lastContent}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Listing Thumbnail (Small) */}
                                    {thread.listing?.images?.[0] && (
                                        <div className="shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                                            <img src={thread.listing.images[0]} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
