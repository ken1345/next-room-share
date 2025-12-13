"use client";
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MdArrowBack, MdSend, MdPerson } from 'react-icons/md';

type Message = {
    id: number;
    sender: 'user' | 'host';
    name: string;
    text: string;
    timestamp: string;
};

// Initial mock data simulating an existing conversation or just the first inquiry
const INITIAL_MESSAGES: Message[] = [
    {
        id: 1,
        sender: 'user',
        name: 'You',
        text: 'はじめまして。この物件に興味があり、内覧を希望します。来週の土日は空いていますでしょうか？よろしくお願いします。',
        timestamp: '2023/12/12 10:00'
    },
    {
        id: 2,
        sender: 'host',
        name: 'Room Share Host',
        text: 'お問い合わせありがとうございます！管理人の田中です。\n土日ですと、12/16(土)の14:00〜16:00の間でしたらご案内可能です。いかがでしょうか？',
        timestamp: '2023/12/12 13:30'
    }
];

export default function MessageThreadPage() {
    const params = useParams();
    // const threadId = params.id; // Not used in mock but available for future

    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: messages.length + 1,
            sender: 'user',
            name: 'You',
            text: inputText,
            timestamp: new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInputText('');

        // Mock Host Reply
        setTimeout(() => {
            const hostReply: Message = {
                id: messages.length + 2,
                sender: 'host',
                name: 'Room Share Host',
                text: '承知いたしました。では12/16(土) 14:00に現地でお待ちしております。',
                timestamp: new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, hostReply]);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 font-sans">
            {/* Header */}
            <div className="bg-white border-b shadow-sm shrink-0 h-16 flex items-center px-4 sticky top-0 z-10">
                <Link href="/search" className="text-gray-500 hover:text-gray-800 p-2 -ml-2 rounded-full hover:bg-gray-100 transition mr-2">
                    <MdArrowBack size={24} />
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                        <MdPerson size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-800 text-sm md:text-base leading-tight">Room Share Host</h1>
                        <p className="text-xs text-gray-400 font-bold">カフェのような広いキッチンがある家</p>
                    </div>
                </div>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg) => {
                    const isMe = msg.sender === 'user';
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex flex-col max-w-[80%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`px-4 py-3 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap ${isMe
                                            ? 'bg-[#bf0000] text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                                <div className="flex items-center gap-2 mt-1 px-1">
                                    <span className="text-[10px] text-gray-400 font-bold">{msg.name}</span>
                                    <span className="text-[10px] text-gray-300">{msg.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t p-4 shrink-0">
                <form onSubmit={handleSend} className="container mx-auto max-w-4xl flex gap-2 items-end">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="メッセージを入力..."
                        className="flex-1 bg-gray-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#bf0000]/20 focus:bg-white transition resize-none min-h-[50px] max-h-[150px]"
                        rows={1}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="bg-[#bf0000] text-white p-3 rounded-full shadow-md hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MdSend size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
