// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 1. Import Inter
import "./globals.css";

// 作成したコンポーネントをインポート
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileGuard from "@/components/ProfileGuard";

const inter = Inter({ subsets: ["latin"] }); // 2. Init Inter

export const metadata: Metadata = {
  metadataBase: new URL("https://roommikke.jp"), // Fix for relative URLs
  alternates: {
    canonical: "./", // Auto-generates self-referencing canonical
  },
  title: "ルームシェア探しならルームシェアmikke",
  description: "登録料・手数料無料！ルームミッケは、相性診断で自分に合うルームメイトが見つかる掲示板サイトです。東京エリアを中心に、ペット可、女性専用などこだわりの条件でお部屋探しができます。",
  keywords: "ルームシェア, 部屋探し, 無料, 東京, シェアハウス, ゲストハウス, ルームメイト募集",
  openGraph: {
    title: "ルームシェア探しならルームシェアmikke",
    description: "登録料・手数料無料！相性診断で自分に合うルームメイトが見つかる掲示板サイト。",
    url: "https://roommikke.jp",
    siteName: "ルームシェアmikke",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}> {/* 3. Use inter.className */}
        <div className="min-h-screen flex flex-col bg-[#fcfbf7]">
          {/* ProfileGuard: Checks logic and redirects if needed */}
          <ProfileGuard>
            <Header />

            {/* 各ページの中身（page.tsx）はここに挿入されます */}
            <main className="flex-grow">
              {children}
            </main>

            <Footer />
          </ProfileGuard>
        </div>
      </body>
    </html>
  );
}