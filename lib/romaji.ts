import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';
import path from 'path';

let kuroshiro: Kuroshiro | null = null;
let initPromise: Promise<void> | null = null;

const PREF_MAP: Record<string, string> = {
    '北海道': 'hokkaido', '青森県': 'aomori', '岩手県': 'iwate', '宮城県': 'miyagi', '秋田県': 'akita', '山形県': 'yamagata', '福島県': 'fukushima',
    '茨城県': 'ibaraki', '栃木県': 'tochigi', '群馬県': 'gunma', '埼玉県': 'saitama', '千葉県': 'chiba', '東京都': 'tokyo', '神奈川県': 'kanagawa',
    '新潟県': 'niigata', '富山県': 'toyama', '石川県': 'ishikawa', '福井県': 'fukui', '山梨県': 'yamanashi', '長野県': 'nagano', '岐阜県': 'gifu',
    '静岡県': 'shizuoka', '愛知県': 'aichi', '三重県': 'mie', '滋賀県': 'shiga', '京都府': 'kyoto', '大阪府': 'osaka', '兵庫県': 'hyogo',
    '奈良県': 'nara', '和歌山県': 'wakayama', '鳥取県': 'tottori', '島根県': 'shimane', '岡山県': 'okayama', '広島県': 'hiroshima', '山口県': 'yamaguchi',
    '徳島県': 'tokushima', '香川県': 'kagawa', '愛媛県': 'ehime', '高知県': 'kochi', '福岡県': 'fukuoka', '佐賀県': 'saga', '長崎県': 'nagasaki',
    '熊本県': 'kumamoto', '大分県': 'oita', '宮崎県': 'miyazaki', '鹿児島県': 'kagoshima', '沖縄県': 'okinawa'
};

export async function toRomaji(text: string): Promise<string> {
    if (!text) return '';

    // Fast path: Check partial matches for Prefectures manually to ensure stability
    // Optimization: If text IS just a prefecture, return mapped value.
    if (PREF_MAP[text]) return PREF_MAP[text];

    // If text starts with a known prefecture, we can try to romanize the rest?
    // Or just let Kuroshiro handle the full string.
    // Ideally we rely on Kuroshiro for Cities.

    if (!kuroshiro) {
        kuroshiro = new Kuroshiro();
    }

    if (!initPromise) {
        // Initialize with kuromoji analyzer
        // FIX: Use absolute path for dictionary in Node.js environment
        const dictPath = path.join(process.cwd(), 'node_modules', 'kuromoji', 'dict');
        console.log(`[Kuroshiro] Initializing with dictPath: ${dictPath}`);

        initPromise = kuroshiro.init(new KuromojiAnalyzer({
            dictPath: dictPath
        })).then(() => {
            console.log('[Kuroshiro] Initialization success');
        }).catch(err => {
            console.error('[Kuroshiro] Initialization failed:', err);
            initPromise = null; // Allow retry
            throw err;
        });
    }

    try {
        await initPromise;
        // Convert to romaji, spaces between words
        const result = await kuroshiro!.convert(text, { to: 'romaji', mode: 'spaced' });
        // console.log(`[Kuroshiro] Converted "${text}" -> "${result}"`);
        return result;
    } catch (e) {
        console.error("[Kuroshiro] Conversion error:", e);

        // Fallback: If text contains a known Prefecture, at least romanize that part
        for (const [jp, en] of Object.entries(PREF_MAP)) {
            if (text.includes(jp)) {
                return text.replace(jp, en + ' '); // Mixed Url: "tokyo 渋谷区"
            }
        }

        return text; // Fallback to original
    }
}

export function slugify(text: string): string {
    return text
        .normalize("NFD") // Decompose chars (ō -> o + ¯)
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .toLowerCase()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start
        .replace(/-+$/, '');      // Trim - from end
}
