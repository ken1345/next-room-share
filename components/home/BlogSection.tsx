import Image from 'next/image';
import Link from 'next/link';
import { MdArrowForward, MdMenuBook, MdSchedule } from 'react-icons/md';

import { getAllBlogPosts } from '@/lib/blog';

export default async function BlogSection() {
  const posts = await getAllBlogPosts();

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#eaedf2] py-16 border-t border-[#dfe5ec]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold tracking-[0.24em] text-[#4f7db3] mb-3">BLOG</p>
            <h2 className="flex items-center gap-3 text-[1.8rem] font-bold text-[#24313d] mb-2">
              <span className="inline-block h-7 w-1.5 rounded-full bg-[#4f7db3]"></span>
              ブログ
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 self-start md:self-auto rounded-full bg-[#4f7db3] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_22px_-10px_rgba(79,125,179,0.9)] transition hover:-translate-y-0.5 hover:bg-[#416b9c]"
          >
            <MdArrowForward />
            <span>記事一覧を見る</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block h-full"
            >
              <article className="h-full overflow-hidden rounded-[26px] border border-[#dfe5ec] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08),0_12px_30px_-12px_rgba(96,120,148,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_6px_18px_rgba(0,0,0,0.10),0_18px_36px_-12px_rgba(96,120,148,0.35)]">
                {post.eyecatchImage && (
                  <div className="relative h-36 w-full overflow-hidden border-b border-[#eef2f6] bg-[#eef4fa]">
                    <Image
                      src={post.eyecatchImage}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                )}
                <div className="border-b border-[#eef2f6] bg-[linear-gradient(135deg,#f5f8fc_0%,#ffffff_58%,#f7fbff_100%)] px-4 py-4">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f1fb] px-3 py-1 text-xs font-bold text-[#416b9c]">
                      <MdMenuBook />
                      {index === 0 ? '新着記事' : 'おすすめ記事'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-stone-500">
                      <MdSchedule />
                      {post.readingMinutes}分で読めます
                    </span>
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-[#24313d] leading-6 mb-2 line-clamp-2 group-hover:text-[#416b9c] transition">
                    {post.title}
                  </h3>

                  <p className="text-xs md:text-sm leading-6 text-[#4f5e6b] line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>

                <div className="px-4 py-4">
                  <div className="rounded-[18px] border border-[#e9eef4] bg-[#f9fbfd] px-4 py-3">
                    <p className="text-xs font-bold tracking-[0.2em] text-[#7f90a3] mb-2">
                      PICK UP
                    </p>
                    <p className="text-xs leading-6 text-[#4f5e6b] line-clamp-3">
                      {post.content
                        .split('\n')
                        .map((line) => line.trim())
                        .find((line) => line && !/^【.+】$/.test(line))}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs font-bold text-stone-500">
                    <span className="truncate pr-2">{post.updatedAt}</span>
                    <span className="inline-flex items-center gap-1 text-[#416b9c] shrink-0">
                      続きを読む
                      <MdArrowForward className="transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
