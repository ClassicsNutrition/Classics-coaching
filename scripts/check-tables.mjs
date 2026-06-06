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

async function checkTables() {
  console.log("Checking tables...");
  
  const { error: notifError } = await supabase
    .from('user_notifications')
    .select('id')
    .limit(1);

  if (notifError) {
    console.log("❌ Table 'user_notifications' error:", notifError.message);
  } else {
    console.log("✅ Table 'user_notifications' exists!");
  }

  const { error: subError } = await supabase
    .from('push_subscriptions')
    .select('id')
    .limit(1);

  if (subError) {
    console.log("❌ Table 'push_subscriptions' error:", subError.message);
  } else {
    console.log("✅ Table 'push_subscriptions' exists!");
  }
}

checkTables();
