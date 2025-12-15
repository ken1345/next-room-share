const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = {};
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, val] = line.split('=');
        if (key && val) {
            envConfig[key.trim()] = val.trim();
        }
    });
}

const supabaseUrl = envConfig['NEXT_PUBLIC_SUPABASE_URL'] || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Using Service Role Key if available for bypassing RLS, otherwise Anon key + login would be needed.
// But we used 'authenticated' policy for insert.
// To keep it simple, let's try to grab a Service Key if present, otherwise we need to sign in.
// Actually, usually local dev has a service key in .env.local?? No, usually just anon.
// If RLS blocks anon insert (authenticated only), we need a session.
// We can use signIn with password if we know a user.
// Ooor we can just use the Service Key if we can find it.
// Supabase local dev outputs it properly usually?
// Let's assume we need to sign in or use a provided service key if user added it.

// Check for Service Role Key in env (often SUPABASE_SERVICE_ROLE_KEY)
const serviceRoleKey = envConfig['SUPABASE_SERVICE_ROLE_KEY'] || process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceRoleKey || supabaseKey);

async function seed() {
    console.log("Starting seed...");

    // Authenticate if no service role key
    if (!serviceRoleKey) {
        console.log("No service role key found. Attempting to sign in with test user...");
        // This is fragile if test user doesn't exist.
        // Let's try to just use what we have. If RLS fails, we'll know.
        // Actually the SQL policy I added says: "Authenticated users can create reviews"
        // But for listings? "Hosts can insert listings."
        // We are inserting listings too.
        // Maybe we should just use SQL via `supabase db query` for the listings insert since that worked usually?
        // But `seed_reviews.sql` failed.
    }

    // 1. Get a user
    const { data: users, error: userError } = await supabase.from('users').select('id').limit(1);
    if (userError || !users || users.length === 0) {
        console.error("No users found. Please signup at least one user first.", userError);
        return;
    }
    const userId = users[0].id;

    // 2. Listings to insert/upsert
    const listings = [
        {
            title: 'Sunny Share House Tokyo',
            description: 'A bright and sunny share house in the heart of Tokyo.',
            price: 65000,
            address: 'Shibuya, Tokyo',
            latitude: 35.6585805,
            longitude: 139.7016429,
            host_id: userId,
            amenities: ['Wifi', 'Kitchen']
        },
        {
            title: 'Traditional Kyoto Machiya',
            description: 'Experience traditional living.',
            price: 45000,
            address: 'Kyoto City',
            latitude: 35.011636,
            longitude: 135.768029,
            host_id: userId,
            amenities: ['Tatami', 'Shared Bath']
        },
        {
            title: 'Osaka Foodie House',
            description: 'Near Dotonbori.',
            price: 40000,
            address: 'Osaka City',
            latitude: 34.693737,
            longitude: 135.502165,
            host_id: userId,
            amenities: ['Kitchen', 'Bicycle']
        },
        {
            title: 'Snowy Lodge Sapporo',
            description: 'Great for ski lovers.',
            price: 35000,
            address: 'Sapporo',
            latitude: 43.062096,
            longitude: 141.354376,
            host_id: userId,
            amenities: ['Heating', 'Ski Storage']
        },
        {
            title: 'Beachfront Villa',
            description: 'Walk to the sea.',
            price: 50000,
            address: 'Naha',
            latitude: 26.212401,
            longitude: 127.680932,
            host_id: userId,
            amenities: ['AC', 'Surfboard Storage']
        }
    ];

    console.log("Upserting listings...");
    // We can't upsert easily without ID or unique constraint on title?
    // Title is not unique.
    // We'll search for existing listing by title, if found use ID, else insert.

    for (const l of listings) {
        let listingId;
        const { data: existing } = await supabase.from('listings').select('id').eq('title', l.title).single();

        if (existing) {
            listingId = existing.id;
            console.log(`Found existing listing: ${l.title}`);
        } else {
            const { data: string, error } = await supabase.from('listings').insert(l).select().single();
            if (error) {
                console.error(`Error inserting ${l.title}:`, error);
                continue;
            }
            listingId = string.id;
            console.log(`Inserted listing: ${l.title}`);
        }

        // 3. Insert Reviews
        if (listingId) {
            // Check if review already exists? Skip for simplicity or just add.
            const { error: reviewError } = await supabase.from('reviews').insert([
                { listing_id: listingId, user_id: userId, rating: 5, comment: `Great place! ${l.title} is amazing.` },
                { listing_id: listingId, user_id: userId, rating: 4, comment: 'Nice location.' }
            ]);
            if (reviewError) console.error("Error inserting review:", reviewError);
            else console.log(`Added reviews for ${l.title}`);
        }
    }
}

seed().catch(console.error);
