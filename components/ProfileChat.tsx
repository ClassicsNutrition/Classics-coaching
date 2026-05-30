'use client';

import { useEffect, useState, useRef } from 'react';
import { Send, MessageSquare, MessageCircle } from 'lucide-react';
import { 
  getClientChatRoom, getChatMessages, 
  sendChatMessage, markChatAsRead 
} from '@/app/chat/actions';

export default function ProfileChat() {
  const [room, setRoom] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatRoom();
  }, []);

  async function loadChatRoom() {
    setLoading(true);
    try {
      const data = await getClientChatRoom();
      setRoom(data);
      if (data) {
        // Load messages and mark as read
        const msgs = await getChatMessages(data.id);
        setMessages(msgs);
        await markChatAsRead(data.id, 'client');
      }
    } catch (err) {
      console.error("Error loading chat room:", err);
    }
    setLoading(false);
  }

  // Poll messages every 5 seconds if room exists
  useEffect(() => {
    if (!room) return;

    const interval = setInterval(async () => {
      try {
        const msgs = await getChatMessages(room.id);
        setMessages(msgs);
        // Silently mark as read while chatting
        await markChatAsRead(room.id, 'client');
      } catch (err) {
        console.error("Error polling messages:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [room?.id]);

  // Scroll to bottom when messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!inputText.trim() || !room || sending) return;

    setSending(true);
    const msgText = inputText;
    setInputText('');

    try {
      await sendChatMessage(room.id, msgText);
      // Reload messages immediately
      const msgs = await getChatMessages(room.id);
      setMessages(msgs);
    } catch (err: any) {
      alert("Erreur d'envoi : " + err.message);
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div style={{ color: 'rgba(226,232,240,0.4)', textAlign: 'center', padding: '48px 0' }}>
        Chargement de la messagerie...
      </div>
    );
  }

  if (!room) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', color: 'rgba(226,232,240,0.4)' }}>
        <MessageSquare size={48} style={{ margin: '0 auto 16px', opacity: 0.15, display: 'block' }} />
        <h3 style={{ color: 'white', fontWeight: 700, marginBottom: 8, fontSize: '1.05rem' }}>Messagerie privée</h3>
        <p style={{ fontSize: '0.85rem', lineHeight: '1.5', maxWidth: 380, margin: '0 auto' }}>
          Seul votre coach Classics Coaching peut initier une conversation. Dès qu'il vous enverra un message, vous pourrez y répondre et échanger en temps réel ici.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 420, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)' }}>
      {/* Header */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>Discussion avec votre Coach</span>
      </div>

      {/* Messages Log */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12, background: 'rgba(0,0,0,0.1)' }}>
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(226,232,240,0.3)', padding: 20 }}>
            <MessageCircle size={32} style={{ marginBottom: 8, opacity: 0.2 }} />
            <p style={{ fontSize: '0.8rem' }}>Échangez des messages avec votre coach.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === room.user_id; // sender is client
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
                    maxWidth: '75%',
                    padding: '8px 14px',
                    borderRadius: 12,
                    borderTopRightRadius: isMe ? 2 : 12,
                    borderTopLeftRadius: isMe ? 12 : 2,
                    background: isMe ? 'rgba(255, 45, 120, 0.15)' : 'rgba(0, 245, 255, 0.1)',
                    border: isMe ? '1px solid rgba(255, 45, 120, 0.3)' : '1px solid rgba(0, 245, 255, 0.2)',
                    color: 'white',
                    fontSize: '0.82rem',
                    lineHeight: '1.4',
                    wordBreak: 'break-word'
                  }}
                >
                  {msg.message}
                </div>
                <span style={{ fontSize: '0.62rem', color: 'rgba(226,232,240,0.3)', marginTop: 2, padding: '0 4px' }}>
                  {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSendMessage} style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: 10 }}>
        <input
          className="input-miami"
          placeholder="Écrivez un message..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem' }}
          disabled={sending}
        />
        <button
          type="submit"
          className="btn-primary"
          style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          disabled={!inputText.trim() || sending}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
