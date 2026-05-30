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

// 1. Create chat room (Admin only)
export async function createChatRoom(userId: string) {
  const isAdmin = await isAdminUser();
  if (!isAdmin) throw new Error("Accès refusé : Administrateurs uniquement.");
  
  const supabase = await createAdminClient();
  
  // Check if room already exists
  const { data: existing } = await supabase
    .from('chat_rooms')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (existing) return existing;
  
  // Create new room
  const { data: newRoom, error } = await supabase
    .from('chat_rooms')
    .insert({ user_id: userId })
    .select('*')
    .single();
    
  if (error) throw error;
  return newRoom;
}

// 2. Send message (Both admin and client)
export async function sendChatMessage(roomId: string, message: string) {
  const supabase = await createClient();
  const { data: { user }, error: uError } = await supabase.auth.getUser();
  if (uError || !user) throw new Error("Non connecté.");
  
  const senderId = user.id;
  
  // Fetch room to verify access
  const adminSupabase = await createAdminClient();
  const { data: room, error: rError } = await adminSupabase
    .from('chat_rooms')
    .select('*')
    .eq('id', roomId)
    .single();
    
  if (rError || !room) throw new Error("Salon de discussion introuvable.");
  
  const isAdmin = await isAdminUser();
  // If not admin, the room user_id must match the sender_id
  if (!isAdmin && room.user_id !== senderId) {
    throw new Error("Accès interdit.");
  }
  
  // Insert the message
  const { data: newMsg, error: mError } = await adminSupabase
    .from('chat_messages')
    .insert({
      room_id: roomId,
      sender_id: senderId,
      message
    })
    .select('*')
    .single();
    
  if (mError) throw mError;
  
  // Update unread count & updated_at on the room
  const updates: any = { updated_at: new Date().toISOString() };
  if (isAdmin) {
    // Admin sent it -> increment user's unread count
    updates.user_unread_count = (room.user_unread_count || 0) + 1;
  } else {
    // Client sent it -> increment admin's unread count
    updates.admin_unread_count = (room.admin_unread_count || 0) + 1;
  }
  
  const { error: roomUpdateError } = await adminSupabase
    .from('chat_rooms')
    .update(updates)
    .eq('id', roomId);
    
  if (roomUpdateError) console.error("Error updating chat room state:", roomUpdateError);
  
  return newMsg;
}

// 3. Get messages for a room
export async function getChatMessages(roomId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non connecté.");
  
  const adminSupabase = await createAdminClient();
  const { data: room } = await adminSupabase
    .from('chat_rooms')
    .select('*')
    .eq('id', roomId)
    .single();
    
  if (!room) throw new Error("Salon de discussion introuvable.");
  
  const isAdmin = await isAdminUser();
  if (!isAdmin && room.user_id !== user.id) {
    throw new Error("Accès interdit.");
  }
  
  const { data: messages, error } = await adminSupabase
    .from('chat_messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });
    
  if (error) throw error;
  return messages;
}

// 4. Mark room as read
export async function markChatAsRead(roomId: string, role: 'admin' | 'client') {
  const adminSupabase = await createAdminClient();
  
  const updates: any = {};
  if (role === 'admin') {
    updates.admin_unread_count = 0;
  } else {
    updates.user_unread_count = 0;
  }
  
  const { error } = await adminSupabase
    .from('chat_rooms')
    .update(updates)
    .eq('id', roomId);
    
  if (error) throw error;
  return { success: true };
}

// 5. Get all chat rooms for admin
export async function getAdminChatRooms() {
  const isAdmin = await isAdminUser();
  if (!isAdmin) throw new Error("Accès refusé.");
  
  const adminSupabase = await createAdminClient();
  
  // Get all chat rooms ordered by last update
  const { data: rooms, error } = await adminSupabase
    .from('chat_rooms')
    .select('*')
    .order('updated_at', { ascending: false });
    
  if (error) throw error;
  if (!rooms || rooms.length === 0) return [];
  
  // Fetch profiles for all chat room users
  const userIds = rooms.map(r => r.user_id);
  const { data: profiles } = await adminSupabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', userIds);
    
  // Fetch auth users to get email
  const { data: { users: authUsers } } = await adminSupabase.auth.admin.listUsers();
  
  // For each room, fetch the last message
  const roomsWithDetails = await Promise.all(rooms.map(async (room) => {
    const profile = profiles?.find(p => p.id === room.user_id);
    const authUser = authUsers?.find(u => u.id === room.user_id);
    
    const { data: lastMsgs } = await adminSupabase
      .from('chat_messages')
      .select('message, created_at, sender_id')
      .eq('room_id', room.id)
      .order('created_at', { ascending: false })
      .limit(1);
      
    const lastMsg = lastMsgs?.[0] || null;
    
    return {
      ...room,
      user_name: profile?.full_name || authUser?.email?.split('@')[0] || 'Client',
      user_email: authUser?.email || 'Inconnu',
      user_avatar: profile?.avatar_url || null,
      last_message: lastMsg?.message || null,
      last_message_time: lastMsg?.created_at || room.updated_at,
      last_message_sender: lastMsg?.sender_id || null
    };
  }));
  
  return roomsWithDetails;
}

// 6. Get current client's chat room
export async function getClientChatRoom() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const adminSupabase = await createAdminClient();
  
  // Check if room exists
  const { data: room, error } = await adminSupabase
    .from('chat_rooms')
    .select('*')
    .eq('user_id', user.id)
    .single();
    
  if (error || !room) return null;
  
  return room;
}

// 7. Get total unread count for admin
export async function getAdminTotalUnreadCount() {
  const isAdmin = await isAdminUser();
  if (!isAdmin) return 0;
  
  const adminSupabase = await createAdminClient();
  const { data: rooms } = await adminSupabase
    .from('chat_rooms')
    .select('admin_unread_count');
    
  if (!rooms) return 0;
  return rooms.reduce((sum, r) => sum + (r.admin_unread_count || 0), 0);
}
