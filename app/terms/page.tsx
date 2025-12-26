"use client";
import React from 'react';
import { MdDescription } from 'react-icons/md';

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 text-gray-700">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-gray-800 border-b pb-4">
                    <MdDescription className="text-[#bf0000]" /> 利用規約
                </h1>

                <div className="text-right text-sm text-gray-500 mb-8">
                    最終更新日: 2025年12月26日
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第1条（はじめに）</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            この利用規約（以下「本規約」といいます。）は、当運営者が提供するルームシェアマッチングサービス（以下「本サービス」といいます。）の利用条件を定めるものです。
                            登録ユーザーの皆様（以下「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第2条（利用登録）</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            登録希望者が当運営者の定める方法によって利用登録を申請し、当運営者がこれを承認することによって、利用登録が完了するものとします。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第3条（ユーザーIDおよびパスワードの管理）</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。
                            いかなる場合も、ユーザーIDおよびパスワードを第三者に譲渡または貸与することはできません。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第4条（禁止事項）</h2>
                        <p className="text-sm leading-relaxed text-gray-600 mb-2">
                            ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
                        </p>
                        <ul className="text-sm text-gray-600 space-y-2 pl-2">
                            <li>・法令または公序良俗に違反する行為</li>
                            <li>・犯罪行為に関連する行為</li>
                            <li>・詐欺的行為（前払いの要求、外部送金への誘導、身分の偽装、虚偽の物件情報の掲載、別サービスへの誘導など）</li>
                            <li>・人種、国籍、信条、性別、社会的身分、門地等による差別やヘイトスピーチ（属性への侮辱、排除など。ただし、住まいの募集における安全確保のための性別限定を除く）</li>
                            <li>・性的行為の勧誘、露骨な性的表現、未成年者に関する性的内容の投稿</li>
                            <li>・脅迫、暴力行為、危害の予告、個人情報の晒し行為、ストーカー行為またはそれを示唆する行為</li>
                            <li>・個人情報の不適切な掲載（電話番号、LINE ID、住所等を公開の場に直接掲載する行為。※連絡先の交換はマッチング後に段階的に行うことを推奨します）</li>
                            <li>・当運営者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                            <li>・他のユーザーに成りすます行為</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第5条（免責事項）</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            当運営者の債務不履行責任は、当運営者の故意または重過失によらない場合には免責されるものとします。
                            本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t text-sm text-gray-600">
                    本規約に関するお問い合わせは、お問い合わせフォームよりご連絡ください。
                </div>
            </div>
        </div>
    );
}
