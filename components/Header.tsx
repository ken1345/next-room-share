// components/Header.tsx
"use client";

import Link from "next/link";
import { MdHome } from "react-icons/md";

export default function Header() {
  return (
    <header className="bg-white border-b py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* ロゴ部分：クリックでトップへ戻る */}
        <Link href="/" className="text-2xl font-bold text-[#bf0000] flex items-center gap-2 hover:opacity-80 transition">
          <MdHome /> RoomShare
        </Link>

        <div className="flex gap-4 text-sm font-bold text-gray-600">
          <Link href="/stories" className="hover:text-[#bf0000] transition">体験談</Link>
          <Link href="/host" className="hover:text-[#bf0000] transition">掲載・管理</Link>
          <Link href="/signup" className="hover:text-[#bf0000] transition">新規登録</Link>
          <Link href="/login" className="hover:text-[#bf0000] transition">ログイン</Link>
          <Link href="/account" className="hover:text-[#bf0000] transition">アカウント</Link>
        </div>
      </div>
    </header>
  );
}