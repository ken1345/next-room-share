import { promises as fs } from 'fs';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'blog');

export type BlogBlock =
  | { type: 'paragraph'; content: string }
  | { type: 'heading'; content: string }
  | { type: 'list'; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  blocks: BlogBlock[];
  headings: string[];
  keyPoints: string[];
  eyecatchImage: string | null;
  updatedAt: string;
  readingMinutes: number;
};

const EYE_CATCH_BY_SLUG: Record<string, string> = {
  '1': '/blog/b1a.png',
};

function normalizeLine(line: string) {
  return line.replace(/\r/g, '').trim();
}

function parseBlocks(content: string): BlogBlock[] {
  const lines = content.split('\n').map(normalizeLine);
  const blocks: BlogBlock[] = [];
  let paragraphBuffer: string[] = [];
  let listBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length === 0) return;
    blocks.push({
      type: 'paragraph',
      content: paragraphBuffer.join('\n'),
    });
    paragraphBuffer = [];
  };

  const flushList = () => {
    if (listBuffer.length === 0) return;
    blocks.push({
      type: 'list',
      items: [...listBuffer],
    });
    listBuffer = [];
  };

  for (const line of lines) {
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = line.match(/^【(.+)】$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: 'heading',
        content: headingMatch[1],
      });
      continue;
    }

    if (line.startsWith('・')) {
      flushParagraph();
      listBuffer.push(line.slice(1).trim());
      continue;
    }

    flushList();
    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

async function readBlogFile(filename: string): Promise<BlogPost> {
  const slug = path.basename(filename, '.txt');
  const filePath = path.join(BLOG_DIR, filename);
  const [content, stats] = await Promise.all([
    fs.readFile(filePath, 'utf8'),
    fs.stat(filePath),
  ]);

  const lines = content.split('\n').map(normalizeLine).filter(Boolean);
  const [title, ...rest] = lines;
  const body = rest.join('\n\n');
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(
      (paragraph) =>
        paragraph &&
        !/^【.+】$/.test(paragraph) &&
        !paragraph.startsWith('・')
    );
  const excerpt = paragraphs.slice(0, 2).join(' ').slice(0, 180).trim();
  const plainText = content.replace(/\s+/g, '');
  const blocks = parseBlocks(body);
  const headings = blocks
    .filter((block): block is Extract<BlogBlock, { type: 'heading' }> => block.type === 'heading')
    .map((block) => block.content);
  const keyPoints =
    blocks.find((block): block is Extract<BlogBlock, { type: 'list' }> => block.type === 'list')?.items ?? [];

  return {
    slug,
    title: title || slug,
    excerpt,
    content: body,
    blocks,
    headings,
    keyPoints,
    eyecatchImage: EYE_CATCH_BY_SLUG[slug] ?? null,
    updatedAt: new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(stats.mtime),
    readingMinutes: Math.max(1, Math.ceil(plainText.length / 500)),
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
  const filenames = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.txt'))
    .map((entry) => entry.name)
    .sort((left, right) => right.localeCompare(left, 'ja'));

  const posts = await Promise.all(filenames.map(readBlogFile));
  return posts;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    return await readBlogFile(`${slug}.txt`);
  } catch {
    return null;
  }
}
