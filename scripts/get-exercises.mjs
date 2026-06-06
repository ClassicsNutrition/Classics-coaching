import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read env variables manually from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};

const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!url || !serviceKey) {
  console.error("Missing credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function run() {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching exercises:', error);
    process.exit(1);
  }

  fs.writeFileSync('exercises_list.json', JSON.stringify(data, null, 2));
  console.log(`Successfully fetched and wrote ${data.length} exercises to exercises_list.json!`);
}

run();
