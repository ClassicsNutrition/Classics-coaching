'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getAdminUsersList() {
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
  const supabase = await createAdminClient();

  // Supabase admin delete handles both Auth and (if CASCADE set) Profiles
  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) throw error;
  
  revalidatePath('/admin/users');
  return { success: true };
}

export async function toggleAdminRole(userId: string, currentRole: string) {
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
  const supabase = await createAdminClient();
  const { count, error } = await supabase
    .from('reservations')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');
  if (error) return 0;
  return count || 0;
}

export async function getPendingReservations() {
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
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from('reservations')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
  
  revalidatePath('/admin/users');
  return { success: true };
}
