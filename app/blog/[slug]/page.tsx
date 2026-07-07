import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MdArrowBack, MdArrowForward, MdMenuBook, MdSchedule } from 'react-icons/md';

import { getAllBlogPosts, getBlogPost } from '@/lib/blog';

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: `${post.title} | ブログ`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const renderedBlocks = post.blocks.map((block, index) => {
    if (block.type === 'heading') {
      return {
        key: `${block.type}-${index}`,
        type: 'heading' as const,
        content: block.content,
        headingId: `section-${
          post.blocks
            .slice(0, index + 1)
            .filter((entry) => entry.type === 'heading').length
        }`,
      };
    }

    if (block.type === 'list') {
      return {
        key: `${block.type}-${index}`,
        type: 'list' as const,
        items: block.items,
      };
    }

    return {
      key: `${block.type}-${index}`,
      type: 'paragraph' as const,
      content: block.content,
    };
  });

  return (
    <main className="min-h-screen bg-[#eaedf2] pb-20">
      <section className="container mx-auto px-4 pt-8 md:pt-10">
        <div className="mx-auto max-w-5xl rounded-[32px] border border-[#dfe5ec] bg-white p-6 md:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.08),0_12px_30px_-12px_rgba(96,120,148,0.28)]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-[#4f7db3] px-4 py-2 text-sm font-bold text-white shadow-[0_10px_22px_-12px_rgba(79,125,179,0.95)] transition hover:bg-[#416b9c] mb-6"
          >
            <MdArrowBack />
            ブログ一覧へ戻る
          </Link>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f1fb] px-3 py-1 text-xs font-bold text-[#416b9c]">
                <MdMenuBook />
                ルームシェアコラム
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-stone-500">
                <MdSchedule />
                {post.readingMinutes}分で読めます
              </span>
              <span className="text-xs font-bold text-stone-400">{post.updatedAt} 更新</span>
            </div>

            <h1 className="text-3xl md:text-[2.9rem] font-bold text-[#24313d] leading-[1.55] mb-6">
              {post.title}
            </h1>

            <p className="max-w-3xl text-[#4f5e6b] leading-8 text-base md:text-lg">
              {post.excerpt}
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pt-8">
        <article className="blog-article mx-auto max-w-5xl rounded-[32px] border border-[#dfe5ec] bg-white p-6 md:p-12 shadow-[0_2px_8px_rgba(0,0,0,0.08),0_12px_30px_-12px_rgba(96,120,148,0.28)]">
          {post.eyecatchImage && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[24px] border border-[#e3eaf1] bg-[#eef4fa] shadow-[0_10px_28px_-18px_rgba(36,49,61,0.45)]">
              <Image
                src={post.eyecatchImage}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 1024px) 960px, 100vw"
                className="object-cover"
              />
            </div>
          )}


          {post.keyPoints.length > 0 && (
            <section className="blog-memo mb-10">
              <h2 className="blog-box-title">この記事でわかること</h2>
              <ul className="blog-checklist">
                {post.keyPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
          )}

          {post.headings.length > 0 && (
            <nav className="blog-toc mb-10" aria-label="目次">
              <div className="blog-toc-title">目次</div>
              <ol>
                {post.headings.map((heading, index) => (
                  <li key={heading}>
                    <a href={`#section-${index + 1}`}>{heading}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="blog-prose">
            {renderedBlocks.map((block) => {
              if (block.type === 'heading') {
                return (
                  <h2 id={block.headingId} key={block.key}>
                    {block.content}
                  </h2>
                );
              }

              if (block.type === 'list') {
                return (
                  <ul key={block.key}>
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                );
              }

              const lines = block.content
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean);
              const isQuoteLead =
                lines.length > 0 &&
                lines.every((line) => line.startsWith('「') && line.endsWith('」'));

              if (isQuoteLead) {
                return null;
              }

              return (
                <p key={block.key}>
                  {lines.map((line, lineIndex) => (
                    <span key={`${line}-${lineIndex}`} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              );
            })}
          </div>

          <div className="blog-recommend-box mt-8">
            <div>
              <p className="blog-recommend-label">NEXT READ</p>
              <h2 className="blog-recommend-title">ほかの記事もまとめてチェック</h2>
              <p className="blog-recommend-text">
                一覧ページから、ルームシェアの基礎知識や住まい選びのヒントを続けて読めます。
              </p>
            </div>
            <Link href="/blog" className="blog-recommend-link">
              記事一覧を見る
              <MdArrowForward />
            </Link>
          </div>
        </article>
      </section>
    </main>
  );
}
