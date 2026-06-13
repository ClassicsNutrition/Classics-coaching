'use client';

import { useEffect, useState, useRef } from 'react';
import { Send, MessageSquare, MessageCircle, Smile, Dumbbell, Search, X, Play, Info } from 'lucide-react';
import { 
  getClientChatRoom, getChatMessages, 
  sendChatMessage, markChatAsRead,
  getExercisesList
} from '@/app/chat/actions';
import { createClient } from '@/lib/supabase/client';

const UNIQUE_EMOJIS = [
  '💪', '🏋️‍♂️', '🏃‍♂️', '🧘‍♂️', '🥗', '🍎', '🥦',
  '🥑', '🍌', '🍗', '🥩', '🥚', '🥛', '💧',
  '⚡', '🎯', '🏆', '🔥', '✨', '❤️', '👍',
  '🙌', '👏', '😎', '😊', '✌️', '🚀', '⭐'
];

export default function ProfileChat() {
  const [room, setRoom] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  // Custom picker and exercise states
  const [exercisesList, setExercisesList] = useState<any[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [activeExercise, setActiveExercise] = useState<any | null>(null);

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const exerciseSelectorRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatRoom();
    
    // Fetch exercises list on mount
    async function fetchExercises() {
      try {
        const list = await getExercisesList();
        setExercisesList(list);
      } catch (err) {
        console.error("Error fetching exercises list:", err);
      }
    }
    fetchExercises();
  }, []);

  // Handle click outside to close popovers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (exerciseSelectorRef.current && !exerciseSelectorRef.current.contains(event.target as Node)) {
        setShowExerciseSelector(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  // Scroll to bottom of the container when messages list changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
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
    <div style={{ display: 'flex', flexDirection: 'column', height: 420, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.01)', position: 'relative' }}>
      {/* Header */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>Discussion avec votre Coach</span>
      </div>

      {/* Messages Log */}
      <div 
        ref={chatContainerRef}
        style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12, background: 'rgba(0,0,0,0.1)' }}
      >
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(226,232,240,0.3)', padding: 20 }}>
            <MessageCircle size={32} style={{ marginBottom: 8, opacity: 0.2 }} />
            <p style={{ fontSize: '0.8rem' }}>Échangez des messages avec votre coach.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === room.user_id; // sender is client
            const isExercise = msg.message.match(/^\[EXERCISE:([a-f0-9-]{36})\]$/i);

            // Bubble rendering helper
            const renderMessageContent = (text: string, isSenderMe: boolean) => {
              if (isExercise) {
                const exerciseId = isExercise[1];
                const exercise = exercisesList.find((e: any) => e.id === exerciseId);
                
                if (exercise) {
                  return (
                    <div 
                      style={{ 
                        background: 'rgba(20, 19, 58, 0.75)', 
                        border: `1px solid ${isSenderMe ? 'rgba(255, 45, 120, 0.4)' : 'rgba(0, 245, 255, 0.3)'}`,
                        borderRadius: '12px',
                        padding: '10px',
                        width: '240px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        boxShadow: isSenderMe ? '0 0 12px rgba(255, 45, 120, 0.12)' : '0 0 12px rgba(0, 245, 255, 0.12)',
                      }}
                    >
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <div style={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: 6, 
                          background: 'rgba(0, 0, 0, 0.3)', 
                          overflow: 'hidden', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0,
                          border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                          {exercise.gif_url ? (
                            <img src={exercise.gif_url} alt={exercise.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <Dumbbell size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: 'white', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {exercise.name}
                          </div>
                          {exercise.muscle_group && (
                            <span style={{ 
                              fontSize: '0.6rem', 
                              color: 'var(--miami-purple-light)', 
                              background: 'rgba(189, 0, 255, 0.12)', 
                              border: '1px solid rgba(189, 0, 255, 0.25)',
                              padding: '0.5px 4px',
                              borderRadius: 3,
                              display: 'inline-block',
                              marginTop: 2,
                              maxWidth: '100%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {exercise.muscle_group.split(',')[0]}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={async () => {
                          setActiveExercise(exercise);
                          if (exercise && !exercise.instructions) {
                            try {
                              const supabase = createClient();
                              const { data, error } = await supabase
                                .from('exercises')
                                .select('instructions')
                                .eq('id', exercise.id)
                                .single();
                              if (data && !error) {
                                setActiveExercise(prev => prev && prev.id === exercise.id ? { ...prev, instructions: data.instructions } : prev);
                                exercise.instructions = data.instructions;
                              }
                            } catch (err) {
                              console.error("Error fetching exercise instructions:", err);
                            }
                          }
                        }}
                        className="btn-ghost"
                        style={{
                          width: '100%',
                          padding: '4px 0',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          borderRadius: 4,
                          borderColor: isSenderMe ? 'rgba(255, 45, 120, 0.3)' : 'rgba(0, 245, 255, 0.3)',
                          color: isSenderMe ? 'var(--miami-pink)' : 'var(--miami-cyan)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 3,
                          cursor: 'pointer'
                        }}
                      >
                        <Play size={8} style={{ fill: 'currentColor' }} /> Voir l'exécution
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '6px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
                      <Dumbbell size={12} /> Exercice partagé (introuvable)
                    </div>
                  );
                }
              }
              return text;
            };

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
                  style={isExercise ? {
                    maxWidth: '75%',
                    borderRadius: 10,
                    color: 'white',
                    fontSize: '0.82rem',
                    wordBreak: 'break-word',
                  } : {
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
                  {renderMessageContent(msg.message, isMe)}
                </div>
                <span style={{ fontSize: '0.62rem', color: 'rgba(226,232,240,0.3)', marginTop: 2, padding: '0 4px' }}>
                  {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSendMessage} style={{ position: 'relative', padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: 10, alignItems: 'center' }}>
        
        {/* Emoji Picker Popover */}
        {showEmojiPicker && (
          <div 
            ref={emojiPickerRef}
            className="card-glass"
            style={{
              position: 'absolute',
              bottom: '64px',
              left: '16px',
              width: '260px',
              padding: '10px',
              border: '1px solid rgba(255, 45, 120, 0.3)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.5), 0 0 12px rgba(255, 45, 120, 0.15)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              background: 'rgba(20, 19, 58, 0.95)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 4 }}>
              <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em' }}>ÉMOJIS</span>
              <button type="button" onClick={() => setShowEmojiPicker(false)} style={{ background: 'none', border: 'none', color: 'rgba(226,232,240,0.4)', cursor: 'pointer', padding: 2 }}>
                <X size={12} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {UNIQUE_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setInputText(prev => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  style={{
                    fontSize: '1.15rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  className="emoji-btn"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Exercise Selector Popover */}
        {showExerciseSelector && (
          <div 
            ref={exerciseSelectorRef}
            className="card-glass"
            style={{
              position: 'absolute',
              bottom: '64px',
              right: '16px',
              width: '280px',
              padding: '12px',
              border: '1px solid rgba(0, 245, 255, 0.3)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.5), 0 0 12px rgba(0, 245, 255, 0.15)',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              background: 'rgba(20, 19, 58, 0.95)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 4 }}>
              <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em' }}>PARTAGER UN EXERCICE</span>
              <button type="button" onClick={() => setShowExerciseSelector(false)} style={{ background: 'none', border: 'none', color: 'rgba(226,232,240,0.4)', cursor: 'pointer', padding: 2 }}>
                <X size={12} />
              </button>
            </div>
            
            <div style={{ position: 'relative' }}>
              <Search size={12} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--miami-cyan)' }} />
              <input
                type="text"
                className="input-miami"
                placeholder="Rechercher..."
                value={exerciseSearch}
                onChange={e => setExerciseSearch(e.target.value)}
                style={{ width: '100%', padding: '4px 8px 4px 24px', fontSize: '0.75rem', height: 'auto', borderRadius: 4 }}
              />
            </div>

            <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, paddingRight: 2 }} className="scroll-mini">
              {exercisesList.filter(ex => 
                ex.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(exerciseSearch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ||
                (ex.muscle_group && ex.muscle_group.toLowerCase().includes(exerciseSearch.toLowerCase()))
              ).length === 0 ? (
                <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 8, fontSize: '0.7rem' }}>
                  Aucun exercice trouvé
                </div>
              ) : (
                exercisesList.filter(ex => 
                  ex.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(exerciseSearch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ||
                  (ex.muscle_group && ex.muscle_group.toLowerCase().includes(exerciseSearch.toLowerCase()))
                ).map(ex => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={async () => {
                      setShowExerciseSelector(false);
                      setExerciseSearch('');
                      setSending(true);
                      try {
                        await sendChatMessage(room.id, `[EXERCISE:${ex.id}]`);
                        // Reload messages immediately
                        const msgs = await getChatMessages(room.id);
                        setMessages(msgs);
                      } catch (err: any) {
                        alert("Erreur d'envoi : " + err.message);
                      } finally {
                        setSending(false);
                      }
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '6px 8px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      transition: 'all 0.2s'
                    }}
                    className="exercise-item-btn"
                  >
                    <span style={{ color: 'white', fontWeight: 600, fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{ex.name}</span>
                    {ex.muscle_group && (
                      <span style={{ color: 'var(--miami-cyan)', fontSize: '0.6rem', marginTop: 1 }}>{ex.muscle_group.split(',')[0]}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Emoji Button */}
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            setShowEmojiPicker(!showEmojiPicker);
            setShowExerciseSelector(false);
          }}
          style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', cursor: 'pointer' }}
          title="Insérer un émoji"
          disabled={sending}
        >
          <Smile size={16} style={{ color: showEmojiPicker ? 'var(--miami-pink)' : 'rgba(255,255,255,0.5)' }} />
        </button>

        <input
          className="input-miami"
          placeholder="Écrivez un message..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', fontSize: '0.85rem' }}
          disabled={sending}
        />

        {/* Exercise Dropdown Trigger Button */}
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            setShowExerciseSelector(!showExerciseSelector);
            setShowEmojiPicker(false);
          }}
          style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', cursor: 'pointer' }}
          title="Partager un exercice"
          disabled={sending}
        >
          <Dumbbell size={16} style={{ color: showExerciseSelector ? 'var(--miami-cyan)' : 'rgba(255,255,255,0.5)' }} />
        </button>

        <button
          type="submit"
          className="btn-primary"
          style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          disabled={!inputText.trim() || sending}
        >
          <Send size={14} />
        </button>
      </form>

      {/* Exercise Details Modal Popup */}
      {activeExercise && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(4, 3, 16, 0.85)', 
            backdropFilter: 'blur(16px)', 
            zIndex: 1100, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: 20 
          }}
          onClick={() => setActiveExercise(null)}
        >
          <div 
            className="card-glass" 
            style={{ 
              width: '100%', 
              maxWidth: 500, 
              padding: 24, 
              position: 'relative',
              border: '1px solid rgba(255, 10, 94, 0.3)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 10, 94, 0.15)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveExercise(null)} 
              style={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                color: 'white', 
                cursor: 'pointer',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                zIndex: 10
              }}
            >
              <X size={16} />
            </button>

            {/* Modal Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 10 }}>
              <div>
                {activeExercise.muscle_group && (
                  <span 
                    className="badge" 
                    style={{ 
                      background: 'rgba(189, 0, 255, 0.15)', 
                      color: 'var(--miami-purple-light)', 
                      border: '1px solid rgba(189, 0, 255, 0.3)',
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      display: 'inline-block',
                      marginBottom: 8
                    }}
                  >
                    {activeExercise.muscle_group}
                  </span>
                )}
                <h3 style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '1.8rem', 
                  color: 'white', 
                  margin: 0 
                }}>
                  {activeExercise.name}
                </h3>
              </div>

              {/* Demo Animation Container */}
              <div style={{ 
                width: '100%', 
                height: 240, 
                borderRadius: 12, 
                background: 'rgba(7, 6, 26, 0.6)', 
                border: '1px solid rgba(255, 255, 255, 0.05)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {activeExercise.gif_url ? (
                  <img 
                    src={activeExercise.gif_url} 
                    alt={activeExercise.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'rgba(245, 240, 255, 0.3)' }}>
                    <Dumbbell size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                    <p style={{ fontSize: '0.8rem' }}>Pas d'animation disponible</p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div>
                <h4 style={{ 
                  color: 'white', 
                  fontSize: '1.1rem', 
                  fontWeight: 600, 
                  marginBottom: 8,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: 4
                }}>
                  Instructions de mouvement
                </h4>
                <p style={{ 
                  fontSize: '0.85rem', 
                  color: 'rgba(245, 240, 255, 0.75)', 
                  lineHeight: 1.5, 
                  whiteSpace: 'pre-line',
                  margin: 0
                }}>
                  {activeExercise.instructions || "Aucune instruction disponible."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .emoji-btn:hover {
          background: rgba(255, 45, 120, 0.15) !important;
          transform: scale(1.2);
        }
        .exercise-item-btn:hover {
          background: rgba(0, 245, 255, 0.08) !important;
          border-color: rgba(0, 245, 255, 0.25) !important;
        }
        .scroll-mini::-webkit-scrollbar {
          width: 4px;
        }
        .scroll-mini::-webkit-scrollbar-track {
          background: transparent;
        }
        .scroll-mini::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .scroll-mini::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </div>
  );
}
