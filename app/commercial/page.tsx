import React from 'react';
import { MdStore } from 'react-icons/md';

export default function CommercialPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-700">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <MdStore className="text-[#bf0000]" /> 特定商取引法に基づく表記
            </h1>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <table className="w-full border-collapse">
                    <tbody>
                        <tr className="border-b">
                            <th className="py-4 text-left font-bold w-1/3">事業者の名称</th>
                            <td className="py-4">株式会社ルームシェアmikke</td>
                        </tr>
                        <tr className="border-b">
                            <th className="py-4 text-left font-bold w-1/3">代表者氏名</th>
                            <td className="py-4">代表取締役 山田 太郎</td>
                        </tr>
                        <tr className="border-b">
                            <th className="py-4 text-left font-bold w-1/3">所在地</th>
                            <td className="py-4">〒150-0000 東京都渋谷区...</td>
                        </tr>
                        <tr className="border-b">
                            <th className="py-4 text-left font-bold w-1/3">お問い合わせ</th>
                            <td className="py-4">support@example.com</td>
                        </tr>
                        <tr className="border-b">
                            <th className="py-4 text-left font-bold w-1/3">販売価格</th>
                            <td className="py-4">各物件ページに記載</td>
                        </tr>
                    </tbody>
                </table>
                <p className="text-sm text-gray-500 mt-8">これはプレースホルダーです。実際の運用に合わせて内容を修正してください。</p>
            </div>
        </div>
    );
}
