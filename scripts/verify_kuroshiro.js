
const Kuroshiro = require('kuroshiro');
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');
const path = require('path');

async function test() {
    console.log('Starting test...');
    const kuroshiro = new Kuroshiro.default();

    // Attempt 1: Relative Path (often fails)
    // const dictPath = 'node_modules/kuromoji/dict';

    // Attempt 2: Absolute Path (my fix)
    const dictPath = path.join(process.cwd(), 'node_modules', 'kuromoji', 'dict');
    console.log('Dict Path:', dictPath);

    try {
        await kuroshiro.init(new KuromojiAnalyzer({
            dictPath: dictPath
        }));
        console.log('Init success!');

        const result = await kuroshiro.convert('東京都渋谷区', { to: 'romaji', mode: 'spaced' });
        console.log('Result:', result);
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
