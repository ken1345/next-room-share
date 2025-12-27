"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { MdArrowBack, MdSend, MdPerson, MdImage, MdBlock, MdMoreVert } from 'react-icons/md';

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

    // Blocking State
    const [isBlocked, setIsBlocked] = useState(false); // Blocked mutually or by other? (Strictly speaking, if I blocked them, I can unblock)
    const [blockedByMe, setBlockedByMe] = useState(false); // Did I block them?
    const [showMenu, setShowMenu] = useState(false); // For dropdown menu

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
                return;
            }
            setThread(threadData);

            // Determine Counterpart ID
            const counterpartId = (session.user.id === threadData.host_id) ? threadData.seeker_id : threadData.host_id;

            // Fetch Block Status
            // Check if I blocked them
            const { data: myBlock } = await supabase
                .from('user_blocks')
                .select('*')
                .eq('blocker_id', session.user.id)
                .eq('blocked_id', counterpartId)
                .single();

            if (myBlock) setBlockedByMe(true);

            // Check if they blocked me (Optional: strictly speaking we might not know, but if we can't send, we are blocked)
            // But usually we just check if *any* block relationship exists for disabling UI
            const { data: theirBlock } = await supabase
                .from('user_blocks')
                .select('*')
                .eq('blocker_id', counterpartId)
                .eq('blocked_id', session.user.id)
                .single();

            if (myBlock || theirBlock) {
                setIsBlocked(true);
            }

            // Fetch Messages
            const { data: msgs, error: msgsError } = await supabase
                .from('messages')
                .select('*')
                .eq('thread_id', threadId)
                .order('created_at', { ascending: true });

            if (msgs) setMessages(msgs);

            // Mark unread messages as read (if I am not the sender)
            if (session.user.id) {
                await supabase
                    .from('messages')
                    .update({ read_at: new Date().toISOString() })
                    .eq('thread_id', threadId)
                    .neq('sender_id', session.user.id)
                    .is('read_at', null);
            }

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
        if (!newMessage.trim() || !user || isBlocked) return;
        setSending(true);

        const content = newMessage.trim();
        setNewMessage('');

        // --- AI Content Moderation Check ---
        try {
            const modResponse = await fetch('/api/moderation/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: content }),
            });

            if (modResponse.ok) {
                const modResult = await modResponse.json();
                if (modResult.flagged) {
                    alert(`メッセージ内容に不適切な表現が含まれている可能性があります。\n(理由: ${modResult.categories.join(', ')})`);
                    setNewMessage(content);
                    setSending(false);
                    return;
                }
            }
        } catch (e) {
            console.warn("Moderation check failed, proceeding anyway...", e);
        }

        const { data: sentMessage, error } = await supabase
            .from('messages')
            .insert({
                thread_id: threadId,
                sender_id: user.id,
                content: content
            })
            .select()
            .single();

        if (error) {
            alert("送信に失敗しました（ブロックされている可能性があります）");
            setNewMessage(content);
        } else {
            if (sentMessage) {
                setMessages(prev => [...prev, sentMessage]);
            }

            // Send Email Notification (Non-blocking)
            const sendNotification = async () => {
                const recipientId = (user.id === thread.host_id) ? thread.seeker_id : thread.host_id;

                let senderName = 'ユーザー';
                if (user.id === thread.host_id) {
                    senderName = thread.host?.display_name || user.user_metadata?.full_name;
                } else if (user.id === thread.seeker_id) {
                    senderName = thread.seeker?.display_name || user.user_metadata?.full_name;
                }

                if (!senderName) senderName = user.email?.split('@')[0] || 'ユーザー';

                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;

                if (token) {
                    fetch('/api/send-message-notification', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            recipientId,
                            senderName,
                            messageContent: content,
                            threadId
                        })
                    }).catch(err => console.error("Notification failed", err));
                }
            };
            sendNotification();

            supabase
                .from('threads')
                .update({ updated_at: new Date() })
                .eq('id', threadId)
                .then(({ error }) => {
                    if (error) console.error("Failed to update thread timestamp", error);
                });
        }
        setSending(false);
    };

    const toggleBlock = async () => {
        if (!user || !thread) return;
        const counterpartId = (user.id === thread.host_id) ? thread.seeker_id : thread.host_id;

        if (blockedByMe) {
            // Unblock
            const { error } = await supabase
                .from('user_blocks')
                .delete()
                .eq('blocker_id', user.id)
                .eq('blocked_id', counterpartId);

            if (error) {
                alert("解除に失敗しました");
            } else {
                setBlockedByMe(false);
                setIsBlocked(false); // Optimistic (assuming they haven't blocked me too)
                alert("ブロックを解除しました");
            }
        } else {
            // Block
            if (!confirm("このユーザーをブロックしますか？\n今後メッセージのやり取りができなくなります。")) return;

            const { error } = await supabase
                .from('user_blocks')
                .insert({
                    blocker_id: user.id,
                    blocked_id: counterpartId
                });

            if (error) {
                alert("ブロックに失敗しました");
            } else {
                setBlockedByMe(true);
                setIsBlocked(true);
                alert("ブロックしました");
            }
        }
        setShowMenu(false);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!thread) return <div className="min-h-screen flex items-center justify-center">スレッドが見つかりません</div>;

    const isHost = user.id === thread.host_id;
    const counterpart = isHost ? thread.seeker : thread.host;

    return (
        <div className="flex flex-col h-[100dvh] bg-gray-100 font-sans">
            {/* Header */}
            <header className="bg-white border-b px-4 py-3 flex items-center gap-4 shadow-sm z-10 shrink-0 sticky top-0">
                <Link href="/messages" className="text-gray-500 hover:text-gray-800">
                    <MdArrowBack size={24} />
                </Link>
                <div className="flex-1 min-w-0">
                    <h1 className="font-bold text-gray-800 truncate">{counterpart?.display_name || 'Unknown'}</h1>
                    <p className="text-xs text-gray-500 truncate font-bold">{thread.listing?.title}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {thread.listing && (
                        <Link href={`/rooms/${thread.listing.id}`} className="shrink-0 w-10 h-10 rounded overflow-hidden border border-gray-200">
                            {thread.listing.images && thread.listing.images[0] ? (
                                <img src={thread.listing.images[0]} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400"><MdImage /></div>
                            )}
                        </Link>
                    )}

                    {/* Menu Button */}
                    <div className="relative">
                        <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                            <MdMoreVert size={24} />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-50">
                                <button
                                    onClick={toggleBlock}
                                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <MdBlock />
                                    {blockedByMe ? "ブロックを解除" : "このユーザーをブロック"}
                                </button>
                            </div>
                        )}
                        {/* Overlay to close menu */}
                        {showMenu && (
                            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
                        )}
                    </div>
                </div>
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
                {isBlocked ? (
                    <div className="text-center text-gray-500 py-4 text-sm font-bold bg-gray-50 rounded-xl">
                        {blockedByMe ? "このユーザーをブロックしています" : "このユーザーとはメッセージのやり取りができません"}
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    );
}
