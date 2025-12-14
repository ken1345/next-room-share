import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.MLIT_API_KEY || 'tYwqwfBBbjZx8pjqdo6nsID94EqIMmP4';
const ENDPOINT = 'https://www.mlit-data.jp/api/v1/';

const REGION_MAP = {
    "北海道": "北海道・東北", "青森県": "北海道・東北", "岩手県": "北海道・東北", "宮城県": "北海道・東北", "秋田県": "北海道・東北", "山形県": "北海道・東北", "福島県": "北海道・東北",
    "茨城県": "関東", "栃木県": "関東", "群馬県": "関東", "埼玉県": "関東", "千葉県": "関東", "東京都": "関東", "神奈川県": "関東",
    "新潟県": "中部", "富山県": "中部", "石川県": "中部", "福井県": "中部", "山梨県": "中部", "長野県": "中部", "岐阜県": "中部", "静岡県": "中部", "愛知県": "中部",
    "三重県": "近畿", "滋賀県": "近畿", "京都府": "近畿", "大阪府": "近畿", "兵庫県": "近畿", "奈良県": "近畿", "和歌山県": "近畿",
    "鳥取県": "中国・四国", "島根県": "中国・四国", "岡山県": "中国・四国", "広島県": "中国・四国", "山口県": "中国・四国",
    "徳島県": "中国・四国", "香川県": "中国・四国", "愛媛県": "中国・四国", "高知県": "中国・四国",
    "福岡県": "九州・沖縄", "佐賀県": "九州・沖縄", "長崎県": "九州・沖縄", "熊本県": "九州・沖縄", "大分県": "九州・沖縄", "宮崎県": "九州・沖縄", "鹿児島県": "九州・沖縄", "沖縄県": "九州・沖縄"
};

async function fetchGraphQL(query) {
    const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
            'apikey': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API Error ${res.status}: ${text}`);
    }

    const json = await res.json();
    if (json.errors) {
        throw new Error(`GraphQL Error: ${JSON.stringify(json.errors)}`);
    }
    return json.data;
}

async function main() {
    try {
        console.log('Fetching Prefectures...');
        const prefData = await fetchGraphQL(`
      query {
        prefecture {
          code
          name
        }
      }
    `);
        const prefectures = prefData.prefecture;

        console.log('Fetching Municipalities...');
        const muniData = await fetchGraphQL(`
      query {
        municipalities {
          code
          name
          prefecture_code
        }
      }
    `);
        const municipalities = muniData.municipalities;

        console.log(`Got ${prefectures.length} prefectures and ${municipalities.length} municipalities.`);

        // Build Structure
        // { "Region": { "Prefecture": ["City1", "City2"] } }
        const output = {};

        // Initialize Regions
        const distinctRegions = [...new Set(Object.values(REGION_MAP))];
        distinctRegions.forEach(r => output[r] = {});

        // Map Prefectures to Codes for easy lookup
        const prefMap = {}; // code -> name
        prefectures.forEach(p => {
            prefMap[p.code] = p.name;
            const region = REGION_MAP[p.name];
            if (region) {
                output[region][p.name] = [];
            }
        });

        // Populate Cities
        municipalities.forEach(m => {
            const prefName = prefMap[m.prefecture_code];
            const region = REGION_MAP[prefName];
            if (region && output[region][prefName]) {
                output[region][prefName].push(m.name);
            }
        });

        // Write to file
        const outputPath = path.resolve(__dirname, '../data/generated-area-data.json');
        fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
        console.log(`Written to ${outputPath}`);

    } catch (error) {
        console.error('Script failed:', error);
        process.exit(1);
    }
}

main();
