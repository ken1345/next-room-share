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
          {process.env.SITE_MAINTENANCE_MODE !== "off" && (
            <aside aria-label="サービスのお知らせ" className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <div className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-3 gap-y-1">
                <strong>ただいまメンテナンス中です</strong>
                <p>一部の物件情報を表示できない場合があります。時間をおいて再度お試しください。</p>
              </div>
            </aside>
          )}
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
