'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Send, RefreshCw, MessageSquare, MessageCircle,
  Smile, Dumbbell, Search, X, Play, Info
} from 'lucide-react';
import { 
  getAdminChatRooms, createChatRoom, 
  getChatMessages, sendChatMessage, markChatAsRead,
  getExercisesList
} from '@/app/chat/actions';

const UNIQUE_EMOJIS = [
  '💪', '🏋️‍♂️', '🏃‍♂️', '🧘‍♂️', '🥗', '🍎', '🥦',
  '🥑', '🍌', '🍗', '🥩', '🥚', '🥛', '💧',
  '⚡', '🎯', '🏆', '🔥', '✨', '❤️', '👍',
  '🙌', '👏', '😎', '😊', '✌️', '🚀', '⭐'
];

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
  
  // Custom picker and exercise states
  const [exercisesList, setExercisesList] = useState<any[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [activeExercise, setActiveExercise] = useState<any | null>(null);

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const exerciseSelectorRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const targetUserId = searchParams.get('userId');

  // Load exercises list on mount
  useEffect(() => {
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

  // Scroll to bottom of the container when messages list changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
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
            <div 
              ref={chatContainerRef}
              style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(0,0,0,0.1)' }}
            >
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
                              padding: '12px',
                              width: '280px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 10,
                              boxShadow: isSenderMe ? '0 0 15px rgba(255, 45, 120, 0.15)' : '0 0 15px rgba(0, 245, 255, 0.15)',
                            }}
                          >
                            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                              <div style={{ 
                                width: 50, 
                                height: 50, 
                                borderRadius: 8, 
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
                                  <Dumbbell size={20} style={{ color: 'rgba(255,255,255,0.3)' }} />
                                )}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {exercise.name}
                                </div>
                                {exercise.muscle_group && (
                                  <span style={{ 
                                    fontSize: '0.65rem', 
                                    color: 'var(--miami-purple-light)', 
                                    background: 'rgba(189, 0, 255, 0.12)', 
                                    border: '1px solid rgba(189, 0, 255, 0.25)',
                                    padding: '1px 6px',
                                    borderRadius: 4,
                                    display: 'inline-block',
                                    marginTop: 3,
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
                              onClick={() => setActiveExercise(exercise)}
                              className="btn-ghost"
                              style={{
                                width: '100%',
                                padding: '6px 0',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                borderRadius: 6,
                                borderColor: isSenderMe ? 'rgba(255, 45, 120, 0.3)' : 'rgba(0, 245, 255, 0.3)',
                                color: isSenderMe ? 'var(--miami-pink)' : 'var(--miami-cyan)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4,
                                cursor: 'pointer'
                              }}
                            >
                              <Play size={10} style={{ fill: 'currentColor' }} /> Voir l'exécution
                            </button>
                          </div>
                        );
                      } else {
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Dumbbell size={14} /> Exercice partagé (introuvable)
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
                          maxWidth: '70%',
                          borderRadius: 12,
                          color: 'white',
                          fontSize: '0.85rem',
                          wordBreak: 'break-word',
                        } : {
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
                        {renderMessageContent(msg.message, isMe)}
                      </div>
                      <span style={{ fontSize: '0.65rem', color: 'rgba(226,232,240,0.3)', marginTop: 4, padding: '0 4px' }}>
                        {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Message Form */}
            <form onSubmit={handleSendMessage} style={{ position: 'relative', padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)', display: 'flex', gap: 12, alignItems: 'center' }}>
              
              {/* Emoji Picker Popover */}
              {showEmojiPicker && (
                <div 
                  ref={emojiPickerRef}
                  className="card-glass"
                  style={{
                    position: 'absolute',
                    bottom: '80px',
                    left: '24px',
                    width: '280px',
                    padding: '12px',
                    border: '1px solid rgba(255, 45, 120, 0.3)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(255, 45, 120, 0.15)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    background: 'rgba(20, 19, 58, 0.95)',
                    backdropFilter: 'blur(16px)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                    <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>ÉMOJIS</span>
                    <button type="button" onClick={() => setShowEmojiPicker(false)} style={{ background: 'none', border: 'none', color: 'rgba(226,232,240,0.4)', cursor: 'pointer', padding: 2 }}>
                      <X size={14} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
                    {UNIQUE_EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setInputText(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        style={{
                          fontSize: '1.25rem',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '6px',
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
                    bottom: '80px',
                    right: '24px',
                    width: '320px',
                    padding: '16px',
                    border: '1px solid rgba(0, 245, 255, 0.3)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(0, 245, 255, 0.15)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    background: 'rgba(20, 19, 58, 0.95)',
                    backdropFilter: 'blur(16px)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                    <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>PARTAGER UN EXERCICE</span>
                    <button type="button" onClick={() => setShowExerciseSelector(false)} style={{ background: 'none', border: 'none', color: 'rgba(226,232,240,0.4)', cursor: 'pointer', padding: 2 }}>
                      <X size={14} />
                    </button>
                  </div>
                  
                  <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--miami-cyan)' }} />
                    <input
                      type="text"
                      className="input-miami"
                      placeholder="Rechercher un exercice..."
                      value={exerciseSearch}
                      onChange={e => setExerciseSearch(e.target.value)}
                      style={{ width: '100%', padding: '6px 10px 6px 30px', fontSize: '0.78rem', height: 'auto', borderRadius: 6 }}
                    />
                  </div>

                  <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 4 }} className="scroll-mini">
                    {exercisesList.filter(ex => 
                      ex.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(exerciseSearch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ||
                      (ex.muscle_group && ex.muscle_group.toLowerCase().includes(exerciseSearch.toLowerCase()))
                    ).length === 0 ? (
                      <div style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 12, fontSize: '0.75rem' }}>
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
                              await sendChatMessage(activeRoom.id, `[EXERCISE:${ex.id}]`);
                              await loadMessages(activeRoom.id, false);
                              await loadRooms();
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
                            padding: '8px 10px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            transition: 'all 0.2s'
                          }}
                          className="exercise-item-btn"
                        >
                          <span style={{ color: 'white', fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{ex.name}</span>
                          {ex.muscle_group && (
                            <span style={{ color: 'var(--miami-cyan)', fontSize: '0.65rem', marginTop: 2 }}>{ex.muscle_group.split(',')[0]}</span>
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
                style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', cursor: 'pointer' }}
                title="Insérer un émoji"
                disabled={sending}
              >
                <Smile size={18} style={{ color: showEmojiPicker ? 'var(--miami-pink)' : 'rgba(255,255,255,0.5)' }} />
              </button>

              <input
                className="input-miami"
                placeholder="Votre message..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                style={{ flex: 1, padding: '12px 16px', fontSize: '0.9rem' }}
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
                style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', cursor: 'pointer' }}
                title="Partager un exercice"
                disabled={sending}
              >
                <Dumbbell size={18} style={{ color: showExerciseSelector ? 'var(--miami-cyan)' : 'rgba(255,255,255,0.5)' }} />
              </button>

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
        .chat-room-item:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }
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

export default function AdminChatPage() {
  return (
    <Suspense fallback={<div style={{ color: 'white', padding: 40, textAlign: 'center' }}>Chargement de la messagerie...</div>}>
      <AdminChatContent />
    </Suspense>
  );
}
