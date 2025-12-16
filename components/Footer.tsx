import Link from 'next/link';
import { MdHome, MdLocationOn, MdTrain, MdVpnKey, MdSms, MdSecurity, MdStore, MdHelp, MdEmail, MdInfo } from 'react-icons/md';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 text-sm mt-auto font-sans">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Column 1: Brand & Tagline */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-white">
            {/* Use the same logo logic as header if possible, or just text/icon */}
            <MdHome size={32} className="text-[#bf0000]" />
            <span className="text-xl font-bold tracking-tight">ルームシェアmikke</span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            日本最大級のルームシェア・シェアハウス募集サイト。<br />
            あなたにぴったりの共同生活がここから始まります。
          </p>
        </div>

        {/* Column 2: Search */}
        <div>
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <MdLocationOn className="text-[#bf0000]" /> 部屋を探す
          </h3>
          <ul className="space-y-3">
            <li>
              <Link href="/search?mode=area" className="hover:text-white transition flex items-center gap-2">
                <MdLocationOn className="text-gray-600" /> エリアから探す
              </Link>
            </li>
            <li>
              <Link href="/search?mode=station" className="hover:text-white transition flex items-center gap-2">
                <MdTrain className="text-gray-600" /> 沿線・駅から探す
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-white transition flex items-center gap-2">
                <MdHome className="text-gray-600" /> すべての物件を見る
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Host */}
        <div>
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <MdVpnKey className="text-[#bf0000]" /> 部屋を貸す
          </h3>
          <ul className="space-y-3">
            <li>
              <Link href="/host" className="hover:text-white transition flex items-center gap-2">
                <MdVpnKey className="text-gray-600" /> 募集を掲載する
              </Link>
            </li>
            <li>
              <Link href="/host?guide=true" className="hover:text-white transition flex items-center gap-2">
                <MdInfo className="text-gray-600" /> 掲載の流れ（ガイド）
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Support & Legal */}
        <div>
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <MdHelp className="text-[#bf0000]" /> サポート・規約
          </h3>
          <ul className="space-y-3">
            <li>
              <Link href="/company" className="hover:text-white transition flex items-center gap-2">
                <MdStore className="text-gray-600" /> 運営会社
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition flex items-center gap-2">
                <MdSecurity className="text-gray-600" /> 利用規約
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition flex items-center gap-2">
                <MdSecurity className="text-gray-600" /> プライバシーポリシー
              </Link>
            </li>
            <li>
              <Link href="/commercial" className="hover:text-white transition flex items-center gap-2">
                <MdStore className="text-gray-600" /> 特定商取引法に基づく表記
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-white transition flex items-center gap-2">
                <MdHelp className="text-gray-600" /> よくある質問
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition flex items-center gap-2">
                <MdEmail className="text-gray-600" /> お問い合わせ
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} ルームシェアmikke All Rights Reserved.</p>
      </div>
    </footer>
  );
}