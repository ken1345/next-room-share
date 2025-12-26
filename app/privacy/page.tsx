import React from 'react';
import { MdSecurity } from 'react-icons/md';

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-700">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <MdSecurity className="text-[#bf0000]" /> プライバシーポリシー
            </h1>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">

                <div className="text-right text-sm text-gray-500">
                    最終更新日: 2025年12月26日
                </div>

                <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2">1. 個人情報の収集</h2>
                    <p className="leading-relaxed">
                        当サービスでは、ユーザーが本サービスを利用する際に、氏名、メールアドレス、性別、年齢、職業などの個人情報を収集する場合があります。
                        また、端末情報やログ情報、Cookie等の技術を利用して情報を収集することがあります。
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2">2. 個人情報の利用目的</h2>
                    <p className="mb-2">収集した個人情報は、以下の目的で利用します。</p>
                    <ul className="list-none space-y-1 pl-4 text-gray-600">
                        <li>・本サービスの提供・運営のため</li>
                        <li>・ユーザーからのお問い合わせへの対応のため</li>
                        <li>・本サービスの利用規約に違反する行為への対応のため</li>
                        <li>・メンテナンス、重要なお知らせなど必要に応じたご連絡のため</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2">3. 個人情報の第三者提供</h2>
                    <p className="mb-2">
                        当運営者は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。
                    </p>
                    <ul className="list-none space-y-1 pl-4 text-gray-600">
                        <li>・法令に基づく場合</li>
                        <li>・人の生命、身体または財産の保護のために必要がある場合</li>
                        <li>・公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2">4. 生成AIの利用について</h2>
                    <p className="leading-relaxed">
                        本サービスでは、投稿内容の健全性確認（不適切なコンテンツのフィルタリング）のために、OpenAI社等の提供する生成AIサービスを利用し、入力されたテキストデータを送信する場合があります。
                        なお、このデータは学習データとして利用されない設定（オプトアウト）で利用されます。
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2">5. 個人情報の開示・訂正・削除</h2>
                    <p className="leading-relaxed">
                        ユーザーは、当運営者の定める手続きにより、自己の個人情報の開示、訂正、削除を請求することができます。
                        アプリ内のアカウント設定画面より、退会（アカウント削除）を行うことで、個人情報を削除することが可能です。
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-3 border-b pb-2">6. お問い合わせ窓口</h2>
                    <p className="leading-relaxed">
                        本ポリシーに関するお問い合わせは、アプリ内のお問い合わせフォームよりお願いいたします。
                    </p>
                </section>

            </div>
        </div>
    );
}
