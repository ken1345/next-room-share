// components/Header.tsx
"use client";

import Link from "next/link";
import { MdHome, MdPerson, MdMail, MdMenu, MdClose, MdPhoneIphone } from "react-icons/md"; // Added icons
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state

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

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const iosAppUrl = "https://apps.apple.com/jp/app/%E3%83%AB%E3%83%BC%E3%83%A0%E3%82%B7%E3%82%A7%E3%82%A2mikke-%E7%90%86%E6%83%B3%E3%81%AE%E3%82%B7%E3%82%A7%E3%82%A2%E3%83%A9%E3%82%A4%E3%83%95%E3%82%92%E8%A6%8B%E3%81%A4%E3%81%91%E3%82%88%E3%81%86/id6757091934";
  const androidAppUrl = "https://play.google.com/store/apps/details?id=com.roomshare.mikke&pcampaignid=web_share";

  return (
    <header className="bg-white border-b py-0 relative z-50">
      <div className="container mx-auto px-4 flex justify-between items-center h-20 md:h-24">
        {/* ロゴ部分：クリックでトップへ戻る */}
        <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition h-full" onClick={closeMobileMenu}>
          <img src="/logo.webp" alt="ロゴ" className="h-full w-auto object-contain py-4" />
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-[#bf0000] focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <MdClose size={32} /> : <MdMenu size={32} />}
        </button>

        {/* Desktop Navigation */}
        {!loading && (
          <div className="hidden md:flex gap-4 text-sm font-bold text-gray-600 items-center">
            <a href={androidAppUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition flex items-center h-10 w-auto">
              <img src="/GetItOnGooglePlay_Badge_Web_color_Japanese.png" alt="Get it on Google Play" className="h-full w-auto object-contain" />
            </a>
            <a href={iosAppUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition flex items-center h-10 w-auto">
              <img src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/white/ja-jp?releaseDate=1768089600" alt="Download on the App Store" className="h-full w-auto object-contain" />
            </a>
            <Link href="/search" className="hover:text-[#bf0000] transition">部屋を探す</Link>
            <Link href="/host" className="hover:text-[#bf0000] transition">部屋を貸す</Link>

            {user ? (
              // Logged In
              <>
                <Link href="/messages" className="flex items-center gap-1 hover:text-[#bf0000] transition ml-2">
                  <div className="relative">
                    <MdMail size={22} className="text-gray-600" />
                    {/* Badge logic could go here */}
                  </div>
                  <span className="hidden md:inline">メッセージ</span>
                </Link>
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
              </>
            ) : (
              // Logged Out
              <>
                <Link href="/signup" className="hover:text-[#bf0000] transition">新規登録</Link>
                <Link href="/login" className="bg-[#bf0000] text-white px-4 py-2 rounded-full hover:bg-[#990000] transition">ログイン</Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && !loading && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-lg flex flex-col p-4 gap-4 font-bold text-gray-700 animate-in slide-in-from-top-2">
          <a href={androidAppUrl} target="_blank" rel="noopener noreferrer" className="block py-2 border-b border-gray-100 hover:opacity-80 flex items-center h-12 w-auto" onClick={closeMobileMenu}>
            <img src="/GetItOnGooglePlay_Badge_Web_color_Japanese.png" alt="Get it on Google Play" className="h-full w-auto object-contain" />
          </a>
          <a href={iosAppUrl} target="_blank" rel="noopener noreferrer" className="block py-2 border-b border-gray-100 hover:opacity-80 flex items-center h-12 w-auto" onClick={closeMobileMenu}>
            <img src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/white/ja-jp?releaseDate=1768089600" alt="Download on the App Store" className="h-full w-auto object-contain" />
          </a>
          <Link href="/search" className="block py-2 border-b border-gray-100 hover:text-[#bf0000]" onClick={closeMobileMenu}>
            部屋を探す
          </Link>
          <Link href="/host" className="block py-2 border-b border-gray-100 hover:text-[#bf0000]" onClick={closeMobileMenu}>
            部屋を貸す
          </Link>

          {user ? (
            <>
              <Link href="/messages" className="block py-2 border-b border-gray-100 hover:text-[#bf0000] flex items-center gap-2" onClick={closeMobileMenu}>
                <MdMail size={20} /> メッセージ
              </Link>
              <Link href="/account" className="block py-2 hover:text-[#bf0000] flex items-center gap-2" onClick={closeMobileMenu}>
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <MdPerson size={16} />
                  )}
                </div>
                アカウント
              </Link>
            </>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              <Link href="/signup" className="block text-center py-2 border border-[#bf0000] text-[#bf0000] rounded-full hover:bg-red-50" onClick={closeMobileMenu}>
                新規登録
              </Link>
              <Link href="/login" className="block text-center py-2 bg-[#bf0000] text-white rounded-full hover:bg-black" onClick={closeMobileMenu}>
                ログイン
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}