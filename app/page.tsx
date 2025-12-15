// app/page.tsx
"use client";
import { useState } from "react";
import Link from 'next/link';

import {
  MdHome, MdGroup, MdVpnKey, MdForum, MdLocationOn, MdTrain, MdMap,
  MdPets, MdWifi, MdPublic, MdFemale, MdAttachMoney, MdFiberNew,
  MdCampaign, MdTimer, MdSportsEsports, MdFitnessCenter, MdMovie, MdSpa,
  MdSchool, MdComputer, MdChildCare, MdTranslate,
  MdCalculate, MdPlaylistAddCheck, MdTimeline, MdPsychology, MdAutoStories, MdStar, MdPlace, MdFace,
  MdArrowForward, MdCameraAlt, MdTag, MdPerson, MdCalendarToday
} from "react-icons/md";
import PhotoPropertyCard from "@/components/PhotoPropertyCard";
import { MOCK_STORIES } from '@/data/mock-stories';

// ヘッダー・フッターは layout.tsx にあるため省略

export default function Home() {
  return (
    <div className="text-gray-700 font-sans pb-20">

      {/* 1. メインナビ (前回と同じ) */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-8 md:gap-80 text-center">
            <Link href="/search"><NavCard icon={<MdHome size={40} />} title="部屋を探す" sub="Rent a Room" /></Link>
            <Link href="/host"><NavCard icon={<MdVpnKey size={40} />} title="貸したい" sub="Host a Room" /></Link>
          </div>
        </div>
      </section>

      {/* 2. 検索バー (前回と同じ) */}
      <section className="bg-[#bf0000] py-4 sticky top-0 z-50 shadow-md border-b-4 border-[#900000]">
        <div className="container mx-auto px-4 flex justify-center gap-2 md:gap-6 text-sm md:text-base">
          <Link href="/search?mode=area">
            <SearchButton icon={<MdLocationOn />} text="エリアから" isOutline />
          </Link>
          <Link href="/search?mode=station">
            <SearchButton icon={<MdTrain />} text="沿線・駅から" isOutline />
          </Link>

        </div>
      </section>

      {/* ========== ここから新機能エリア ========== */}

      {/* 8. 【NEW】新着物件ギャラリー（Supabaseから取得） */}
      <ListingGallery />

      {/* 3. 【NEW】相性診断バナー（一番目立つ場所に配置） */}
      <section className="container mx-auto px-4 mt-8">
        <Link href="/diagnosis">
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
        </Link>
      </section>

      {/* 4. 【NEW】意思決定を助ける「暮らしツール」3連ボタン */}
      <section className="container mx-auto px-4 mt-10">
        <SectionTitle title="暮らしの便利ツール" subtitle="物件がなくても役立つ！失敗しないための準備ツール" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/simulator">
            <ToolCard
              color="bg-green-50 border-green-200 text-green-700"
              icon={<MdCalculate size={32} />}
              title="生活費シミュレーター"
              desc="家賃＋光熱費＋消耗品… 月々いくらかかる？"
            />
          </Link>
          <Link href="/checklist">
            <ToolCard
              color="bg-blue-50 border-blue-200 text-blue-700"
              icon={<MdPlaylistAddCheck size={32} />}
              title="内見チェックリスト"
              desc="騒音は？水回りは？見落としがちなポイント30選"
            />
          </Link>
          <Link href="/timeline">
            <ToolCard
              color="bg-orange-50 border-orange-200 text-orange-700"
              icon={<MdTimeline size={32} />}
              title="引越しタイムライン"
              desc="物件探しから入居当日まで。やるべきことを時系列で"
            />
          </Link>
        </div>
      </section>

      {/* 5. 特集エリア（前回作成分） */}
      <section className="container mx-auto px-4 mt-10">
        <SectionTitle title="こだわり条件から探す" subtitle="あなたのライフスタイルに合う部屋は？" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link href="/search?feature=pet"><FeatureCard color="bg-orange-50" icon={<MdPets className="text-orange-500" />} title="ペット可" /></Link>
          <Link href="/search?feature=wifi"><FeatureCard color="bg-blue-50" icon={<MdWifi className="text-blue-500" />} title="ネット高速" /></Link>
          <Link href="/search?feature=foreigner"><FeatureCard color="bg-green-50" icon={<MdPublic className="text-green-500" />} title="国際交流" /></Link>
          <Link href="/search?feature=female"><FeatureCard color="bg-pink-50" icon={<MdFemale className="text-pink-500" />} title="女性専用" /></Link>
          <Link href="/search?feature=cheap"><FeatureCard color="bg-yellow-50" icon={<MdAttachMoney className="text-yellow-600" />} title="格安3万以下" /></Link>
          <Link href="/search?feature=diy"><FeatureCard color="bg-purple-50" icon={<MdFiberNew className="text-purple-500" />} title="新築・改装" /></Link>
        </div>
      </section>



      {/* 7. 【NEW】体験談・読み物（カルーセル風レイアウト） */}
      <section className="bg-white py-10 mt-10 border-t border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-6">
            <SectionTitle title="シェアハウス体験談" subtitle="先輩たちのリアルな暮らし・失敗談" />
            <Link href="/stories" className="text-[#bf0000] text-sm font-bold hover:underline mb-6">もっと見る ▶</Link>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
            {MOCK_STORIES.slice(0, 4).map((story) => (
              <Link href={`/stories/${story.id}`} key={story.id} className="block group min-w-[300px] md:min-w-[350px]">
                <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition h-full flex flex-col">
                  {/* If image is a URL (Supabase Storage), use img tag. If class (Mock), use div. */}
                  {story.image.startsWith('bg-') ? (
                    <div className={`h-48 ${story.image} bg-cover bg-center`}></div>
                  ) : (
                    <div className="h-48 bg-gray-200">
                      {/* If I had real images, I'd put an img here. For now, empty or generic placeholder */}
                    </div>
                  )}

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {story.tags.map(tag => (
                        <span key={tag} className="text-xs font-bold text-[#bf0000] bg-red-50 px-2 py-1 rounded-md flex items-center gap-1">
                          <MdTag /> {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#bf0000] transition line-clamp-2">
                      {story.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                      {story.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400 font-bold border-t border-gray-50 pt-4 mt-auto">
                      <div className="flex items-center gap-1">
                        <MdPerson /> {story.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <MdCalendarToday /> {story.date}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section >

      {/* 7. コンセプト・趣味別（前回分） */}
      < section className="container mx-auto px-4 py-10" >
        <SectionTitle title="趣味・コンセプトで選ぶ" subtitle="同じ趣味の仲間と暮らす楽しさ" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <ConceptCard icon={<MdSportsEsports />} title="ゲーマー専用" desc="高速回線・防音室完備" />
          <ConceptCard icon={<MdFitnessCenter />} title="ジム・スタジオ" desc="運動不足解消！" />
          <ConceptCard icon={<MdMovie />} title="シアタールーム" desc="週末は映画鑑賞会" />
          <ConceptCard icon={<MdSpa />} title="サウナ付き" desc="自宅でととのう生活" />
        </div>
      </section >

      {/* ... 前回の「7. コンセプト・趣味別」セクションの閉じタグ </div> </section> の直後に貼り付けてください ... */}






      {/* 9.5. 【NEW】何でもビフォーアフター（ギャラリー形式） */}
      <BeforeAfterGallery />


    </div >
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
  return <button className={`${baseClass} ${styleClass} `}>{icon} {text}</button>;
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
        .eq('is_public', true)
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
                price={l.price}
                station={l.address ? l.address.split(' ')[0] : '駅指定なし'} // Simple fallback
                badges={l.amenities ? l.amenities.slice(0, 2) : []}
                title={l.title}
                viewCount={l.view_count || 0}
                favoritesCount={l.favorites_count || 0}
                inquiryCount={l.inquiry_count || 0}
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
// ================= 何でもビフォーアフター（ギャラリー） =================
function BeforeAfterGallery() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('before_after_posts')
        .select(`
          *,
          user:users ( display_name )
        `)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error("Error fetching homepage posts:", error);
      }

      if (data) setItems(data);
    };
    fetchPosts();
  }, []);

  // Mock items for fallback/empty state to keep UI lively initially
  const mockItems = [
    { id: 101, title: '6畳和室を北欧風にDIY', before_image_url: 'bg-gray-300', after_image_url: 'bg-orange-100', user: { display_name: 'DIY初心者' }, isMock: true },
    { id: 102, title: 'キッチン収納を100均グッズで', before_image_url: 'bg-gray-400', after_image_url: 'bg-blue-100', user: { display_name: '整理収納好き' }, isMock: true },
  ];

  const displayItems = items.length > 0 ? items : mockItems;

  return (
    <section className="bg-gray-50 py-16 border-t font-sans">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <SectionTitle title="何でもビフォーアフター" subtitle="みんなのDIY・模様替えをチェック！" />

          <Link href="/before-after" className="bg-[#bf0000] text-white font-bold px-6 py-3 rounded-full shadow-md hover:bg-[#900000] transition flex items-center gap-2">
            <MdArrowForward />
            <span>投稿一覧を見る</span>
          </Link>
        </div>

        {/* ギャラリーグリッド：スマホ1列、PC2列 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayItems.map((item) => (
            <Link href={item.isMock ? '#' : `/before-after/${item.id}`} key={item.id} className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition group block ${item.isMock ? 'cursor-default pointer-events-none' : 'cursor-pointer'}`}>
              <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-bold text-gray-800">{item.title}</h3>
                <span className="text-xs text-gray-400 font-bold">by {item.user?.display_name || 'User'}</span>
              </div>

              <div className="flex h-64 relative">
                {/* Before */}
                <div className={`flex-1 ${item.isMock ? item.before_image_url : ''} flex items-center justify-center relative overflow-hidden bg-gray-100`}>
                  {!item.isMock && <img src={item.before_image_url} alt="Before" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition" />}
                  <span className="absolute top-2 left-2 bg-gray-600 text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-80 z-10">BEFORE</span>
                  {item.isMock && <div className="text-gray-500 font-bold opacity-30">Photo</div>}
                </div>

                {/* 境界線の矢印 */}
                <div className="absolute inset-y-0 left-1/2 -ml-4 flex items-center justify-center z-20">
                  <div className="bg-white rounded-full p-1 shadow-md text-[#bf0000]">
                    <MdArrowForward />
                  </div>
                </div>

                {/* After */}
                <div className={`flex-1 ${item.isMock ? item.after_image_url : ''} flex items-center justify-center relative overflow-hidden bg-gray-100`}>
                  {!item.isMock && <img src={item.after_image_url} alt="After" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition" />}
                  <span className="absolute top-2 right-2 bg-[#bf0000] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10">AFTER</span>
                  {item.isMock && <div className="text-gray-500 font-bold opacity-30">Photo</div>}
                  {/* ホバー時のオーバーレイ */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition z-0"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
