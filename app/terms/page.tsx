"use client";
import React from 'react';
import { MdDescription } from 'react-icons/md';

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 text-gray-700">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold mb-10 flex items-center gap-2 text-gray-800 border-b pb-4">
                    <MdDescription className="text-[#bf0000]" /> 利用規約
                </h1>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第1条（適用）</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            本規約は、株式会社ルームシェアネクスト（以下「当社」）が提供する「ルームシェアネクスト」（以下「本サービス」）の利用条件を定めるものです。登録ユーザーの皆さまには、本規約に従って本サービスをご利用いただきます。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第2条（利用登録）</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            登録希望者が当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
                        </p>
                        <ul className="list-disc list-inside mt-2 text-sm text-gray-600 pl-4 space-y-1">
                            <li>虚偽の事項を届け出た場合</li>
                            <li>本規約に違反したことがある者からの申請である場合</li>
                            <li>その他、当社が利用登録を相当でないと判断した場合</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第3条（禁止事項）</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
                        </p>
                        <ul className="list-disc list-inside mt-2 text-sm text-gray-600 pl-4 space-y-1">
                            <li>法令または公序良俗に違反する行為</li>
                            <li>犯罪行為に関連する行為</li>
                            <li>本サービスの内容等、本サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為</li>
                            <li>他のユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                            <li>営業、宣伝、広告、勧誘、その他営利を目的とする行為（当社の認めたものを除く）</li>
                            <li>他のユーザーに対する嫌がらせや誹謗中傷はおやめください</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第4条（免責事項）</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t text-right text-xs text-gray-400">
                    2024年12月15日 制定
                </div>
            </div>
        </div>
    );
}
