
import { NextResponse } from 'next/server';
import { checkModeration } from '@/lib/openai';

export async function POST(request: Request) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // 1. Custom NG Word Check (Local Filter)
        const ngWords = ['NG_TEST', '死ね', '殺す', '闇バイト']; // Add prohibited words here
        for (const word of ngWords) {
            if (text.includes(word)) {
                return NextResponse.json({
                    flagged: true,
                    categories: ['禁止ワード(NG Word)']
                });
            }
        }

        const result = await checkModeration(text);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Moderation API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
