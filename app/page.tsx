// app/page.tsx
"use client";
import { useState } from "react";
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  MdHome, MdGroup, MdVpnKey, MdForum, MdLocationOn, MdTrain, MdMap,
  MdPets, MdWifi, MdPublic, MdFemale, MdAttachMoney, MdFiberNew,
  MdCampaign, MdTimer, MdSportsEsports, MdFitnessCenter, MdMovie, MdSpa,
  MdSchool, MdComputer, MdChildCare, MdTranslate,
  MdCalculate, MdPlaylistAddCheck, MdTimeline, MdPsychology, MdAutoStories, MdStar, MdPlace, MdFace,
  MdArrowForward, MdCameraAlt
} from "react-icons/md";
import PhotoPropertyCard from "@/components/PhotoPropertyCard";
// ReviewMapコンポーネントを「SSRなし」で動的に読み込む
const ReviewMap = dynamic(() => import('@/components/ReviewMap'), {
  ssr: false,
  loading: () => <div className="h-[500px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400 font-bold">地図を読み込み中...</div>
});
// ヘッダー・フッターは layout.tsx にあるため省略

export default function Home() {
  return (
    <div className="text-gray-700 font-sans pb-20">

      {/* 1. メインナビ (前回と同じ) */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <NavCard icon={<MdHome size={40} />} title="部屋を探す" sub="Rent a Room" />
            <NavCard icon={<MdGroup size={40} />} title="メイト募集" sub="Find a Roommate" />
            <NavCard icon={<MdVpnKey size={40} />} title="貸したい" sub="Host a Room" />
            <NavCard icon={<MdForum size={40} />} title="掲示板" sub="Community" />
          </div>
        </div>
      </section>

      {/* 2. 検索バー (前回と同じ) */}
      <section className="bg-[#bf0000] py-4 sticky top-0 z-50 shadow-md border-b-4 border-[#900000]">
        <div className="container mx-auto px-4 flex justify-center gap-2 md:gap-6 text-sm md:text-base">
          <Link href="/search?mode=area">
            <SearchButton icon={<MdLocationOn />} text="エリアから" />
          </Link>
          <Link href="/search?mode=station">
            <SearchButton icon={<MdTrain />} text="沿線・駅から" isOutline />
          </Link>
          <Link href="/search?mode=map">
            <SearchButton icon={<MdMap />} text="地図から" isOutline />
          </Link>
        </div>
      </section>

      {/* ========== ここから新機能エリア ========== */}

      {/* 3. 【NEW】相性診断バナー（一番目立つ場所に配置） */}
      <section className="container mx-auto px-4 mt-8">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl p-6 md:p-10 text-white shadow-lg relative overflow-hidden cursor-pointer hover:shadow-xl transition group">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="bg-white text-pink-600 font-bold px-3 py-1 rounded-full text-sm mb-2 inline-block">無料・登録不要</span>
              <h2 className="text-2xl md:text-4xl font-bold mb-2 flex items-center justify-center md:justify-start gap-3">
                <MdPsychology /> ルームシェア相性診断
              </h2>
              <p className="text-pink-100 font-bold text-lg">たった1分で判明！あなたに合うシェアメイトのタイプは？</p>
            </div>
            <button className="bg-white text-pink-600 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition whitespace-nowrap">
              今すぐ診断する ▶
            </button>
          </div>
          {/* 装飾用の巨大アイコン（背景） */}
          <MdPsychology className="absolute -bottom-10 -right-10 text-white opacity-20 w-64 h-64 group-hover:scale-110 transition duration-700" />
        </div>
      </section>

      {/* 4. 【NEW】意思決定を助ける「暮らしツール」3連ボタン */}
      <section className="container mx-auto px-4 mt-10">
        <SectionTitle title="暮らしの便利ツール" subtitle="物件がなくても役立つ！失敗しないための準備ツール" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ToolCard
            color="bg-green-50 border-green-200 text-green-700"
            icon={<MdCalculate size={32} />}
            title="生活費シミュレーター"
            desc="家賃＋光熱費＋消耗品… 月々いくらかかる？"
          />
          <ToolCard
            color="bg-blue-50 border-blue-200 text-blue-700"
            icon={<MdPlaylistAddCheck size={32} />}
            title="内見チェックリスト"
            desc="印刷OK！内見で確認すべき「30の落とし穴」"
          />
          <ToolCard
            color="bg-orange-50 border-orange-200 text-orange-700"
            icon={<MdTimeline size={32} />}
            title="引越しタイムライン"
            desc="いつ何をする？入居までのダンドリを可視化"
          />
        </div>
      </section>

      {/* 5. 特集エリア（前回作成分） */}
      <section className="container mx-auto px-4 mt-10">
        <SectionTitle title="こだわり条件から探す" subtitle="あなたのライフスタイルに合う部屋は？" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <FeatureCard color="bg-orange-50" icon={<MdPets className="text-orange-500" />} title="ペット可" />
          <FeatureCard color="bg-blue-50" icon={<MdWifi className="text-blue-500" />} title="ネット高速" />
          <FeatureCard color="bg-green-50" icon={<MdPublic className="text-green-500" />} title="国際交流" />
          <FeatureCard color="bg-pink-50" icon={<MdFemale className="text-pink-500" />} title="女性専用" />
          <FeatureCard color="bg-yellow-50" icon={<MdAttachMoney className="text-yellow-600" />} title="格安3万以下" />
          <FeatureCard color="bg-purple-50" icon={<MdFiberNew className="text-purple-500" />} title="新築・改装" />
        </div>
      </section>

      {/* 6. 【NEW】体験談・読み物（カルーセル風レイアウト） */}
      <section className="bg-white py-10 mt-10 border-t border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-6">
            <SectionTitle title="シェアハウス体験談" subtitle="先輩たちのリアルな暮らし・失敗談" />
            <a href="#" className="text-[#bf0000] text-sm font-bold hover:underline mb-6">もっと見る ▶</a>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            {/* 記事カード 1 */}
            <ArticleCard
              tag="失敗談"
              title="「掃除当番で揉めた...」解決策はルール化にあり"
              image="bg-gray-200"
            />
            {/* 記事カード 2 */}
            <ArticleCard
              tag="お金の話"
              title="1ヶ月の生活費大公開！一人暮らしより3万円浮いた話"
              image="bg-gray-300"
            />
            {/* 記事カード 3 */}
            <ArticleCard
              tag="入居者レビュー"
              title="30代エンジニアが集まる「ギークハウス」に住んでみた"
              image="bg-gray-400"
            />
            {/* 記事カード 4 */}
            <ArticleCard
              tag="内見のコツ"
              title="写真に騙されない！共有スペースで見るべき3つのポイント"
              image="bg-gray-500"
            />
          </div>
        </div>
      </section>

      {/* 7. コンセプト・趣味別（前回分） */}
      <section className="container mx-auto px-4 py-10">
        <SectionTitle title="趣味・コンセプトで選ぶ" subtitle="同じ趣味の仲間と暮らす楽しさ" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ConceptCard icon={<MdSportsEsports />} title="ゲーマー専用" desc="高速回線・防音室完備" />
          <ConceptCard icon={<MdFitnessCenter />} title="ジム・スタジオ" desc="運動不足解消！" />
          <ConceptCard icon={<MdMovie />} title="シアタールーム" desc="週末は映画鑑賞会" />
          <ConceptCard icon={<MdSpa />} title="サウナ付き" desc="自宅でととのう生活" />
        </div>
      </section>

      {/* ... 前回の「7. コンセプト・趣味別」セクションの閉じタグ </div> </section> の直後に貼り付けてください ... */}

      {/* 8. 【NEW】新着物件ギャラリー（Supabaseから取得） */}
      <ListingGallery />


      {/* 9. 【NEW】リアル口コミマップ（Leaflet版） */}
      <section className="bg-white py-16 border-t relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              日本全国の<span className="text-[#bf0000]">シェアハウス口コミ地図</span>
            </h2>
            <p className="text-gray-500 font-bold">ピンをクリックして、周辺環境や住み心地をチェック！</p>
          </div>

          {/* 地図コンポーネントの表示 */}
          <div className="max-w-5xl mx-auto">
            <ReviewMap />
          </div>
        </div>
      </section>

      {/* 9.5. 【NEW】何でもビフォーアフター（ギャラリー形式） */}
      <BeforeAfterGallery />


    </div>
  );
}

// ================= 新規コンポーネント =================

// ツールカード
function ToolCard({ color, icon, title, desc }: { color: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className={`border rounded-xl p-6 cursor-pointer hover:shadow-md transition flex items-start gap-4 ${color} bg-opacity-40`}>
      <div className="bg-white p-3 rounded-full shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-sm opacity-80 font-bold">{desc}</p>
      </div>
    </div>
  );
}

// 記事カード（横スクロール用）
function ArticleCard({ tag, title, image }: { tag: string, title: string, image: string }) {
  return (
    <div className="min-w-[280px] md:min-w-[320px] bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition group">
      <div className={`h-40 w-full ${image} group-hover:opacity-90 transition`}>
        {/* 画像プレースホルダー */}
        <div className="w-full h-full flex items-center justify-center text-gray-500">Image</div>
      </div>
      <div className="p-4">
        <span className="text-xs font-bold text-[#bf0000] bg-red-50 px-2 py-1 rounded inline-block mb-2">{tag}</span>
        <h3 className="font-bold text-gray-800 leading-snug group-hover:text-[#bf0000] transition">{title}</h3>
      </div>
    </div>
  );
}

// ================= 以下、既存コンポーネント（前回と同じ） =================

function SectionTitle({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
        <span className="w-1 h-6 bg-[#bf0000] rounded inline-block"></span>
        {title}
      </h2>
      <p className="text-sm text-gray-500 ml-3 mt-1">{subtitle}</p>
    </div>
  );
}

function NavCard({ icon, title, sub }: { icon: React.ReactNode, title: string, sub: string }) {
  return (
    <div className="cursor-pointer group flex flex-col items-center">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-red-50 transition border border-gray-200 shadow-sm text-gray-600 group-hover:text-[#bf0000]">
        {icon}
      </div>
      <p className="font-bold text-base md:text-lg group-hover:text-[#bf0000] transition">{title}</p>
      <p className="text-xs text-gray-400 font-bold">{sub}</p>
    </div>
  );
}

function SearchButton({ icon, text, isOutline }: { icon: React.ReactNode, text: string, isOutline?: boolean }) {
  const baseClass = "px-4 md:px-6 py-2 rounded font-bold shadow-sm transition flex items-center gap-2 whitespace-nowrap";
  const styleClass = isOutline
    ? "bg-[#a00000] text-white border border-[#b00000] hover:bg-[#800000]"
    : "bg-white text-[#bf0000] hover:bg-gray-100";
  return <button className={`${baseClass} ${styleClass}`}>{icon} {text}</button>;
}

function FeatureCard({ color, icon, title }: { color: string, icon: React.ReactNode, title: string }) {
  return (
    <div className={`${color} border border-gray-100 rounded-lg p-3 cursor-pointer hover:shadow-md transition flex flex-col items-center justify-center text-center h-24 hover:-translate-y-1`}>
      <div className="text-2xl mb-1">{icon}</div>
      <span className="font-bold text-sm text-gray-700">{title}</span>
    </div>
  );
}

// ================= Listing Gallery with Supabase =================
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

function ListingGallery() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) {
        console.error("Error fetching listings:", error);
      } else {
        setListings(data || []);
      }
      setLoading(false);
    };
    fetchListings();
  }, []);

  if (loading) return <div className="py-20 text-center text-gray-500">物件情報を読み込み中...</div>;

  return (
    <section className="bg-gray-50 py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-6">
          <SectionTitle title="新着のシェアハウス" subtitle="本日公開！写真で選ぶ最新物件" />
          <button className="text-[#bf0000] font-bold border border-[#bf0000] bg-white px-4 py-1 rounded-full hover:bg-[#bf0000] hover:text-white transition text-sm">
            もっと見る
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {listings.length === 0 ? (
            <div className="col-span-4 text-center py-10 text-gray-400">
              まだ投稿された物件はありません。
            </div>
          ) : (
            listings.map((l) => (
              <PhotoPropertyCard
                key={l.id}
                id={l.id}
                // Use stored image URL or mock fallback
                imageUrl={l.images && l.images.length > 0 ? l.images[0] : undefined}
                image={(!l.images || l.images.length === 0) ? 'bg-gray-200' : undefined}
                price={String(l.price)}
                station={l.address ? l.address.split(' ')[0] : '駅指定なし'} // Simple fallback
                badges={l.amenities ? l.amenities.slice(0, 2) : []}
                title={l.title}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function ConceptCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center cursor-pointer group">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-600 mb-3 group-hover:bg-[#bf0000] group-hover:text-white transition shadow-sm">
        {icon}
      </div>
      <h3 className="font-bold text-gray-800 group-hover:text-[#bf0000] transition">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{desc}</p>
    </div>
  );
}

// 画像メインの物件カード
function PhotoPropertyCard_Old({ image, price, station, badges, title }: { image: string, price: string, station: string, badges: string[], title: string }) {
  return (
    <div className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl transition overflow-hidden border border-gray-100 flex flex-col h-full">
      {/* 写真エリア（大きく確保） */}
      <div className={`relative h-48 w-full ${image} overflow-hidden`}>
        {/* NEWバッジ */}
        <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10">NEW</span>

        {/* 画像拡大アニメーション */}
        <div className="w-full h-full bg-gray-300 opacity-50 group-hover:scale-110 transition duration-700"></div>

        {/* 写真の上に価格を乗せる（モダンな手法） */}
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm">
          <span className="text-xs text-gray-500 font-bold">家賃</span>
          <span className="text-lg font-bold text-[#bf0000] ml-1">¥{price}万</span>
        </div>
      </div>

      {/* 情報エリア */}
      <div className="p-3 flex flex-col flex-grow">
        {/* タグ列 */}
        <div className="flex gap-1 mb-2 flex-wrap">
          {badges.map((badge, i) => (
            <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
              {badge}
            </span>
          ))}
        </div>

        {/* タイトル */}
        <h3 className="font-bold text-gray-800 text-sm md:text-base leading-snug mb-2 group-hover:text-[#bf0000] transition line-clamp-2">
          {title}
        </h3>

        {/* 最寄り駅 */}
        <div className="mt-auto pt-2 border-t border-gray-100 flex items-center text-xs font-bold text-gray-500">
          <MdTrain className="mr-1 text-gray-400" /> {station}
        </div>
      </div>
    </div>
  );
}

// ================= 何でもビフォーアフター（ギャラリー） =================
function BeforeAfterGallery() {
  const items = [
    { id: 1, title: '6畳和室を北欧風にDIY', before: 'bg-gray-300', after: 'bg-orange-100', user: 'DIY初心者' },
    { id: 2, title: 'キッチン収納を100均グッズで', before: 'bg-gray-400', after: 'bg-blue-100', user: '整理収納好き' },
    { id: 3, title: '殺風景なベランダがカフェに', before: 'bg-gray-500', after: 'bg-green-100', user: 'グリーン' },
    { id: 4, title: '押入れをデスクスペースに改造', before: 'bg-gray-600', after: 'bg-purple-100', user: 'リモートワーク' },
    { id: 5, title: 'ユニットバスをホテルライクに', before: 'bg-gray-300', after: 'bg-teal-100', user: 'リラックス' },
    { id: 6, title: '玄関の隙間収納', before: 'bg-gray-400', after: 'bg-yellow-100', user: '隙間産業' },
    { id: 7, title: '壁紙張り替えで明るく！', before: 'bg-gray-500', after: 'bg-pink-100', user: '壁紙屋' },
    { id: 8, title: '照明交換で雰囲気ガラリ', before: 'bg-gray-600', after: 'bg-indigo-100', user: 'ライトマン' },
  ];

  return (
    <section className="bg-gray-50 py-16 border-t font-sans">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <SectionTitle title="何でもビフォーアフター" subtitle="みんなのDIY・模様替えをチェック！" />

          <a href="#" className="bg-[#bf0000] text-white font-bold px-6 py-3 rounded-full shadow-md hover:bg-[#900000] transition flex items-center gap-2">
            <MdCameraAlt />
            <span>あなたの部屋も投稿する</span>
          </a>
        </div>

        {/* ギャラリーグリッド：スマホ1列、PC2列 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group">
              <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-bold text-gray-800">{item.title}</h3>
                <span className="text-xs text-gray-400 font-bold">by {item.user}</span>
              </div>

              <div className="flex h-64 relative">
                {/* Before */}
                <div className={`flex-1 ${item.before} flex items-center justify-center relative`}>
                  <span className="absolute top-2 left-2 bg-gray-600 text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-80">BEFORE</span>
                  <div className="text-gray-500 font-bold opacity-30">Photo</div>
                </div>

                {/* 境界線の矢印 */}
                <div className="absolute inset-y-0 left-1/2 -ml-4 flex items-center justify-center z-10">
                  <div className="bg-white rounded-full p-1 shadow-md text-[#bf0000]">
                    <MdArrowForward />
                  </div>
                </div>

                {/* After */}
                <div className={`flex-1 ${item.after} flex items-center justify-center relative`}>
                  <span className="absolute top-2 right-2 bg-[#bf0000] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">AFTER</span>
                  <div className="text-gray-500 font-bold opacity-30">Photo</div>
                  {/* ホバー時のオーバーレイ */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
