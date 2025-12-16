const { createClient } = require('@supabase/supabase-js');
const pathtool = require('path');

// NOTE: Since I cannot import typescript modules easily in bare node script without ts-node,
// I will replicate the simple romanization logic or try to use the verify_kuroshiro approach.
// Ideally usage of 'kuroshiro' requires initialization which is async.

// Load env
const fs = require('fs');
const dotenv = require('dotenv');
const envParsed = dotenv.parse(fs.readFileSync(pathtool.resolve(__dirname, '../.env.local')));

const supabaseUrl = envParsed.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envParsed.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Needs SERVICE_ROLE_KEY to bypass RLS if updating others' rows, BUT we usually only have anon key in env.local?
// User might need to provide service key or run this in SQL Editor.
// However, assuming I might have access if I am admin or if I just try with Anon Key (likely fail for RLS).
// The user asked me to do it.

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Import Kuroshiro logic (Replicated for script simplicity to avoid TS compilation issues)
const Kuroshiro = require('kuroshiro');
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

const PREF_MAP = {
    '北海道': 'hokkaido', '青森県': 'aomori', '岩手県': 'iwate', '宮城県': 'miyagi', '秋田県': 'akita', '山形県': 'yamagata', '福島県': 'fukushima',
    '茨城県': 'ibaraki', '栃木県': 'tochigi', '群馬県': 'gunma', '埼玉県': 'saitama', '千葉県': 'chiba', '東京都': 'tokyo', '神奈川県': 'kanagawa',
    '新潟県': 'niigata', '富山県': 'toyama', '石川県': 'ishikawa', '福井県': 'fukui', '山梨県': 'yamanashi', '長野県': 'nagano', '岐阜県': 'gifu',
    '静岡県': 'shizuoka', '愛知県': 'aichi', '三重県': 'mie', '滋賀県': 'shiga', '京都府': 'kyoto', '大阪府': 'osaka', '兵庫県': 'hyogo',
    '奈良県': 'nara', '和歌山県': 'wakayama', '鳥取県': 'tottori', '島根県': 'shimane', '岡山県': 'okayama', '広島県': 'hiroshima', '山口県': 'yamaguchi',
    '徳島県': 'tokushima', '香川県': 'kagawa', '愛媛県': 'ehime', '高知県': 'kochi', '福岡県': 'fukuoka', '佐賀県': 'saga', '長崎県': 'nagasaki',
    '熊本県': 'kumamoto', '大分県': 'oita', '宮崎県': 'miyazaki', '鹿児島県': 'kagoshima', '沖縄県': 'okinawa'
};

function slugify(text) {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function backfill() {
    console.log('Starting backfill...');
    const kuroshiro = new Kuroshiro.default();
    const dictPath = pathtool.join(__dirname, '../node_modules/kuromoji/dict');
    await kuroshiro.init(new KuromojiAnalyzer({ dictPath }));
    console.log('Kuroshiro initialized.');

    // Fetch all listings without slug
    const { data: listings, error } = await supabase
        .from('listings')
        .select('id, prefecture, city')
        .is('slug', null);

    if (error) {
        console.error('Fetch error:', error);
        return;
    }

    console.log(`Found ${listings.length} listings to update.`);

    for (const l of listings) {
        let text = `${l.prefecture || ''} ${l.city || ''}`;
        if (!text.trim()) continue;

        let slug = '';
        try {
            let romaji = await kuroshiro.convert(text, { to: 'romaji', mode: 'spaced' });

            // Fallback check
            if (/[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+/.test(romaji)) {
                for (const [jp, en] of Object.entries(PREF_MAP)) {
                    if (text.includes(jp)) {
                        romaji = text.replace(jp, en + ' ');
                    }
                }
            }

            slug = slugify(romaji);
        } catch (e) {
            console.error('Conversion failed for', l.id, e);
            // hard fallback
            for (const [jp, en] of Object.entries(PREF_MAP)) {
                if (text.includes(jp)) {
                    slug = slugify(en);
                }
            }
        }

        if (slug) {
            console.log(`Updating ${l.id} -> ${slug}`);
            const { error: updateError } = await supabase
                .from('listings')
                .update({ slug: slug })
                .eq('id', l.id);

            if (updateError) console.error('Update failed:', updateError.message);
        }
    }
    console.log('Done.');
}

backfill();
