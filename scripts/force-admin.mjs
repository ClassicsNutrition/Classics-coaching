import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const serviceRoleKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function forceAdmin() {
  const emailRegex = '%basenutrix%';
  
  // 1. Find all users in Auth with this email
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const targetUsers = users.filter(u => u.email?.toLowerCase().includes('basenutrix'));
  
  console.log(`Found ${targetUsers.length} matching users in Auth.`);

  for (const user of targetUsers) {
    console.log(`Processing User: ${user.email} (ID: ${user.id})`);
    
    // 2. Ensure profile exists and has role admin
    const { data: profile, error: pError } = await supabase
      .from('profiles')
      .upsert({ 
        id: user.id, 
        role: 'admin',
        full_name: 'Administrateur'
      })
      .select()
      .single();
      
    if (pError) console.error(`Error updating profile for ${user.id}:`, pError);
    else console.log(`Profile updated to Admin for ${user.id}`);

    // 3. Update app_metadata just in case
    const { error: aError } = await supabase.auth.admin.updateUserById(
      user.id,
      { app_metadata: { role: 'admin' } }
    );
    if (aError) console.error(`Error updating app_metadata for ${user.id}:`, aError);
    else console.log(`App Metadata updated to Admin for ${user.id}`);
  }
}

forceAdmin();
