import React from 'react';
import Link from 'next/link';
import { MdLogin, MdEdit, MdPhotoCamera, MdChat, MdCheckCircle, MdHome, MdArrowForward } from 'react-icons/md';

export default function HostGuidePage() {
    const steps = [
        {
            icon: <MdLogin size={40} className="text-[#bf0000]" />,
            title: "1. アカウント登録・ログイン",
            desc: "まずはユーザー登録を行います。Googleアカウントなどで簡単に登録できます。"
        },
        {
            icon: <MdEdit size={40} className="text-[#bf0000]" />,
            title: "2. 物件情報の入力",
            desc: "家賃、最寄り駅、部屋のタイプ（個室・ドミトリー）、入居条件などを入力します。"
        },
        {
            icon: <MdPhotoCamera size={40} className="text-[#bf0000]" />,
            title: "3. 写真のアップロード",
            desc: "お部屋の魅力を伝える写真を掲載しましょう。明るく清潔感のある写真がおすすめです。"
        },
        {
            icon: <MdCheckCircle size={40} className="text-[#bf0000]" />,
            title: "4. 募集開始",
            desc: "入力内容を確認して公開ボタンを押すと、すぐに募集が開始されます。"
        },
        {
            icon: <MdChat size={40} className="text-[#bf0000]" />,
            title: "5. メッセージ・内見",
            desc: "興味を持ったユーザーからメッセージが届きます。内見の日程調整を行いましょう。"
        },
        {
            icon: <MdHome size={40} className="text-[#bf0000]" />,
            title: "6. 合意・シェア開始",
            desc: "条件が合えばシェア成立！新しい生活のスタートです。"
        }
    ];

    return (
        <div className="bg-white font-sans text-gray-700">
            {/* Hero Section */}
            <section className="bg-gray-50 py-16 md:py-24 text-center px-4">
                <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
                    ルームシェア募集の流れ
                </h1>
                <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                    空いている部屋を貸して、家賃収入を得たり、<br className="hidden md:inline" />新しい仲間との交流を楽しみませんか？<br />
                    登録から掲載・募集開始まで、ステップはとてもシンプルです。
                </p>
                <Link
                    href="/host"
                    className="bg-[#bf0000] text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-black transition text-xl flex items-center gap-2 mx-auto w-fit"
                >
                    <MdHome /> 今すぐ掲載をはじめる
                </Link>
            </section>

            {/* Steps Section */}
            <section className="container mx-auto px-4 py-16 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition relative overflow-hidden">
                            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                            <div className="absolute top-4 right-4 text-6xl font-black text-gray-100 -z-10 pointer-events-none opacity-50">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ or Tips Section (Optional) */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8">よくある質問</h2>
                    <div className="space-y-4 text-left">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-bold text-lg mb-2">Q. 掲載に費用はかかりますか？</h3>
                            <p className="text-gray-500">A. 現在、基本機能はすべて無料でご利用いただけます。</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="font-bold text-lg mb-2">Q. 審査はありますか？</h3>
                            <p className="text-gray-500">A. 掲載後のパトロールを行っています。公序良俗に反する内容は削除対象となります。</p>
                        </div>
                    </div>
                    <div className="mt-10">
                        <Link href="/faq" className="text-[#bf0000] font-bold hover:underline flex items-center justify-center gap-1">
                            その他の質問はこちら <MdArrowForward />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-20 text-center px-4">
                <h2 className="text-3xl font-bold mb-6">さあ、ホストになりましょう</h2>
                <p className="text-gray-500 mb-10">あなたの部屋を求めている人がいます。</p>
                <Link
                    href="/host"
                    className="bg-[#bf0000] text-white font-bold py-4 px-12 rounded-full shadow-lg hover:bg-black transition text-xl inline-block"
                >
                    募集掲載スタート
                </Link>
            </section>
        </div>
    );
}
