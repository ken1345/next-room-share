"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { MdArrowBack, MdSend, MdPerson, MdImage } from 'react-icons/md';

export default function MessageThreadPage() {
    const params = useParams();
    const router = useRouter();
    const threadId = params.id as string;

    const [user, setUser] = useState<any>(null);
    const [thread, setThread] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push(`/login?redirect=/messages/${threadId}`);
                return;
            }
            setUser(session.user);

            // Fetch Thread Details
            const { data: threadData, error: threadError } = await supabase
                .from('threads')
                .select(`
                    *,
                    listing:listings(id, title, price, images),
                    host:host_id(id, display_name, photo_url),
                    seeker:seeker_id(id, display_name, photo_url)
                `)
                .eq('id', threadId)
                .single();

            if (threadError || !threadData) {
                console.error("Error fetching thread:", threadError);
                // Handle error (access denied or not found)
                return;
            }
            setThread(threadData);

            // Fetch Messages
            const { data: msgs, error: msgsError } = await supabase
                .from('messages')
                .select('*')
                .eq('thread_id', threadId)
                .order('created_at', { ascending: true });

            if (msgs) setMessages(msgs);

            setLoading(false);

            // Subscribe to new messages
            const channel = supabase
                .channel(`thread:${threadId}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `thread_id=eq.${threadId}`
                }, (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        };

        init();
    }, [threadId, router]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;
        setSending(true);

        const content = newMessage.trim();
        setNewMessage(''); // Optimistic clear

        const { error } = await supabase
            .from('messages')
            .insert({
                thread_id: threadId,
                sender_id: user.id,
                content: content
            });

        if (error) {
            alert("送信に失敗しました");
            setNewMessage(content); // Revert
        } else {
            // Update thread updated_at
            await supabase
                .from('threads')
                .update({ updated_at: new Date() })
                .eq('id', threadId);
        }
        setSending(false);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!thread) return <div className="min-h-screen flex items-center justify-center">スレッドが見つかりません</div>;

    const isHost = user.id === thread.host_id;
    const counterpart = isHost ? thread.seeker : thread.host;

    return (
        <div className="flex flex-col h-[100dvh] bg-gray-100 font-sans">
            {/* Header */}
            <header className="bg-white border-b px-4 py-3 flex items-center gap-4 shadow-sm z-10 shrink-0">
                <Link href="/account" className="text-gray-500 hover:text-gray-800">
                    <MdArrowBack size={24} />
                </Link>
                <div className="flex-1 min-w-0">
                    <h1 className="font-bold text-gray-800 truncate">{counterpart?.display_name || 'Unknown'}</h1>
                    <p className="text-xs text-gray-500 truncate font-bold">{thread.listing?.title}</p>
                </div>
                {thread.listing && (
                    <Link href={`/rooms/${thread.listing.id}`} className="shrink-0 w-10 h-10 rounded overflow-hidden border border-gray-200">
                        {thread.listing.images && thread.listing.images[0] ? (
                            <img src={thread.listing.images[0]} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400"><MdImage /></div>
                        )}
                    </Link>
                )}
            </header>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => {
                    const isMe = msg.sender_id === user.id;
                    const showDate = i === 0 || new Date(messages[i - 1].created_at).toDateString() !== new Date(msg.created_at).toDateString();

                    return (
                        <div key={msg.id}>
                            {showDate && (
                                <div className="text-center text-xs text-gray-400 font-bold my-4">
                                    {new Date(msg.created_at).toLocaleDateString()}
                                </div>
                            )}
                            <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl p-3 text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${isMe ? 'bg-[#bf0000] text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                            <div className={`text-[10px] text-gray-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t p-3 shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-end gap-2 max-w-4xl mx-auto">
                    <textarea
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="メッセージを入力..."
                        rows={1}
                        className="flex-1 bg-gray-100 rounded-xl p-3 max-h-32 focus:bg-white focus:ring-2 focus:ring-[#bf0000] outline-none resize-none font-bold text-gray-800"
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="bg-[#bf0000] text-white p-3 rounded-xl disabled:opacity-50 hover:bg-black transition shrink-0"
                    >
                        <MdSend size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
