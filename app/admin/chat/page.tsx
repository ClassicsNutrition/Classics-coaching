'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Send, RefreshCw, MessageSquare, MessageCircle
} from 'lucide-react';
import { 
  getAdminChatRooms, createChatRoom, 
  getChatMessages, sendChatMessage, markChatAsRead 
} from '@/app/chat/actions';

function AdminChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [rooms, setRooms] = useState<any[]>([]);
  const [activeRoom, setActiveRoom] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const targetUserId = searchParams.get('userId');

  // Load chat rooms on mount
  useEffect(() => {
    loadRooms();
    const interval = setInterval(loadRooms, 10000); // poll rooms list every 10s
    return () => clearInterval(interval);
  }, []);

  async function loadRooms() {
    try {
      const data = await getAdminChatRooms();
      setRooms(data);
      
      // If we are currently viewing a room, update its local data
      if (activeRoom) {
        const updated = data.find((r: any) => r.id === activeRoom.id);
        if (updated) {
          setActiveRoom(updated);
        }
      }
    } catch (err) {
      console.error("Error loading chat rooms:", err);
    } finally {
      setLoadingRooms(false);
    }
  }

  // Handle opening or creating a room from URL userId param
  useEffect(() => {
    if (targetUserId && !loadingRooms) {
      handleOpenOrCreateRoom(targetUserId);
    }
  }, [targetUserId, loadingRooms]);

  async function handleOpenOrCreateRoom(userId: string) {
    try {
      const room = await createChatRoom(userId);
      
      // Fetch the updated rooms list so the new room is included with user details
      const updatedRooms = await getAdminChatRooms();
      setRooms(updatedRooms);
      
      // Find room in the list to get full details (like user_name, user_email)
      const fullRoom = updatedRooms.find((r: any) => r.id === room.id) || {
        ...room,
        user_name: 'Client',
        user_email: ''
      };
      
      setActiveRoom(fullRoom);
      
      // Clear URL parameter so it doesn't trigger repeatedly
      router.replace('/admin/chat');
    } catch (err: any) {
      alert("Erreur lors de la création du salon : " + err.message);
    }
  }

  // Load messages when active room changes
  useEffect(() => {
    if (!activeRoom) return;

    loadMessages(activeRoom.id);
    markChatAsRead(activeRoom.id, 'admin'); // Mark as read on open
    
    // Poll messages every 5 seconds for the active room
    const interval = setInterval(() => {
      loadMessages(activeRoom.id, false);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeRoom?.id]);

  async function loadMessages(roomId: string, showLoading = true) {
    if (showLoading) setLoadingMessages(true);
    try {
      const data = await getChatMessages(roomId);
      setMessages(data);
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      if (showLoading) setLoadingMessages(false);
    }
  }

  // Scroll to bottom when messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message handler
  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!inputText.trim() || !activeRoom || sending) return;

    setSending(true);
    const msgText = inputText;
    setInputText('');

    try {
      await sendChatMessage(activeRoom.id, msgText);
      await loadMessages(activeRoom.id, false);
      await loadRooms(); // refresh sidebar list
    } catch (err: any) {
      alert("Erreur d'envoi : " + err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 40px)', display: 'flex', gap: 24, boxSizing: 'border-box' }}>
      {/* Rooms List Panel */}
      <div className="card-glass" style={{ width: 340, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'white', margin: 0 }}>Conversations</h2>
          <button onClick={loadRooms} className="btn-ghost" style={{ padding: 6 }} title="Actualiser">
            <RefreshCw size={14} className={loadingRooms ? 'animate-spin' : ''} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {loadingRooms && rooms.length === 0 ? (
            <div style={{ color: 'rgba(226,232,240,0.4)', textAlign: 'center', padding: 40, fontSize: '0.85rem' }}>
              Chargement des discussions...
            </div>
          ) : rooms.length === 0 ? (
            <div style={{ color: 'rgba(226,232,240,0.3)', textAlign: 'center', padding: 40, fontSize: '0.85rem' }}>
              Aucune conversation active. Lancez une discussion depuis la liste des utilisateurs.
            </div>
          ) : (
            rooms.map((room) => {
              const isActive = activeRoom?.id === room.id;
              const hasUnread = room.admin_unread_count > 0;
              
              return (
                <button
                  key={room.id}
                  onClick={() => {
                    setActiveRoom(room);
                    markChatAsRead(room.id, 'admin');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '16px 20px',
                    width: '100%',
                    background: isActive ? 'rgba(255, 45, 120, 0.08)' : 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.02)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  className="chat-room-item"
                >
                  <div style={{ 
                    width: 44, height: 44, borderRadius: '50%', 
                    background: room.user_avatar ? 'transparent' : 'linear-gradient(135deg, #00F5FF, #7B2FBE)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                    fontWeight: 700, overflow: 'hidden', flexShrink: 0
                  }}>
                    {room.user_avatar ? (
                      <img src={room.user_avatar} alt={room.user_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      (room.user_name || '?')[0].toUpperCase()
                    )}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                      <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {room.user_name}
                      </span>
                      {room.last_message_time && (
                        <span style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.7rem' }}>
                          {new Date(room.last_message_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <span style={{ 
                        color: hasUnread ? 'white' : 'rgba(226,232,240,0.4)', 
                        fontWeight: hasUnread ? 600 : 400,
                        fontSize: '0.78rem',
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        flex: 1
                      }}>
                        {room.last_message || 'Nouvelle conversation'}
                      </span>
                      
                      {hasUnread && (
                        <span style={{ 
                          background: 'var(--miami-pink)', 
                          color: 'white', 
                          fontSize: '0.65rem', 
                          fontWeight: 'bold', 
                          borderRadius: 10, 
                          padding: '1px 6px',
                          boxShadow: '0 0 6px var(--miami-pink)'
                        }}>
                          {room.admin_unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Message Chat Panel */}
      <div className="card-glass" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        {activeRoom ? (
          <>
            {/* Active Room Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: '50%', 
                  background: activeRoom.user_avatar ? 'transparent' : 'linear-gradient(135deg, #00F5FF, #7B2FBE)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                  fontWeight: 700, overflow: 'hidden'
                }}>
                  {activeRoom.user_avatar ? (
                    <img src={activeRoom.user_avatar} alt={activeRoom.user_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    (activeRoom.user_name || '?')[0].toUpperCase()
                  )}
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>{activeRoom.user_name}</div>
                  <div style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.75rem' }}>{activeRoom.user_email}</div>
                </div>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(0,0,0,0.1)' }}>
              {loadingMessages && messages.length === 0 ? (
                <div style={{ color: 'rgba(226,232,240,0.4)', textAlign: 'center', padding: 20 }}>Chargement des messages...</div>
              ) : messages.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(226,232,240,0.3)', padding: 40 }}>
                  <MessageCircle size={40} style={{ marginBottom: 12, opacity: 0.2 }} />
                  <p style={{ fontSize: '0.85rem' }}>Aucun message dans cette discussion.</p>
                  <p style={{ fontSize: '0.75rem' }}>Envoyez un message pour commencer l'échange.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id !== activeRoom.user_id; // sender is admin
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMe ? 'flex-end' : 'flex-start',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '70%',
                          padding: '10px 16px',
                          borderRadius: 14,
                          borderTopRightRadius: isMe ? 2 : 14,
                          borderTopLeftRadius: isMe ? 14 : 2,
                          background: isMe ? 'rgba(255, 45, 120, 0.15)' : 'rgba(0, 245, 255, 0.1)',
                          border: isMe ? '1px solid rgba(255, 45, 120, 0.3)' : '1px solid rgba(0, 245, 255, 0.2)',
                          color: 'white',
                          fontSize: '0.85rem',
                          lineHeight: '1.4',
                          wordBreak: 'break-word'
                        }}
                      >
                        {msg.message}
                      </div>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(226,232,240,0.3)', marginTop: 4, padding: '0 4px' }}>
                        {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Message Form */}
            <form onSubmit={handleSendMessage} style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: 12 }}>
              <input
                className="input-miami"
                placeholder="Votre message..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                style={{ flex: 1, padding: '12px 16px', fontSize: '0.9rem' }}
                disabled={sending}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                disabled={!inputText.trim() || sending}
              >
                <Send size={16} className={sending ? 'animate-pulse' : ''} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(226,232,240,0.3)', padding: 40 }}>
            <MessageSquare size={48} style={{ color: 'rgba(255,255,255,0.08)', marginBottom: 16 }} />
            <h3 style={{ color: 'white', fontWeight: 600, marginBottom: 4 }}>Messagerie Directe</h3>
            <p style={{ fontSize: '0.85rem', maxWidth: 360, textAlign: 'center' }}>
              Sélectionnez une discussion à gauche, ou lancez un chat avec un client depuis la section Utilisateurs.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .chat-room-item:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }
      `}</style>
    </div>
  );
}

export default function AdminChatPage() {
  return (
    <Suspense fallback={<div style={{ color: 'white', padding: 40, textAlign: 'center' }}>Chargement de la messagerie...</div>}>
      <AdminChatContent />
    </Suspense>
  );
}
