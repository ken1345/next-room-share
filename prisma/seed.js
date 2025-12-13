const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MOCK_PROPERTIES = [
    { id: '1', image: 'bg-orange-100', price: '5.4', station: '下北沢駅 5分', badges: ['個室', '女性専用'], title: 'カフェのような広いキッチンがある家', area: '世田谷区', type: 'private', description: '下北沢の静かな住宅街にある、古民家をリノベーションしたシェアハウスです。広いキッチンとリビングが特徴で、休日はシェアメイトと料理を楽しめます。', images: ['bg-orange-100', 'bg-orange-50', 'bg-gray-100'] },
    { id: '2', image: 'bg-blue-100', price: '4.8', station: '高円寺駅 8分', badges: ['ドミトリー', '国際交流'], title: 'English Only！週末はパーティー', area: '杉並区', type: 'shared', description: '住人の半数が海外からの留学生です。公用語は英語！日常的に国際交流が楽しめます。', images: ['bg-blue-100', 'bg-blue-50', 'bg-gray-100'] },
    { id: '3', image: 'bg-green-100', price: '6.2', station: '渋谷駅 15分', badges: ['個室', '新築'], title: '屋上テラスでヨガができる新築物件', area: '渋谷区', type: 'private', description: '渋谷へのアクセス抜群。新築デザイナーズ物件です。屋上にはヨガもできる広いテラスがあります。', images: ['bg-green-100', 'bg-green-50', 'bg-gray-100'] },
    { id: '4', image: 'bg-purple-100', price: '3.9', station: '池袋駅 10分', badges: ['半個室', '即入居可'], title: '初期費用0円キャンペーン中！', area: '豊島区', type: 'semi', description: 'とにかく安く住みたい方におすすめ。初期費用0円キャンペーン実施中。', images: ['bg-purple-100', 'bg-purple-50', 'bg-gray-100'] },
    { id: '5', image: 'bg-yellow-100', price: '7.5', station: '恵比寿駅 6分', badges: ['個室', 'サウナ付'], title: '【レア物件】プライベートサウナ完備', area: '渋谷区', type: 'private', description: '共用部にサウナを完備したラグジュアリーなシェアハウス。仕事の疲れを毎日癒やせます。', images: ['bg-yellow-100', 'bg-yellow-50', 'bg-gray-100'] },
    { id: '6', image: 'bg-red-100', price: '5.0', station: '吉祥寺駅 12分', badges: ['個室', 'ペット可'], title: '猫と暮らすシェアハウス', area: '武蔵野市', type: 'private', description: '猫好きのためのシェアハウス。キャットウォーク完備。猫との同伴入居も相談可能です。', images: ['bg-red-100', 'bg-red-50', 'bg-gray-100'] },
    { id: '7', image: 'bg-indigo-100', price: '4.2', station: '中野駅 7分', badges: ['個室', '防音'], title: 'ゲーマー・配信者向け防音室あり', area: '中野区', type: 'private', description: '全室防音施工済み。ゲーム実況や楽器演奏も可能なクリエイター向け物件です。', images: ['bg-indigo-100', 'bg-indigo-50', 'bg-gray-100'] },
    { id: '8', image: 'bg-teal-100', price: '5.8', station: '三軒茶屋 9分', badges: ['個室', 'リノベ'], title: '古民家リノベーション。縁側のある暮らし', area: '世田谷区', type: 'private', description: '築50年の古民家をフルリノベーション。縁側から庭を眺めるスローライフを楽しめます。', images: ['bg-teal-100', 'bg-teal-50', 'bg-gray-100'] },
];

async function main() {
    console.log('Seeding database...');

    // 1. Create Host User
    const host = await prisma.user.upsert({
        where: { email: 'host@example.com' },
        update: {},
        create: {
            email: 'host@example.com',
            name: 'Official Host',
            passwordHash: 'hashedpassword', // In real app, hash this
            image: null,
        },
    });
    console.log('Created Host:', host.id);

    // 2. Create User
    const user = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            name: 'Room User',
            passwordHash: 'hashedpassword',
            image: null,
        },
    });
    console.log('Created User:', user.id);

    // 3. Create Listings
    for (const prop of MOCK_PROPERTIES) {
        // Parse Station: "StationName Minutes分" -> split
        // e.g. "下北沢駅 5分"
        const stationParts = prop.station.split(' ');
        const stationName = stationParts[0] || 'Unknown';
        const minutesStr = stationParts[1]?.replace('分', '') || '0';
        const minutesToStation = parseInt(minutesStr);

        // Parse Gender
        let genderRestriction = 'any';
        if (prop.badges.includes('女性専用') || prop.badges.includes('女性限定')) {
            genderRestriction = 'female';
        } else if (prop.badges.includes('男性限定')) {
            genderRestriction = 'male';
        }

        // Parse Amenities (Badges excluding basic types)
        const amenities = prop.badges.filter(b =>
            !['個室', 'ドミトリー', '半個室', '女性専用', '女性限定', '男性限定'].includes(b)
        );

        await prisma.listing.upsert({
            where: { id: prop.id },
            update: {},
            create: {
                id: prop.id,
                title: prop.title,
                description: prop.description,
                rent: Math.floor(parseFloat(prop.price) * 10000),
                prefecture: '東京都', // Mock assumption
                city: prop.area,
                stationLine: 'JR線', // Mock assumption
                stationName: stationName,
                minutesToStation: minutesToStation,
                type: prop.type,
                genderRestriction: genderRestriction,
                amenities: JSON.stringify(amenities),
                images: JSON.stringify(prop.images),
                hostId: host.id,
            }
        });
    }
    console.log('seeded mock properties');

    // 4. Create a Thread (Mock)
    const firstListing = await prisma.listing.findFirst();
    if (firstListing) {
        await prisma.thread.create({
            data: {
                listingId: firstListing.id,
                hostId: host.id,
                guestId: user.id,
                messages: {
                    create: [
                        { senderId: user.id, content: '物件に興味があります。内覧可能でしょうか？' },
                        { senderId: host.id, content: 'お問い合わせありがとうございます。可能です。いつがよろしいですか？' }
                    ]
                }
            }
        });
        console.log('seeded mock thread');
    }

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
