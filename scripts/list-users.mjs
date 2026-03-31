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

async function listAll() {
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  console.log("Auth Users Count:", authUsers.users.length);
  authUsers.users.forEach(u => {
    if (u.email?.includes('basenutrix')) {
      console.log(`Auth Match: ${u.email} (ID: ${u.id})`);
    }
  });

  const { data: profiles } = await supabase.from('profiles').select('*');
  console.log("Profiles Count:", profiles.length);
  profiles.forEach(p => {
     if (p.email?.includes('basenutrix') || p.id === '14d60685-b303-4f68-b489-a6b3cc71b36d') {
        console.log(`Profile Match: ID=${p.id}, Role=${p.role}, Email=${p.email}`);
     }
  });
}

listAll();
