import Image from 'next/image';
import Link from 'next/link';
import { MdArrowForward, MdMenuBook, MdSchedule } from 'react-icons/md';

import { getAllBlogPosts } from '@/lib/blog';

export const metadata = {
  title: 'ブログ | ルームシェア情報',
  description: 'ルームシェアの基礎知識や住まい探しのヒントをまとめたブログ記事一覧です。',
};

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();

  return (
    <main className="min-h-screen bg-[#eaedf2] pb-20">
      <section className="border-b border-[#dbe3eb]">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="rounded-[32px] border border-[#dfe5ec] bg-white px-6 py-10 md:px-10 md:py-12 shadow-[0_2px_8px_rgba(0,0,0,0.08),0_12px_30px_-12px_rgba(96,120,148,0.28)]">
            <p className="text-xs font-bold tracking-[0.28em] text-[#4f7db3] mb-3">BLOG</p>
            <h1 className="text-3xl md:text-[2.8rem] font-bold text-[#24313d] leading-[1.5] mb-4">
              住まい選びが少しやさしくなる
              <br />
              ルームシェアブログ
            </h1>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <h2 className="flex items-center gap-3 text-[1.9rem] font-bold text-[#24313d] mb-2">
            <span className="inline-block h-7 w-1.5 rounded-full bg-[#4f7db3]"></span>
            記事一覧
          </h2>
          <p className="text-[0.98rem] leading-8 text-[#52606d]">
            ボックスや導線を見やすく整理して、読みたい記事を選びやすい一覧に整えています。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
              <article className="h-full overflow-hidden rounded-[28px] border border-[#dfe5ec] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08),0_12px_30px_-12px_rgba(96,120,148,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_6px_18px_rgba(0,0,0,0.10),0_18px_36px_-12px_rgba(96,120,148,0.35)]">
                {post.eyecatchImage && (
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-[#eef2f6] bg-[#eef4fa]">
                    <Image
                      src={post.eyecatchImage}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                )}
                <div className="border-b border-[#eef2f6] bg-[linear-gradient(135deg,#f5f8fc_0%,#ffffff_58%,#f7fbff_100%)] px-8 py-7">
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f1fb] px-3 py-1 text-xs font-bold text-[#416b9c]">
                      <MdMenuBook />
                      ルームシェア基礎知識
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-stone-500">
                      <MdSchedule />
                      {post.readingMinutes}分で読めます
                    </span>
                  </div>

                  <h2 className="text-[1.7rem] font-bold text-[#24313d] leading-[1.6] mb-4 group-hover:text-[#416b9c] transition">
                    {post.title}
                  </h2>

                  <p className="text-[#4f5e6b] leading-8 mb-0">
                    {post.excerpt}
                  </p>
                </div>

                <div className="px-8 py-6">
                  <div className="rounded-[22px] border border-[#e9eef4] bg-[#f9fbfd] px-5 py-4 mb-6">
                    <p className="text-xs font-bold tracking-[0.2em] text-[#7f90a3] mb-2">
                      LEAD
                    </p>
                    <p className="text-sm leading-8 text-[#4f5e6b] line-clamp-3">
                      {post.content
                        .split('\n')
                        .map((line) => line.trim())
                        .find((line) => line && !/^【.+】$/.test(line))}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-stone-400">{post.updatedAt}</span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#4f7db3] px-4 py-2 text-white shadow-[0_10px_22px_-12px_rgba(79,125,179,0.95)]">
                      記事を読む
                      <MdArrowForward className="transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
