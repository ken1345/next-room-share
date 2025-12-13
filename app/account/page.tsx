"use client";
import Link from 'next/link';
import { MdPerson, MdEmail, MdArrowForwardIos } from 'react-icons/md';

// Mock User Data
const MOCK_USER = {
    name: 'Room User',
    email: 'user@example.com',
    avatar: null // potentially a URL string
};

// Mock Message Threads
const MOCK_THREADS = [
    {
        id: 1,
        partnerName: 'Room Share Host',
        partnerAvatar: null,
        lastMessage: '承知いたしました。では12/16(土) 14:00に現地でお待ちしております。',
        timestamp: '2023/12/12',
        unread: true
    },
    {
        id: 2,
        partnerName: 'Shinjuku Base Host',
        partnerAvatar: null,
        lastMessage: 'お問い合わせありがとうございます。現在満室となっておりまして...',
        timestamp: '2023/12/10',
        unread: false
    }
];

export default function AccountPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <div className="bg-white border-b shadow-sm mb-6">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">アカウント</h1>
                    <Link href="/settings" className="text-sm font-bold text-gray-500 hover:text-gray-800 transition">
                        設定
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-2xl space-y-8">
                {/* Profile Section */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 shrink-0">
                        {MOCK_USER.avatar ? (
                            <img src={MOCK_USER.avatar} alt={MOCK_USER.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <MdPerson size={40} />
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-1">{MOCK_USER.name}</h2>
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
                            <MdEmail /> {MOCK_USER.email}
                        </div>
                        <div className="mt-4">
                            <Link href="/account/edit" className="text-sm font-bold text-[#bf0000] border border-[#bf0000] px-4 py-2 rounded-full hover:bg-[#bf0000] hover:text-white transition">
                                プロフィールを編集
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Messages Section */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">メッセージ</h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {MOCK_THREADS.map((thread) => (
                            <Link href={`/messages/${thread.id}`} key={thread.id} className="block hover:bg-gray-50 transition border-b border-gray-100 last:border-none">
                                <div className="p-4 flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 shrink-0 relative">
                                        <MdPerson size={24} />
                                        {thread.unread && (
                                            <div className="absolute top-0 right-0 w-3 h-3 bg-[#bf0000] rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-gray-800 text-sm truncate">{thread.partnerName}</h4>
                                            <span className="text-xs text-gray-400 font-bold shrink-0">{thread.timestamp}</span>
                                        </div>
                                        <p className={`text-sm truncate ${thread.unread ? 'text-gray-800 font-bold' : 'text-gray-500'}`}>
                                            {thread.lastMessage}
                                        </p>
                                    </div>
                                    <MdArrowForwardIos className="text-gray-300 shrink-0" size={16} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
