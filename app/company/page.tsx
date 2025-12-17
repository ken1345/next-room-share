"use client";
import React from 'react';
import Link from 'next/link';
import { MdPerson } from 'react-icons/md';

export default function CompanyPage() {
    return (
        <div className="container mx-auto px-4 py-16 text-gray-700">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-gray-800">
                    <MdPerson className="text-[#bf0000]" /> 運営管理人
                </h1>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">運営者プロフィール</h2>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Optional: Add a placeholder image or remove if not needed */}
                            <div className="bg-gray-100 p-6 rounded-lg flex-1">
                                <p className="font-bold text-lg mb-1">佐藤 恒一（さとう こういち）</p>
                                <p className="text-sm text-gray-500 mb-4">Web運営・コミュニティ運営 / 東京都在住</p>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    自分自身も上京時にルームシェアで助けられた経験があり、「安心して相手を探せる掲示板がもっと必要だ」と感じて本サイトを立ち上げました。
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    この掲示板では、募集する側・探す側のどちらにとっても不安が少なくなるように、投稿ルールの整備、迷惑投稿のチェック、改善要望の反映を地道に続けています。
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    「いい相手が見つかった」「内見前に不安が解消できた」みたいな声が増えるのが一番のやりがいです。
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">運営情報</h2>
                        <dl className="grid grid-cols-1 gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-50 pb-2">
                                <dt className="font-bold text-gray-600">所在地（公開範囲）</dt>
                                <dd className="col-span-2 text-gray-800">
                                    東京都（23区内）<br />

                                </dd>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-50 pb-2">
                                <dt className="font-bold text-gray-600">お問い合わせ</dt>
                                <dd className="col-span-2 text-gray-800">
                                    <div className="mb-2">
                                        <span className="font-bold text-sm block text-gray-500">フォーム</span>
                                        <Link href="/contact" className="text-[#bf0000] hover:underline">
                                            https://roommikke.jp/contact
                                        </Link>
                                    </div>

                                </dd>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-50 pb-2">
                                <dt className="font-bold text-gray-600">対応時間</dt>
                                <dd className="col-span-2 text-gray-800">平日 19:00〜22:00（目安）</dd>
                            </div>
                        </dl>
                    </section>
                </div>
            </div>
        </div>
    );
}
