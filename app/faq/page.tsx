"use client";
import React from 'react';
import { MdHelp } from 'react-icons/md';

export default function FAQPage() {
    const faqs = [
        {
            q: '料金はかかりますか？',
            a: '物件の閲覧は無料です。物件への問い合わせ時に会員登録（無料）が必要です。'
        },
        {
            q: '退会したいのですが。',
            a: 'マイページのアカウント設定から退会手続きが可能です。'
        },
        {
            q: '内見の予約はどうすればいいですか？',
            a: '各物件詳細ページの「問い合わせ」ボタンから、ホストに直接メッセージを送って日程調整を行ってください。'
        },
        {
            q: 'ペット等の飼育は可能ですか？',
            a: '物件によって異なります。条件検索で「ペット可」にチェックを入れて検索してください。'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-16 text-gray-700">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold mb-10 flex items-center gap-2 text-gray-800">
                    <MdHelp className="text-[#bf0000]" /> よくある質問
                </h1>

                <div className="space-y-6">
                    {faqs.map((item, index) => (
                        <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                            <h3 className="font-bold text-lg text-gray-800 mb-2 flex items-start gap-2">
                                <span className="text-[#bf0000] font-black">Q.</span> {item.q}
                            </h3>
                            <p className="text-gray-600 pl-6 leading-relaxed flex items-start gap-2">
                                <span className="font-bold text-gray-400">A.</span> {item.a}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
