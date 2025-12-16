import { NextResponse } from 'next/server';
import { toRomaji, slugify } from '@/lib/romaji';

export async function POST(request: Request) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ slug: '' });
        }

        const romaji = await toRomaji(text);
        const slug = slugify(romaji);

        return NextResponse.json({ slug });
    } catch (error) {
        console.error('Slug generation error:', error);
        return NextResponse.json({ error: 'Failed to generate slug' }, { status: 500 });
    }
}
