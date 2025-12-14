
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Credentials not found in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyLatestUser() {
    console.log('--- Checking Database for New Users ---');

    // Fetch the most recent user from public.users
    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        console.error('Database Error:', error.message);
        return;
    }

    if (!users || users.length === 0) {
        console.log('Result: No users found in the PUBLIC database table yet.');
        console.log('If you just signed up, the Trigger might verify/sync latency or Email Confirmation is pending.');
    } else {
        const u = users[0];
        console.log('✅ Success! Found latest user:');
        console.log(`- ID: ${u.id}`);
        console.log(`- Name: ${u.display_name}`);
        console.log(`- Email: ${u.email}`);
        console.log(`- Created At: ${new Date(u.created_at).toLocaleString()}`);
    }
}

verifyLatestUser();
