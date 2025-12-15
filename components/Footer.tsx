// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-10 text-center text-sm mt-auto">
      <div className="container mx-auto px-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
        <div>
          <h4 className="font-bold mb-2 text-white">ルームシェアネクストについて</h4>
          <p className="cursor-pointer hover:text-white">運営会社</p>
          <p className="cursor-pointer hover:text-white">利用規約</p>
        </div>
        <div>
          <h4 className="font-bold mb-2 text-white">ヘルプ</h4>
          <p className="cursor-pointer hover:text-white">よくある質問</p>
          <p className="cursor-pointer hover:text-white">お問い合わせ</p>
        </div>
      </div>
      <p>&copy; 2024 ルームシェアネクスト</p>
    </footer>
  );
}