import Link from 'next/link';
import { Suspense } from 'react';
import {
  MdHome, MdVpnKey, MdLocationOn, MdTrain,
  MdPets, MdWifi, MdPublic, MdFemale, MdAttachMoney, MdFiberNew,
  MdSportsEsports, MdFitnessCenter, MdMovie, MdSpa,
  MdCalculate, MdPlaylistAddCheck, MdTimeline, MdPsychology, MdTag, MdPerson, MdCalendarToday, MdArrowForward
} from "react-icons/md";

import { MOCK_STORIES } from '@/data/mock-stories';
import SectionTitle from '@/components/SectionTitle';
import ListingGalleryServer from '@/components/home/ListingGalleryServer';
import BeforeAfterGalleryServer from '@/components/home/BeforeAfterGalleryServer';
import ScrollToTop from '@/components/ScrollToTop';

// Header/Footer are in layout.tsx

export default function Home() {
  return (
    <div className="text-gray-700 font-sans pb-20">

      {/* 1. Main Nav */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-8 md:gap-80 text-center">
            <Link href="/search"><NavCard icon={<MdHome size={40} />} title="部屋を探す" sub="Rent a Room" /></Link>
            <Link href="/host"><NavCard icon={<MdVpnKey size={40} />} title="部屋を貸したい" sub="Host a Room" /></Link>
          </div>
        </div>
      </section>

      {/* 2. Search Bar Area */}
      <section className="bg-[#bf0000] py-4 shadow-md border-b-4 border-[#900000]">
        <div className="container mx-auto px-4 flex justify-center gap-2 md:gap-6 text-sm md:text-base">
          <Link href="/search?tab=area">
            <SearchButton icon={<MdLocationOn />} text="エリアから" isOutline />
          </Link>
          <Link href="/search?tab=station">
            <SearchButton icon={<MdTrain />} text="沿線・駅から" isOutline />
          </Link>
        </div>
      </section>

      {/* ========== Content Areas ========== */}

      {/* 8. Newly Arrived Rooms (Server Component) */}
      <Suspense fallback={<div className="py-20 text-center text-gray-500">物件情報を読み込み中...</div>}>
        <ListingGalleryServer />
      </Suspense>

      {/* 3. Diagnosis Banner */}
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
            {/* Decoration Icon */}
            <MdPsychology className="absolute -bottom-10 -right-10 text-white opacity-20 w-64 h-64 group-hover:scale-110 transition duration-700" />
          </div>
        </Link>
      </section>

      {/* 4. Living Tools */}
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

      {/* 5. Features Search */}
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

      {/* 7. Stories */}
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
                  {story.image.startsWith('bg-') ? (
                    <div className={`h-48 ${story.image} bg-cover bg-center`}></div>
                  ) : (
                    <div className="h-48 bg-gray-200"></div>
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
      </section>

      {/* 7. Concepts (Functional Links) */}
      <section className="container mx-auto px-4 py-10">
        <SectionTitle title="趣味・コンセプトで選ぶ" subtitle="同じ趣味の仲間と暮らす楽しさ" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Link href="/search?feature=gamer"><ConceptCard icon={<MdSportsEsports />} title="ゲーマー専用" desc="高速回線・防音室完備" /></Link>
          <Link href="/search?feature=gym"><ConceptCard icon={<MdFitnessCenter />} title="ジム・スタジオ" desc="運動不足解消！" /></Link>
          <Link href="/search?feature=theater"><ConceptCard icon={<MdMovie />} title="シアタールーム" desc="週末は映画鑑賞会" /></Link>
          <Link href="/search?feature=sauna"><ConceptCard icon={<MdSpa />} title="サウナ付き" desc="自宅でととのう生活" /></Link>
        </div>
      </section>

      {/* 9.5. Before After Gallery (Server Component) */}
      <Suspense fallback={<div className="py-20 text-center text-gray-500">読み込み中...</div>}>
        <BeforeAfterGalleryServer />
      </Suspense>

      {/* Scroll To Top Button (Client Component) */}
      <ScrollToTop />

    </div>
  );
}

// ================= Local Components =================

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
