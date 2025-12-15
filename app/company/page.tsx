"use client";
import React from 'react';
import Link from 'next/link';
import { MdBusiness } from 'react-icons/md';

export default function CompanyPage() {
    return (
        <div className="container mx-auto px-4 py-16 text-gray-700">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-gray-800">
                    <MdBusiness className="text-[#bf0000]" /> 運営会社
                </h1>

                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <tbody>
                            <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
                                <th className="py-4 px-6 bg-gray-50 font-bold w-1/3 text-gray-600">会社名</th>
                                <td className="py-4 px-6">株式会社ルームシェアネクスト</td>
                            </tr>
                            <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
                                <th className="py-4 px-6 bg-gray-50 font-bold text-gray-600">設立</th>
                                <td className="py-4 px-6">2024年4月1日</td>
                            </tr>
                            <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
                                <th className="py-4 px-6 bg-gray-50 font-bold text-gray-600">代表者</th>
                                <td className="py-4 px-6">代表取締役 山田 太郎</td>
                            </tr>
                            <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
                                <th className="py-4 px-6 bg-gray-50 font-bold text-gray-600">所在地</th>
                                <td className="py-4 px-6">〒100-0000<br />東京都千代田区1-1-1 シェアビルディング 10F</td>
                            </tr>
                            <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
                                <th className="py-4 px-6 bg-gray-50 font-bold text-gray-600">事業内容</th>
                                <td className="py-4 px-6">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>ルームシェア・シェアハウスのマッチングプラットフォーム運営</li>
                                        <li>不動産情報の提供・仲介</li>
                                        <li>コミュニティ形成支援</li>
                                    </ul>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition">
                                <th className="py-4 px-6 bg-gray-50 font-bold text-gray-600">お問い合わせ</th>
                                <td className="py-4 px-6">
                                    <Link href="/contact" className="text-[#bf0000] hover:underline font-bold">
                                        お問い合わせフォーム
                                    </Link>よりご連絡ください
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
