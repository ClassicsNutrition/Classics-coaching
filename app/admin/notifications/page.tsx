'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Bell, Send, Users, UserCheck, RefreshCw, Calendar, Trash2 } from 'lucide-react';
import { 
  createAdminNotification, 
  getClientsListForNotification, 
  getAdminSentNotifications 
} from '@/app/notifications/actions';

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'targeted'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [link, setLink] = useState('/profile');
  
  const PRESET_LINKS = [
    { label: 'Espace Client (Par défaut)', value: '/profile' },
    { label: 'Page d\'accueil', value: '/' },
    { label: 'Bibliothèque d\'exercices', value: '/exercises' },
    { label: 'Programmes d\'entraînement', value: '/programs' },
    { label: 'Guide de nutrition', value: '/alimentation' },
    { label: 'Boutique compléments', value: '/shop' },
    { label: 'E-books', value: '/ebooks' }
  ];
  
  const [clientsList, setClientsList] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Load clients and history
  const loadData = async () => {
    setLoading(true);
    try {
      const clients = await getClientsListForNotification();
      setClientsList(clients);
      
      const sentHistory = await getAdminSentNotifications();
      setHistory(sentHistory);
    } catch (err) {
      console.error("Error loading notification page data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAllClients = () => {
    if (selectedUsers.length === clientsList.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(clientsList.map(c => c.id));
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || sending) return;
    if (targetType === 'targeted' && selectedUsers.length === 0) {
      alert("Veuillez sélectionner au moins un utilisateur cible.");
      return;
    }

    setSending(true);
    try {
      const res = await createAdminNotification(title, body, targetType, selectedUsers, link);
      alert(`Notification envoyée avec succès à ${res.count} utilisateur(s).`);
      
      // Reset form
      setTitle('');
      setBody('');
      setSelectedUsers([]);
      setTargetType('all');
      setLink('/profile');
      
      // Reload history
      const updatedHistory = await getAdminSentNotifications();
      setHistory(updatedHistory);
    } catch (err: any) {
      alert("Erreur lors de la diffusion : " + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--miami-night)', color: '#F5F0FF' }}>
      <AdminSidebar />

      <main style={{ flex: 1, padding: '40px 24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <div className="badge badge-pink" style={{ marginBottom: 8, display: 'inline-flex', gap: 6 }}>
              <Bell size={12} /> DIFFUSION GLOBALE
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: 'white', margin: 0 }}>
              Gestion des <span className="gradient-miami-text">Notifications</span>
            </h1>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.9rem', marginTop: 4 }}>
              Diffusez des alertes d&#39;information ou des messages ciblés sur le centre de notifications de vos clients.
            </p>
          </div>
          
          <button onClick={loadData} className="btn-ghost" style={{ padding: 10 }} title="Actualiser" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading && history.length === 0 ? (
          <div style={{ color: 'rgba(226,232,240,0.4)', textAlign: 'center', padding: 48 }}>
            Chargement de l&#39;interface de notifications...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
            
            {/* Notification creation Form panel */}
            <div className="card-glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h2 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 10, margin: 0 }}>
                Nouvelle Notification
              </h2>

              <form onSubmit={handleSendNotification} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(226,232,240,0.6)', fontWeight: 600, marginBottom: 6 }}>Titre de la notification</label>
                  <input
                    type="text"
                    className="input-miami"
                    placeholder="Ex : Séance coaching en direct ce soir !"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(226,232,240,0.6)', fontWeight: 600, marginBottom: 6 }}>Message / Corps de texte</label>
                  <textarea
                    className="input-miami"
                    placeholder="Saisissez votre message motivant ou informatif ici..."
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    required
                    rows={4}
                    style={{ width: '100%', padding: '12px 14px', fontSize: '0.85rem', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(226,232,240,0.6)', fontWeight: 600, marginBottom: 6 }}>Page de redirection au clic</label>
                  <select
                    className="input-miami"
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '10px 14px', 
                      fontSize: '0.85rem', 
                      background: 'rgba(7, 6, 26, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      color: '#F5F0FF',
                      cursor: 'pointer'
                    }}
                  >
                    {PRESET_LINKS.map(opt => (
                      <option key={opt.value} value={opt.value} style={{ background: 'rgba(7, 6, 26, 0.98)', color: '#F5F0FF' }}>
                        {opt.label} ({opt.value})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(226,232,240,0.6)', fontWeight: 600, marginBottom: 8 }}>Destinataires</label>
                  
                  <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="targetType"
                        checked={targetType === 'all'}
                        onChange={() => setTargetType('all')}
                        style={{ accentColor: 'var(--miami-pink)' }}
                      />
                      <Users size={14} style={{ color: 'var(--miami-pink)' }} /> Tous les utilisateurs ({clientsList.length})
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="targetType"
                        checked={targetType === 'targeted'}
                        onChange={() => setTargetType('targeted')}
                        style={{ accentColor: 'var(--miami-cyan)' }}
                      />
                      <UserCheck size={14} style={{ color: 'var(--miami-cyan)' }} /> Utilisateurs ciblés
                    </label>
                  </div>

                  {targetType === 'targeted' && (
                    <div style={{
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 10,
                      background: 'rgba(0,0,0,0.2)',
                      padding: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6, marginBottom: 4 }}>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', fontWeight: 600 }}>SÉLECTIONNER LES CLIENTS</span>
                        <button
                          type="button"
                          onClick={handleSelectAllClients}
                          style={{ background: 'none', border: 'none', color: 'var(--miami-cyan)', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                        >
                          {selectedUsers.length === clientsList.length ? "Tout désélectionner" : "Tout sélectionner"}
                        </button>
                      </div>

                      <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }} className="scroll-mini">
                        {clientsList.length === 0 ? (
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', padding: 12, textAlign: 'center' }}>
                            Aucun client inscrit pour le moment.
                          </div>
                        ) : (
                          clientsList.map(client => {
                            const isChecked = selectedUsers.includes(client.id);
                            return (
                              <label
                                key={client.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                  fontSize: '0.8rem',
                                  padding: '6px 8px',
                                  borderRadius: 6,
                                  background: isChecked ? 'rgba(0, 245, 255, 0.04)' : 'transparent',
                                  border: `1px solid ${isChecked ? 'rgba(0, 245, 255, 0.15)' : 'transparent'}`,
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleUserSelection(client.id)}
                                  style={{ accentColor: 'var(--miami-cyan)' }}
                                />
                                <span style={{ color: isChecked ? 'white' : 'rgba(226,232,240,0.7)' }}>
                                  {client.full_name || "Client anonyme"}
                                </span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={sending || !title.trim() || !body.trim()}
                  style={{
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    width: '100%',
                    marginTop: 8
                  }}
                >
                  <Send size={16} className={sending ? 'animate-pulse' : ''} />
                  {sending ? 'Diffusion en cours...' : 'Diffuser la notification'}
                </button>
              </form>
            </div>

            {/* History Panel */}
            <div className="card-glass" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <h2 style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 10, margin: 0 }}>
                Historique des Envois
              </h2>

              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 480 }} className="scroll-mini">
                {history.length === 0 ? (
                  <div style={{ color: 'rgba(226,232,240,0.4)', textAlign: 'center', padding: '40px 16px', fontSize: '0.85rem' }}>
                    Aucune notification n&#39;a été envoyée récemment.
                  </div>
                ) : (
                  history.map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        padding: 12,
                        background: 'rgba(255,255,255,0.01)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        borderRadius: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: 'white' }}>{notif.title}</span>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(226,232,240,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar size={10} /> {new Date(notif.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                        </span>
                      </div>
                      
                      <p style={{ color: 'rgba(226,232,240,0.65)', fontSize: '0.8rem', margin: '4px 0', lineHeight: 1.3 }}>
                        {notif.body}
                      </p>
                      
                      <div style={{ fontSize: '0.7rem', color: 'var(--miami-cyan)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                        <span>Destinataire : {notif.profiles?.full_name || "Utilisateur inconnu"}</span>
                        {notif.link && <span>Lien : {notif.link}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </main>

      <style>{`
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
