import { supabase } from './supabase';

export const useLittleServerListings = process.env.NEXT_PUBLIC_LISTINGS_BACKEND === 'little-server';

export async function requestLittleServerListings<T>(query: URLSearchParams, options?: RequestInit, authenticated = true): Promise<T> {
    const headers = new Headers(options?.headers);
    if (authenticated) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('ログインが必要です。');
        headers.set('Authorization', `Bearer ${session.access_token}`);
    }
    const response = await fetch(`/api/little-server/listings?${query}`, { ...options, headers });
    if (!response.ok) {
        const messages: Record<number, string> = {
            401: 'ログインが必要です。',
            404: '物件が見つからないか、操作する権限がありません。',
            409: '物件がすでに登録されているか、現在は更新できません。',
            413: 'ファイルまたは入力内容が大きすぎます。',
            400: '入力内容または画像形式を確認してください。',
        };
        throw new Error(messages[response.status] ?? '物件管理サービスに接続できませんでした。');
    }
    return response.json() as Promise<T>;
}
