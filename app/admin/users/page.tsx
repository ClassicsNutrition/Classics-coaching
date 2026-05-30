'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, Search, Shield, Trash2, Ban, 
  CheckCircle2, XCircle, Clock, RefreshCw,
  Check, X, BookOpen, Dumbbell, MessageSquare
} from 'lucide-react';
import { 
  getAdminUsersList, banUser, unbanUser, 
  deleteUserPermanently, toggleAdminRole,
  getAdminReservations, updateReservationStatus
} from '../actions';

function UsersPageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'users' | 'requests'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Sync tab from search parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'requests') {
      setActiveTab('requests');
    } else {
      setActiveTab('users');
    }
  }, [searchParams]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [usersData, reservationsData] = await Promise.all([
        getAdminUsersList(),
        getAdminReservations()
      ]);
      setUsers(usersData);
      setReservations(reservationsData);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  // Filter users
  const filteredUsers = users.filter(u => 
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  // Filter reservations
  const filteredRequests = reservations.filter(r => 
    (r.user_name || '').toLowerCase().includes(search.toLowerCase()) || 
    (r.user_email || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.content_title || '').toLowerCase().includes(search.toLowerCase())
  );

  async function handleUserAction(action: () => Promise<any>, userId: string) {
    setActionLoading(userId);
    try {
      await action();
      await loadData();
    } catch (err: any) {
      alert("Erreur : " + err.message);
    }
    setActionLoading(null);
  }

  async function handleUpdateReservation(id: string, newStatus: 'granted' | 'revoked') {
    setActionLoading(id);
    try {
      await updateReservationStatus(id, newStatus);
      await loadData();
    } catch (err: any) {
      alert("Erreur : " + err.message);
    }
    setActionLoading(null);
  }

  const formatLastSeen = (date?: string) => {
    if (!date) return 'Jamais';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const pendingRequestsCount = reservations.filter(r => r.status === 'pending').length;

  return (
    <div style={{ padding: '32px 24px' }}>
      {/* Title block */}
      <div style={{ marginBottom: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>
            {activeTab === 'users' ? 'Gestion Utilisateurs' : 'Demandes d\'Accès'}
          </h1>
          <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.85rem' }}>
            {activeTab === 'users' 
              ? `${users.length} utilisateur(s) inscrit(s)` 
              : `${pendingRequestsCount} demande(s) en attente sur ${reservations.length} au total`
            }
          </p>
        </div>
        <button onClick={loadData} className="btn-ghost" style={{ gap: 8 }}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualiser
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 24, paddingBottom: 1 }}>
        <button 
          onClick={() => setActiveTab('users')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'users' ? '2px solid var(--miami-pink)' : '2px solid transparent',
            color: activeTab === 'users' ? 'white' : 'rgba(226,232,240,0.5)',
            padding: '8px 16px 12px 16px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'users' ? 700 : 500,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Users size={16} />
          Utilisateurs
        </button>
        <button 
          onClick={() => setActiveTab('requests')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'requests' ? '2px solid var(--miami-pink)' : '2px solid transparent',
            color: activeTab === 'requests' ? 'white' : 'rgba(226,232,240,0.5)',
            padding: '8px 16px 12px 16px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'requests' ? 700 : 500,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <Clock size={16} />
          Demandes d'accès
          {pendingRequestsCount > 0 && (
            <span style={{
              background: '#FF2D78',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              borderRadius: '10px',
              padding: '1px 6px',
              boxShadow: '0 0 6px #FF2D78'
            }}>
              {pendingRequestsCount}
            </span>
          )}
        </button>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: 24, position: 'relative', display: 'flex', gap: 12 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(226,232,240,0.3)' }} />
          <input 
            className="input-miami" 
            placeholder={activeTab === 'users' ? "Rechercher par nom ou email..." : "Rechercher par nom, email ou contenu..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 44, width: '100%' }}
          />
        </div>
      </div>

      {/* Content Rendering based on Active Tab */}
      {activeTab === 'users' ? (
        // Users Table
        loading && users.length === 0 ? (
          <div style={{ color: 'white', padding: 40, textAlign: 'center' }}>Chargement de la base utilisateurs...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="card-glass" style={{ padding: 64, textAlign: 'center' }}>
            <Users size={48} style={{ color: 'rgba(226,232,240,0.15)', marginBottom: 16 }} />
            <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.9rem' }}>Aucun utilisateur trouvé.</p>
          </div>
        ) : (
          <div className="card-glass" style={{ overflow: 'hidden', padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 900 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase' }}>Utilisateur</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase' }}>Statut</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase' }}>Dernière Connexion</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', opacity: u.is_banned ? 0.6 : 1 }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ 
                            width: 40, height: 40, borderRadius: '50%', 
                            background: u.avatar_url ? 'transparent' : (u.is_banned ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #FF2D78, #7B2FBE)'), 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                            fontSize: '1rem', fontWeight: 700, overflow: 'hidden', flexShrink: 0
                          }}>
                            {u.avatar_url ? (
                              <img src={u.avatar_url} alt={u.full_name || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              (u.full_name || u.email || '?')[0].toUpperCase()
                            )}
                          </div>
                          <div>
                            <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                              {u.full_name || 'Inconnu'}
                              {u.role === 'admin' && <Shield size={14} style={{ color: 'var(--miami-cyan)' }} />}
                            </div>
                            <div style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.75rem' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {u.is_banned ? (
                            <span className="badge badge-pink" style={{ fontSize: '0.65rem' }}>
                              <Ban size={10} style={{ marginRight: 4 }} /> BANNI
                            </span>
                          ) : u.email_confirmed_at ? (
                            <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>
                              <CheckCircle2 size={10} style={{ marginRight: 4 }} /> EMAIL OK
                            </span>
                          ) : (
                            <span className="badge badge-ghost" style={{ fontSize: '0.65rem', color: 'orange' }}>
                              <XCircle size={10} style={{ marginRight: 4 }} /> NON CONFIRMÉ
                            </span>
                          )}
                          <span style={{ fontSize: '0.65rem', color: 'rgba(226,232,240,0.3)' }}>Membre depuis {new Date(u.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(226,232,240,0.5)', fontSize: '0.85rem' }}>
                          <Clock size={14} /> {formatLastSeen(u.last_sign_in_at)}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                          <Link 
                            href={`/admin/chat?userId=${u.id}`}
                            className="btn-ghost" 
                            title="Ouvrir la messagerie"
                            style={{ padding: 8, color: 'var(--miami-cyan)', display: 'inline-flex', alignItems: 'center' }}
                          >
                            <MessageSquare size={16} />
                          </Link>

                          <button 
                            onClick={() => handleUserAction(() => toggleAdminRole(u.id, u.role), u.id)}
                            className="btn-ghost" 
                            title={u.role === 'admin' ? "Rétrograder en Client" : "Promouvoir en Admin"}
                            style={{ padding: 8 }}
                            disabled={!!actionLoading}
                          >
                            <Shield size={16} />
                          </button>
                          
                          {u.is_banned ? (
                            <button 
                              onClick={() => handleUserAction(() => unbanUser(u.id), u.id)}
                              className="btn-ghost" 
                              title="Débannir"
                              style={{ padding: 8, color: '#10b981' }}
                              disabled={!!actionLoading}
                            >
                              <CheckCircle2 size={16} />
                            </button>
                          ) : (
                            <button 
                              onClick={() => {
                                if (confirm(`Bannir l'utilisateur ${u.email} ?`)) {
                                  handleUserAction(() => banUser(u.id), u.id);
                                }
                              }}
                              className="btn-ghost" 
                              title="Bannir"
                              style={{ padding: 8, color: 'var(--miami-pink)' }}
                              disabled={!!actionLoading}
                            >
                              <Ban size={16} />
                            </button>
                          )}

                          <button 
                            onClick={() => {
                              if (confirm(`SUPPRIMER DÉFINITIVEMENT l'utilisateur ${u.email} ? Cette action est irréversible.`)) {
                                handleUserAction(() => deleteUserPermanently(u.id), u.id);
                              }
                            }}
                            className="btn-ghost" 
                            title="Supprimer définitivement"
                            style={{ padding: 8, color: 'var(--miami-pink)' }}
                            disabled={!!actionLoading}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        // Reservations (Demandes d'accès) Table
        loading && reservations.length === 0 ? (
          <div style={{ color: 'white', padding: 40, textAlign: 'center' }}>Chargement des demandes d'accès...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="card-glass" style={{ padding: 64, textAlign: 'center' }}>
            <Clock size={48} style={{ color: 'rgba(226,232,240,0.15)', marginBottom: 16 }} />
            <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.9rem' }}>Aucune demande d'accès trouvée.</p>
          </div>
        ) : (
          <div className="card-glass" style={{ overflow: 'hidden', padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 900 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase' }}>Utilisateur</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase' }}>Type</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase' }}>Contenu Demandé</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase' }}>Date Demande</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase' }}>Statut</th>
                    <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div>
                          <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>
                            {r.user_name}
                          </div>
                          <div style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.75rem' }}>{r.user_email}</div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {r.content_type === 'program' ? (
                          <span className="badge badge-cyan" style={{ fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <Dumbbell size={10} /> PROGRAMME
                          </span>
                        ) : (
                          <span className="badge badge-purple" style={{ fontSize: '0.65rem', display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(123, 47, 190, 0.2)', color: '#b975ff', border: '1px solid rgba(123, 47, 190, 0.4)' }}>
                            <BookOpen size={10} /> E-BOOK
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ color: 'white', fontWeight: 500, fontSize: '0.9rem' }}>{r.content_title}</span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.85rem' }}>
                          {new Date(r.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {r.status === 'pending' && (
                          <span className="badge badge-ghost" style={{ fontSize: '0.65rem', color: 'orange', borderColor: 'orange' }}>
                            EN ATTENTE
                          </span>
                        )}
                        {r.status === 'granted' && (
                          <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>
                            ACCORDÉ
                          </span>
                        )}
                        {r.status === 'revoked' && (
                          <span className="badge badge-pink" style={{ fontSize: '0.65rem' }}>
                            RÉVOQUÉ
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          {r.status !== 'granted' && (
                            <button 
                              onClick={() => handleUpdateReservation(r.id, 'granted')}
                              className="btn-ghost" 
                              title="Accorder l'accès"
                              style={{ 
                                padding: '6px 12px', 
                                color: '#10b981', 
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                borderRadius: 6,
                                background: 'rgba(16, 185, 129, 0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: '0.75rem'
                              }}
                              disabled={actionLoading === r.id}
                            >
                              <Check size={14} /> Accorder
                            </button>
                          )}
                          {r.status !== 'revoked' && (
                            <button 
                              onClick={() => handleUpdateReservation(r.id, 'revoked')}
                              className="btn-ghost" 
                              title="Révoquer l'accès"
                              style={{ 
                                padding: '6px 12px', 
                                color: 'var(--miami-pink)', 
                                border: '1px solid rgba(255, 45, 120, 0.2)',
                                borderRadius: 6,
                                background: 'rgba(255, 45, 120, 0.05)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: '0.75rem'
                              }}
                              disabled={actionLoading === r.id}
                            >
                              <X size={14} /> Révoquer
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<div style={{ color: 'white', padding: 40, textAlign: 'center' }}>Chargement de l'administration...</div>}>
      <UsersPageContent />
    </Suspense>
  );
}
