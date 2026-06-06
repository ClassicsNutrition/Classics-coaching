'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Helper to check if current user is admin
async function isAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
    
  return profile?.role === 'admin';
}

// 1. Get notifications for the logged in user
export async function getUserNotifications() {
  const supabase = await createClient();
  const { data: { user }, error: uError } = await supabase.auth.getUser();
  if (uError || !user) return [];

  const { data, error } = await supabase
    .from('user_notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching user notifications:", error);
    return [];
  }
  return data || [];
}

// 2. Mark specific notification as read
export async function markNotificationAsRead(id: string) {
  const supabase = await createClient();
  const { data: { user }, error: uError } = await supabase.auth.getUser();
  if (uError || !user) throw new Error("Non connecté.");

  const { error } = await supabase
    .from('user_notifications')
    .update({ is_read: true })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
  return { success: true };
}

// 3. Mark all notifications as read for current user
export async function markAllNotificationsAsRead() {
  const supabase = await createClient();
  const { data: { user }, error: uError } = await supabase.auth.getUser();
  if (uError || !user) throw new Error("Non connecté.");

  const { error } = await supabase
    .from('user_notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false);

  if (error) throw error;
  return { success: true };
}

// 4. Delete specific notification
export async function deleteNotification(id: string) {
  const supabase = await createClient();
  const { data: { user }, error: uError } = await supabase.auth.getUser();
  if (uError || !user) throw new Error("Non connecté.");

  const { error } = await supabase
    .from('user_notifications')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
  return { success: true };
}

// 5. Create notifications (Admin only)
// If target is "all", it will create notification for all clients.
// Otherwise it will target specific userIds in the array.
export async function createAdminNotification(title: string, body: string, targetType: 'all' | 'targeted', userIds: string[]) {
  const isAdmin = await isAdminUser();
  if (!isAdmin) throw new Error("Accès refusé : Administrateurs uniquement.");

  const adminSupabase = await createAdminClient();
  let recipientIds: string[] = [];

  if (targetType === 'all') {
    // Fetch all profiles that have the role 'client'
    const { data: clients, error: fetchErr } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('role', 'client');

    if (fetchErr) throw fetchErr;
    recipientIds = clients?.map(c => c.id) || [];
  } else {
    recipientIds = userIds;
  }

  if (recipientIds.length === 0) {
    return { success: true, count: 0 };
  }

  // Batch insert notifications
  const notificationsToInsert = recipientIds.map(uid => ({
    user_id: uid,
    title,
    body,
    type: 'admin_broadcast',
    is_read: false
  }));

  const { error: insertErr } = await adminSupabase
    .from('user_notifications')
    .insert(notificationsToInsert);

  if (insertErr) throw insertErr;

  return { success: true, count: recipientIds.length };
}

// 6. Helper to list all clients for target list (Admin only)
export async function getClientsListForNotification() {
  const isAdmin = await isAdminUser();
  if (!isAdmin) throw new Error("Accès refusé.");

  const adminSupabase = await createAdminClient();
  const { data, error } = await adminSupabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'client')
    .order('full_name', { ascending: true });

  if (error) throw error;
  return data || [];
}

// 7. Get sent notifications history for admin
export async function getAdminSentNotifications() {
  const isAdmin = await isAdminUser();
  if (!isAdmin) throw new Error("Accès refusé.");

  const adminSupabase = await createAdminClient();
  const { data, error } = await adminSupabase
    .from('user_notifications')
    .select(`
      id,
      title,
      body,
      created_at,
      user_id,
      profiles (
        full_name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data || [];
}
