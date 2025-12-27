"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MdArrowBack, MdPerson, MdBlock } from 'react-icons/md';
import { supabase } from '@/lib/supabase';

export default function BlockedUsersPage() {
    const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlockedUsers = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                window.location.href = '/login';
                return;
            }

            // Fetch blocked users with their profile info
            // Assuming 'users' table is referenced by blocked_id
            const { data, error } = await supabase
                .from('user_blocks')
                .select(`
                    id,
                    blocked_id,
                    created_at,
                    blocked_user:blocked_id (
                        id,
                        display_name,
                        photo_url
                    )
                `)
                .eq('blocker_id', session.user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching blocked users:", error);
            } else if (data) {
                setBlockedUsers(data.map((item: any) => ({
                    id: item.id, // block record id
                    userId: item.blocked_id,
                    user: item.blocked_user || { display_name: 'Unknown User' },
                    date: item.created_at
                })));
            }
            setLoading(false);
        };

        fetchBlockedUsers();
    }, []);

    const handleUnblock = async (blockId: string, userName: string) => {
        if (!confirm(`${userName}さんのブロックを解除しますか？`)) return;

        const { error } = await supabase
            .from('user_blocks')
            .delete()
            .eq('id', blockId);

        if (error) {
            alert("解除に失敗しました");
        } else {
            setBlockedUsers(prev => prev.filter(u => u.id !== blockId));
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <header className="bg-white border-b px-4 py-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
                <Link href="/account" className="text-gray-500 hover:text-gray-800">
                    <MdArrowBack size={24} />
                </Link>
                <h1 className="text-lg font-bold text-gray-800">ブロックしたユーザー</h1>
            </header>

            <div className="container mx-auto px-4 py-6 max-w-2xl">
                {blockedUsers.length > 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y">
                        {blockedUsers.map((item) => (
                            <div key={item.id} className="p-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 shrink-0 overflow-hidden">
                                    {item.user.photo_url ? (
                                        <img src={item.user.photo_url} alt={item.user.display_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <MdPerson size={24} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-800 truncate">{item.user.display_name}</h3>
                                    <p className="text-xs text-gray-500">ブロック日: {new Date(item.date).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => handleUnblock(item.id, item.user.display_name)}
                                    className="text-xs font-bold text-gray-500 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition whitespace-nowrap"
                                >
                                    解除
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                            <MdBlock size={32} />
                        </div>
                        <p className="font-bold">ブロックしているユーザーはいません</p>
                    </div>
                )}
            </div>
        </div>
    );
}
