// components/Header.tsx
"use client";

import Link from "next/link";
import { MdHome, MdPerson } from "react-icons/md";
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="bg-white border-b py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* ロゴ部分：クリックでトップへ戻る */}
        <Link href="/" className="text-2xl font-bold text-[#bf0000] flex items-center gap-2 hover:opacity-80 transition">
          <MdHome /> RoomShare
        </Link>

        {/* Desktop Navigation */}
        {!loading && (
          <div className="flex gap-4 text-sm font-bold text-gray-600 items-center">
            <Link href="/stories" className="hover:text-[#bf0000] transition">体験談</Link>
            <Link href="/host" className="hover:text-[#bf0000] transition">掲載・管理</Link>

            {user ? (
              // Logged In
              <Link href="/account" className="flex items-center gap-1 hover:text-[#bf0000] transition ml-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <MdPerson size={20} />
                  )}
                </div>
                <span className="hidden md:inline">アカウント</span>
              </Link>
            ) : (
              // Logged Out
              <>
                <Link href="/signup" className="hover:text-[#bf0000] transition">新規登録</Link>
                <Link href="/login" className="bg-[#bf0000] text-white px-4 py-2 rounded-full hover:bg-black transition">ログイン</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}