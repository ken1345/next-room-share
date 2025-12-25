
import { NextResponse } from 'next/server';
import { checkModeration } from '@/lib/openai';

export async function POST(request: Request) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
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
