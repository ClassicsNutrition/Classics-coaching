import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read env variables manually from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSubscriptions() {
  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select(`
      id,
      user_id,
      endpoint,
      created_at,
      profiles (
        full_name,
        role
      )
    `);

  if (error) {
    console.error("Error fetching subscriptions:", error);
    return;
  }

  console.log(`\nFound ${subs.length} push subscription(s) in the database:\n`);
  subs.forEach((sub, idx) => {
    console.log(`${idx + 1}. User: ${sub.profiles?.full_name || 'Unknown'} (ID: ${sub.user_id})`);
    console.log(`   Role: ${sub.profiles?.role || 'None'}`);
    console.log(`   Endpoint: ${sub.endpoint.substring(0, 60)}...`);
    console.log(`   Created: ${sub.created_at}`);
    console.log("-------------------------------------------------");
  });
}

checkSubscriptions();
