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

async function checkProfilesColumns() {
  // Query Supabase postgrest schema or retrieve a row
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Error fetching profiles row:", error);
    return;
  }

  if (data && data.length > 0) {
    console.log("\nExisting columns in 'profiles' table:", Object.keys(data[0]));
  } else {
    // If table is empty, try running a system catalog query via rpc if possible or select all columns metadata
    console.log("Profiles table is empty, trying to insert and rollback or querying schema...");
    // Let's query public table definitions if we can
    const { data: cols, error: colError } = await supabase
      .rpc('get_table_columns', { table_name: 'profiles' }); // might not exist

    if (colError) {
      console.log("Could not query via RPC, selecting empty columns:", colError.message);
    } else {
      console.log("Columns from RPC:", cols);
    }
  }
}

checkProfilesColumns();
