// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 作成したコンポーネントをインポート
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RoomShare App",
  description: "ルームシェア募集サイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-[#fcfbf7]">
          {/* ここに書くと全ページで表示されます */}
          <Header />
          
          {/* 各ページの中身（page.tsx）はここに挿入されます */}
          <main className="flex-grow">
            {children}
          </main>
          
          {/* ここに書くと全ページで表示されます */}
          <Footer />
        </div>
      </body>
    </html>
  );
}