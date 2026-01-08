"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { MdHome, MdPlaylistAddCheck, MdCheckBox, MdCheckBoxOutlineBlank, MdPrint } from 'react-icons/md';

const CHECKLIST_ITEMS = [
    {
        category: "共用部分（リビング・玄関・廊下）",
        items: [
            "玄関のセキュリティ（オートロック、鍵の種類は？）",
            "郵便受け・宅配ボックスの有無と管理状況",
            "駐輪場の有無と空き状況、料金",
            "ゴミ捨て場の場所と管理状況（汚くないか？）",
            "リビングの広さと雰囲気（住人がくつろいでいるか？）",
            "靴箱のスペースは十分か？"
        ]
    },
    {
        category: "水回り（キッチン・バス・トイレ）",
        items: [
            "キッチンの使い勝手（コンロ数、調理スペース）",
            "冷蔵庫の容量と個人の保管スペース",
            "お風呂の清潔さと追い焚き機能の有無",
            "シャワーの水圧は十分か？",
            "トイレの数（住人数に対して適正か？）",
            "洗濯機の数と乾燥機の有無",
            "洗面所の数と混雑しそうな時間帯"
        ]
    },
    {
        category: "個室・専有部分",
        items: [
            "部屋の広さと家具の配置イメージ",
            "日当たりと風通し",
            "収納スペースの大きさ",
            "壁の薄さ・防音性（隣の部屋の音が聞こえないか？）",
            "コンセントの位置と数",
            "エアコンの型式（古すぎないか？）",
            "窓からの景色と外からの視線",
            "スマホの電波状況"
        ]
    },
    {
        category: "周辺環境・ルール・その他",
        items: [
            "最寄駅からの実際の徒歩時間と道の明るさ",
            "近くにスーパー・コンビニなどはあるか？",
            "ハウスルール（掃除当番、門限、友人の宿泊など）",
            "住人の年齢層や雰囲気",
            "管理人の巡回頻度",
            "初期費用と退去時の費用の詳細"
        ]
    }
];

export default function ChecklistPage() {
    const [checkedState, setCheckedState] = useState<{ [key: string]: boolean }>({});

    const toggleCheck = (item: string) => {
        setCheckedState(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-[#fcfbf7] p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8 no-print">
                    <Link href="/" className="text-gray-500 hover:text-[#bf0000] flex items-center gap-1 font-bold">
                        <MdHome size={20} /> ホームに戻る
                    </Link>
                    <button onClick={handlePrint} className="flex items-center gap-2 bg-gray-800 text-white font-bold px-4 py-2 rounded-lg hover:opacity-80 transition">
                        <MdPrint /> 印刷する
                    </button>
                </div>

                <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 mb-8 print:shadow-none print:border-none">
                    <div className="bg-blue-50 p-8 text-center border-b border-blue-100 print:bg-white print:text-left print:p-0 print:mb-4">
                        <MdPlaylistAddCheck className="mx-auto text-blue-500 mb-4 print:hidden" size={64} />
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">内見チェックリスト 30</h1>
                        <p className="text-gray-500 font-bold print:hidden">スマホでチェックしながら内見しよう！</p>
                    </div>

                    <div className="p-8 space-y-8 print:p-0">
                        {CHECKLIST_ITEMS.map((section, idx) => (
                            <div key={idx}>
                                <h2 className="text-xl font-bold text-blue-600 border-b-2 border-blue-100 pb-2 mb-4">
                                    {section.category}
                                </h2>
                                <div className="space-y-3">
                                    {section.items.map((item, itemIdx) => (
                                        <div
                                            key={itemIdx}
                                            onClick={() => toggleCheck(item)}
                                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition group"
                                        >
                                            <div className="mt-1 text-gray-400 group-hover:text-blue-500">
                                                {checkedState[item] ? (
                                                    <MdCheckBox size={24} className="text-blue-500" />
                                                ) : (
                                                    <MdCheckBoxOutlineBlank size={24} />
                                                )}
                                            </div>
                                            <span className={`font-bold ${checkedState[item] ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center text-gray-400 text-sm no-print mb-8">
                    ※このページは印刷して持ち歩くこともできます
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    .no-print { display: none; }
                    body { background: white; }
                    .min-h-screen { min-height: auto; }
                }
            `}</style>
        </div>
    );
}
