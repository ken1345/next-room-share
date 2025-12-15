// components/Header.tsx
"use client";

import Link from "next/link";
import { MdHome, MdPerson } from "react-icons/md";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="bg-white border-b py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* ロゴ部分：クリックでトップへ戻る */}
        <Link href="/" className="text-2xl font-bold text-[#bf0000] flex items-center gap-2 hover:opacity-80 transition">
          <MdHome /> ルームシェアネクスト
        </Link>

        {/* Desktop Navigation */}
        {!loading && (
          <div className="flex gap-4 text-sm font-bold text-gray-600 items-center">


            {user ? (
              // Logged In
              <Link href="/account" className="flex items-center gap-1 hover:text-[#bf0000] transition ml-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
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