import React from 'react';
import { MdSecurity } from 'react-icons/md';

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-700">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <MdSecurity className="text-[#bf0000]" /> プライバシーポリシー
            </h1>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2">1. 個人情報の収集について</h2>
                    <p>当社は、サービス提供にあたり必要な範囲で個人情報を収集します。</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2">2. 利用目的</h2>
                    <p>収集した個人情報は、本サービスの提供、運営、改善のために利用します。</p>
                </section>
                <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2">3. 第三者への提供</h2>
                    <p>法令に基づく場合を除き、同意なく第三者に提供することはありません。</p>
                </section>
                <p className="text-sm text-gray-500 mt-8">これはプレースホルダーです。実際の運用に合わせて内容を修正してください。</p>
            </div>
        </div>
    );
}
