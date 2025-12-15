"use client";
import React from 'react';
import Link from 'next/link';
import { MdHome, MdTimeline, MdCheckCircle } from 'react-icons/md';

const TIMELINE_STEPS = [
    {
        phase: "【1〜2ヶ月前】準備・物件探し",
        steps: [
            { title: "希望条件の整理", desc: "エリア、予算、絶対譲れない条件（個室必須など）を決めましょう。" },
            { title: "物件検索・問い合わせ", desc: "気になった物件には早めに問い合わせを。人気物件はすぐ埋まります。" },
            { title: "内見予約", desc: "実際に足を運んで確認するのがベスト。オンライン内見も活用しましょう。" }
        ],
        color: "border-orange-500 bg-orange-50 text-orange-800"
    },
    {
        phase: "【2週間〜1ヶ月前】契約・引越し手配",
        steps: [
            { title: "入居申込み・審査", desc: "本人確認書類や収入証明が必要になる場合があります。" },
            { title: "賃貸借契約の締結", desc: "重要事項説明を受け、契約書にサインします。初期費用の振込もこの時期。" },
            { title: "引越し業者の手配", desc: "3〜4月は繁忙期なので早めの予約を。荷物が少ないならレンタカーもあり。" },
            { title: "現在住んでいる家の解約", desc: "退去予告は1ヶ月前までが多いです。契約書を確認しましょう。" }
        ],
        color: "border-blue-500 bg-blue-50 text-blue-800"
    },
    {
        phase: "【1週間前】各種手続き",
        steps: [
            { title: "転出届の提出", desc: "現住所の役所で手続きします（マイナンバーカードがあればオンライン可の場合も）。" },
            { title: "郵便物の転送届", desc: "郵便局で手続きしておけば、旧住所宛の郵便物を新居に転送してくれます。" },
            { title: "ライフラインの手続き", desc: "電気・ガス・水道の解約・開始手続き。シェアハウスの場合は不要なことも多いので確認を。" }
        ],
        color: "border-green-500 bg-green-50 text-green-800"
    },
    {
        phase: "【当日〜入居後】新生活スタート",
        steps: [
            { title: "鍵の受け取り・入居", desc: "管理人の立ち会いがある場合は時間を守りましょう。" },
            { title: "転入届の提出", desc: "引越しから14日以内に新住所の役所で手続きが必要です。" },
            { title: "ハウスルールの確認", desc: "ゴミ出しの日や共有スペースの使い方など、早めに把握してトラブル回避。" },
            { title: "シェアメイトへの挨拶", desc: "「これからよろしくお願いします」の一言があるだけで、その後の関係がスムーズに。" }
        ],
        color: "border-pink-500 bg-pink-50 text-pink-800"
    }
];

export default function TimelinePage() {
    return (
        <div className="min-h-screen bg-[#fcfbf7] p-8">
            <Link href="/" className="text-gray-500 hover:text-[#bf0000] flex items-center gap-1 font-bold mb-8">
                <MdHome size={20} /> ホームに戻る
            </Link>

            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 mb-8">
                    <div className="bg-orange-50 p-8 text-center border-b border-orange-100">
                        <MdTimeline className="mx-auto text-orange-500 mb-4" size={64} />
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">引越しタイムライン</h1>
                        <p className="text-gray-500 font-bold">いつ何をする？入居までの流れを完全ガイド</p>
                    </div>

                    <div className="p-8 md:p-12 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-12 top-12 bottom-12 w-1 bg-gray-200 hidden md:block" />

                        <div className="space-y-12">
                            {TIMELINE_STEPS.map((phase, idx) => (
                                <div key={idx} className="relative md:pl-12">
                                    {/* Dot */}
                                    <div className="absolute left-0 top-0 w-6 h-6 bg-white border-4 border-gray-300 rounded-full z-10 hidden md:block -ml-[11px]" />

                                    <div className={`rounded-xl border-l-4 p-4 md:p-6 mb-6 ${phase.color}`}>
                                        <h2 className="text-xl font-bold">{phase.phase}</h2>
                                    </div>

                                    <div className="space-y-6">
                                        {phase.steps.map((step, sIdx) => (
                                            <div key={sIdx} className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm flex gap-4">
                                                <div className="text-[#bf0000] mt-1 shrink-0">
                                                    <MdCheckCircle size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-800 mb-2">{step.title}</h3>
                                                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
