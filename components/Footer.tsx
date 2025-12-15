import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10 text-center text-sm mt-auto">
      <div className="container mx-auto px-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
        <div>
          <h4 className="font-bold mb-2 text-white">ルームシェアmikkeについて</h4>
          <Link href="/company" className="block cursor-pointer hover:text-white mb-1">運営会社</Link>
          <Link href="/terms" className="block cursor-pointer hover:text-white">利用規約</Link>
        </div>
        <div>
          <h4 className="font-bold mb-2 text-white">ヘルプ</h4>
          <Link href="/faq" className="block cursor-pointer hover:text-white mb-1">よくある質問</Link>
          <Link href="/contact" className="block cursor-pointer hover:text-white">お問い合わせ</Link>
        </div>
      </div>
      <p>&copy; 2024 ルームシェアmikke</p>
    </footer>
  );
}