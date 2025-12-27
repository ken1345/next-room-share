"use client";
import React from 'react';
import Link from 'next/link';
import { MdDescription } from 'react-icons/md';

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 text-gray-700">
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-gray-800 border-b pb-4">
                    <MdDescription className="text-[#bf0000]" /> 利用規約
                </h1>

                <div className="text-right text-sm text-gray-500 mb-8">
                    最終更新日: 2025年12月27日
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
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第5条（本サービスの停止等）</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            当運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1 pl-4 mt-2 list-disc list-inside">
                            <li>本サービスにかかるコンピュータシステムの保守点検または更新を行う場合</li>
                            <li>地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合</li>
                            <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                            <li>その他、当運営者が本サービスの提供が困難と判断した場合</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第6条（権利帰属）</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            本サービス内の文章、画像、プログラムその他一切のコンテンツ（ユーザーが投稿したものを除く）の知的財産権は、当運営者または正当な権利者に帰属します。
                            ユーザーは、自ら投稿したデータについて、適法な権利を有していること、および第三者の権利を侵害していないことを保証するものとします。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第7条（登録抹消等）</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            当運営者は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします。
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1 pl-4 mt-2 list-disc list-inside">
                            <li>本規約のいずれかの条項に違反した場合</li>
                            <li>登録事項に虚偽の事実があることが判明した場合</li>
                            <li>その他、当運営者が本サービスの利用を適当でないと判断した場合</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第8条（秘密保持）</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            ユーザーは、本サービスに関連して得た他のユーザーの個人情報（氏名、連絡先、住所等）を、本サービスの利用目的以外に使用してはならず、第三者に開示または漏洩してはなりません。これは、退会後も同様とします。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第9条（ユーザーの賠償等の責任）</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            ユーザーは、本規約に違反することにより、又は本サービスの利用に関連して当運営者に損害を与えた場合、当運営者に対しその損害を賠償しなければなりません。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第10条（保証の否認及び免責事項）</h2>
                        <p className="text-sm leading-relaxed text-gray-600 mb-2">
                            当運営者は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
                        </p>
                        <p className="text-sm leading-relaxed text-gray-600 mb-2">
                            当運営者は、当運営者の故意または重過失による場合を除き、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。
                        </p>
                        <p className="text-sm leading-relaxed text-gray-600">
                            本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第11条（サービスの変更等）</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            当運営者は、本サービスの内容を自由に変更できるものとします。
                            また、本規約を変更する場合、変更後の規約は本ウェブサイト上に表示した時点より効力を生じるものとします。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第12条（登録ユーザーの情報の取扱い）</h2>
                        <p className="text-sm leading-relaxed text-gray-600 mb-2">
                            当運営者は本サービスにおいて、メールアドレス等の個人情報を取得する場合があります。当運営者によるユーザーの個人情報の取扱いについては、別途<Link href="/privacy" className="text-[#bf0000] hover:underline">プライバシーポリシー</Link>の定めによるものとし、ユーザーはこのプライバシーポリシーに従って当運営者がユーザーの個人情報を取扱うことについて同意するものとします。
                        </p>
                        <p className="text-sm leading-relaxed text-gray-600">
                            当運営者は、ユーザーが提供した情報、データ等を、Google Analyticsその他の解析ツールを利用して解析することがあるものとし、ユーザーはこれに異議を唱えないものとします。
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3 text-gray-800">第13条（有効期間）</h2>
                        <p className="text-sm leading-relaxed text-gray-600">
                            利用契約は、ユーザーについて第2条に基づく登録が完了した日に効力を生じ、当該ユーザーの登録が取り消された日又は本サービスの提供が終了した日のいずれか早い日まで、当運営者とユーザーとの間で有効に存続するものとします。
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
