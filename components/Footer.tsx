
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 font-sans border-t border-gray-200 mt-auto">

      {/* Main Footer Links - Hidden on Mobile */}
      <div className="hidden md:block container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Column 2: Search */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">部屋を探す</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/search?tab=area" className="hover:underline">エリアから探す</Link></li>
              <li><Link href="/search?tab=station" className="hover:underline">沿線・駅から探す</Link></li>
              <li><Link href="/search" className="hover:underline">すべての物件一覧</Link></li>
            </ul>
          </div>

          {/* Column 3: Host */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">部屋を貸す・募集する</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/host" className="hover:underline">募集を掲載する（無料）</Link></li>
              <li><Link href="/guide/host" className="hover:underline">掲載ガイド</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">サポート</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/contact" className="hover:underline">お問い合わせ</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Legal & Copy */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm gap-4">

          {/* Left: Legal Links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
            <span>&copy; {new Date().getFullYear()} RoomShare Mikke</span>

            {/* Legal links hidden on mobile */}
            <div className="hidden md:contents">
              <span className="hidden md:inline">·</span>
              <Link href="/privacy" className="hover:underline">プライバシー</Link>
              <span className="hidden md:inline">·</span>
              <Link href="/terms" className="hover:underline">利用規約</Link>
              <span className="hidden md:inline">·</span>
              <Link href="/company" className="hover:underline">運営者情報</Link>
            </div>
          </div>

          {/* Right: Social / Language (Placeholder) */}
          <div className="hidden md:flex items-center gap-4 font-bold text-gray-900">
            {/* Right content (if added in future) */}
          </div>
        </div>
      </div>
    </footer>
  );
}