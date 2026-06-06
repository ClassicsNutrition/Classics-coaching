'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Helper to check if current user is admin
async function checkAdminOrThrow() {
  const clientSupabase = await createClient();
  const { data: { user } } = await clientSupabase.auth.getUser();
  if (!user) throw new Error("Accès refusé : Non connecté.");

  const { data: profile } = await clientSupabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error("Accès refusé : Administrateur uniquement.");
  }
}

export async function getAdminUsersList() {
  await checkAdminOrThrow();
  const supabase = await createAdminClient();
  
  // Get all profiles
  const { data: profiles, error: pError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (pError) throw pError;

  // Get all auth users to get metadata like last login
  const { data: { users: authUsers }, error: aError } = await supabase.auth.admin.listUsers();
  
  if (aError) throw aError;

  // Merge data
  return profiles.map(profile => {
    const authUser = authUsers.find(u => u.id === profile.id);
    return {
      ...profile,
      email: authUser?.email || profile.email,
      last_sign_in_at: authUser?.last_sign_in_at,
      email_confirmed_at: authUser?.email_confirmed_at,
      is_banned: profile.banned_until ? new Date(profile.banned_until) > new Date() : false
    };
  });
}

export async function banUser(userId: string, hours: number = 87600) { // 10 years default
  await checkAdminOrThrow();
  const supabase = await createAdminClient();
  const bannedUntil = new Date();
  bannedUntil.setHours(bannedUntil.getHours() + hours);

  const { error } = await supabase
    .from('profiles')
    .update({ banned_until: bannedUntil.toISOString() })
    .eq('id', userId);

  if (error) throw error;
  
  revalidatePath('/admin/users');
  return { success: true };
}

export async function unbanUser(userId: string) {
  await checkAdminOrThrow();
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from('profiles')
    .update({ banned_until: null })
    .eq('id', userId);

  if (error) throw error;
  
  revalidatePath('/admin/users');
  return { success: true };
}

export async function deleteUserPermanently(userId: string) {
  await checkAdminOrThrow();
  const supabase = await createAdminClient();

  // Supabase admin delete handles both Auth and (if CASCADE set) Profiles
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) throw error;
  
  revalidatePath('/admin/users');
  return { success: true };
}

export async function toggleAdminRole(userId: string, currentRole: string) {
  await checkAdminOrThrow();
  const supabase = await createAdminClient();
  const newRole = currentRole === 'admin' ? 'client' : 'admin';

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId);

  if (error) throw error;
  
  revalidatePath('/admin/users');
  return { success: true };
}

export async function getPendingReservationsCount() {
  await checkAdminOrThrow();
  const supabase = await createAdminClient();
  const { count, error } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');
  if (error) return 0;
  return count || 0;
}

export async function getPendingReservations() {
  await checkAdminOrThrow();
  const supabase = await createAdminClient();
  
  const { data: res, error } = await supabase
    .from('reservations')
    .select('id, user_id, content_type, content_id, status, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  if (!res || res.length === 0) return [];
  
  const usersList = await getAdminUsersList();
  const { data: programs } = await supabase.from('programs').select('id, title');
  const { data: ebooks } = await supabase.from('ebooks').select('id, title');
  
  return res.map((r: any) => {
    const user = usersList.find(u => u.id === r.user_id);
    let contentTitle = 'Inconnu';
    if (r.content_type === 'program') {
      contentTitle = programs?.find(p => p.id === r.content_id)?.title || 'Programme Inconnu';
    } else if (r.content_type === 'ebook') {
      contentTitle = ebooks?.find(e => e.id === r.content_id)?.title || 'E-book Inconnu';
    }
    
    return {
      ...r,
      user_name: user?.full_name || 'Inconnu',
      user_email: user?.email || 'Inconnu',
      content_title: contentTitle
    };
  });
}

export async function getAdminReservations() {
  await checkAdminOrThrow();
  const supabase = await createAdminClient();
  
  const { data: res, error } = await supabase
    .from('reservations')
    .select('id, user_id, content_type, content_id, status, created_at')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  if (!res || res.length === 0) return [];
  
  const usersList = await getAdminUsersList();
  const { data: programs } = await supabase.from('programs').select('id, title');
  const { data: ebooks } = await supabase.from('ebooks').select('id, title');
  
  return res.map((r: any) => {
    const user = usersList.find(u => u.id === r.user_id);
    let contentTitle = 'Inconnu';
    if (r.content_type === 'program') {
      contentTitle = programs?.find(p => p.id === r.content_id)?.title || 'Programme Inconnu';
    } else if (r.content_type === 'ebook') {
      contentTitle = ebooks?.find(e => e.id === r.content_id)?.title || 'E-book Inconnu';
    }
    
    return {
      ...r,
      user_name: user?.full_name || 'Inconnu',
      user_email: user?.email || 'Inconnu',
      content_title: contentTitle
    };
  });
}

export async function updateReservationStatus(id: string, status: 'granted' | 'revoked' | 'pending') {
  await checkAdminOrThrow();
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
  
  revalidatePath('/admin/users');
  return { success: true };
}

export async function getContentReservations(contentId: string, contentType: 'ebook' | 'program') {
  await checkAdminOrThrow();
  const supabase = await createAdminClient();
  
  const { data: res, error } = await supabase
    .from('reservations')
    .select('id, user_id, content_type, content_id, status, created_at')
    .eq('content_id', contentId)
    .eq('content_type', contentType)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  if (!res || res.length === 0) return [];
  
  const usersList = await getAdminUsersList();
  
  return res.map((r: any) => {
    const user = usersList.find(u => u.id === r.user_id);
    return {
      ...r,
      profiles: {
        email: user?.email || 'Inconnu'
      }
    };
  });
}

export async function grantContentAccess(email: string, contentId: string, contentType: 'ebook' | 'program') {
  await checkAdminOrThrow();
  const supabase = await createAdminClient();
  
  // Find user by email from the auth users
  const { data: { users }, error: aError } = await supabase.auth.admin.listUsers();
  if (aError) throw aError;
  
  const targetUser = users.find(u => u.email?.toLowerCase() === email.trim().toLowerCase());
  if (!targetUser) {
    throw new Error("Ce client n'a pas encore créé de compte sur le site. Il doit s'inscrire avant que vous puissiez lui accorder l'accès.");
  }
  
  const { error } = await supabase.from('reservations').upsert({
    user_id: targetUser.id,
    content_type: contentType,
    content_id: contentId,
    status: 'granted'
  }, { onConflict: 'user_id,content_type,content_id' });
  
  if (error) throw error;
  return { success: true };
}

export async function toggleContentAccess(reservationId: string, currentStatus: string) {
  await checkAdminOrThrow();
  const supabase = await createAdminClient();
  const newStatus = currentStatus === 'granted' ? 'revoked' : 'granted';
  
  const { error } = await supabase
    .from('reservations')
    .update({ status: newStatus })
    .eq('id', reservationId);
    
  if (error) throw error;
  return { success: true };
}

export async function deleteContentReservation(reservationId: string) {
  await checkAdminOrThrow();
  const supabase = await createAdminClient();
  
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', reservationId);
    
  if (error) throw error;
  return { success: true };
}
