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
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log("Starting secure seed...");

    // Use known user or simple email
    const email = 'test_deleter@example.com';
    const password = 'password123';

    // 1. Try Switch - Sign In First
    console.log(`Signing in as ${email}...`);
    let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    let session = signInData?.session;
    let userId = signInData?.user?.id;

    // If sign in failed or no session, try signing up
    if (signInError || !session) {
        console.log("Sign in failed or no session. Attempting sign up...");
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            console.error("Error creating user:", authError);
            return;
        }

        session = authData.session;
        userId = authData.user?.id;

        // If still no session (e.g. email confirmation required), try signing in again
        if (!session && authData.user) {
            console.log("User created but no session. Retrying sign in...");
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (retryError) {
                console.error("Retry sign in failed:", retryError);
            } else {
                session = retryData.session;
                userId = retryData.user?.id;
            }
        }
    }

    if (!session || !userId) {
        console.error("Could not obtain session. User might require email confirmation.");
        return;
    }

    console.log("Authenticated as:", userId);

    // 3. User setup (trigger usually handles public.users? if not, insert/upsert)
    const { error: profileError } = await supabase.from('users').upsert({
        id: userId,
        display_name: 'Map Seeder',
        email: email
    });
    if (profileError) console.error("Profile upsert error:", profileError.message);

    // 4. Insert Listing
    console.log("Inserting listing...");
    const { data: listing, error: listingError } = await supabase.from('listings').insert({
        title: 'Seeded Map House',
        description: 'For testing map.',
        price: 50000,
        address: 'Tokyo Station',
        latitude: 35.681236,
        longitude: 139.767125,
        host_id: userId,
        amenities: ['Wifi']
    }).select().single();

    if (listingError) {
        console.error("Error inserting listing:", listingError);
        return;
    }

    console.log("Inserted listing ID:", listing.id);

    // 5. Insert Review
    console.log("Inserting review...");
    const { error: reviewError } = await supabase.from('reviews').insert({
        listing_id: listing.id,
        user_id: userId,
        rating: 5,
        comment: 'This is a test review for the map.'
    });

    if (reviewError) {
        console.error("Error inserting review:", reviewError);
    } else {
        console.log("Review inserted successfully!");
    }
}

seed().catch(console.error);
