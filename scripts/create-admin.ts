
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createAdmin() {
  const email = 'basenutrix@gmail.com';
  const password = 'claptondz';

  console.log(`Checking if user ${email} exists...`);
  
  // Create user via admin API
  const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (createError) {
    if (createError.message.includes('already registered')) {
      console.log("User already exists. Fetching ID...");
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const user = users.find(u => u.email === email);
      if (user) {
        await elevateToAdmin(user.id);
      }
    } else {
      console.error("Error creating user:", createError.message);
    }
  } else if (newUser.user) {
    console.log("User created successfully:", newUser.user.id);
    await elevateToAdmin(newUser.user.id);
  }
}

async function elevateToAdmin(userId: string) {
  console.log(`Elevating user ${userId} to admin...`);
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ role: 'admin' })
    .eq('id', userId);

  if (updateError) {
    console.error("Error updating profile:", updateError.message);
    // If profile doesn't exist yet, insert it
    const { error: insertError } = await supabase
      .from('profiles')
      .upsert({ id: userId, email: 'basenutrix@gmail.com', role: 'admin' });
    
    if (insertError) {
      console.error("Error inserting profile:", insertError.message);
    } else {
      console.log("Profile created and elevated to admin.");
    }
  } else {
    console.log("Profile updated to admin successfully.");
  }
}

createAdmin();
