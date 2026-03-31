import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read env variables manually since dotenv might not be available for raw node in all envs
const envContent = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createAdmin() {
  const email = 'basenutrix@gmail.com';
  const password = 'claptondz';

  console.log(`Creating/Elevating user ${email}...`);
  
  // Create user
  const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  let userId = newUser?.user?.id;

  if (createError) {
    console.log("Create error details:", JSON.stringify(createError, null, 2));
    // Try to find the user anyway
    console.log("Attempting to find user ID by email...");
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) console.error("List users error:", listError);
    const user = users?.find(u => u.email === email);
    if (user) {
      userId = user.id;
      console.log("Found user ID:", userId);
    } else {
      console.log("User NOT found in the list.");
    }
  }

  if (userId) {
    console.log("Setting admin role for ID:", userId);
    const { error: upError } = await supabase
      .from('profiles')
      .upsert({ id: userId, role: 'admin' }, { onConflict: 'id' });

    if (upError) {
      console.error("Error setting role:", upError.message);
    } else {
      console.log("✅ Admin user setup complete!");
    }
  }
}

createAdmin();
