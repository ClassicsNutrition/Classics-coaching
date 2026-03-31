'use client';

import { useEffect, useState } from 'react';
import { 
  Users, Search, Shield, User, Trash2, Ban, 
  CheckCircle2, XCircle, Clock, MoreVertical, RefreshCw
} from 'lucide-react';
import { 
  getAdminUsersList, banUser, unbanUser, 
  deleteUserPermanently, toggleAdminRole 
} from '../actions';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await getAdminUsersList();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const filtered = users.filter(u => 
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  async function handleAction(action: () => Promise<any>, userId: string) {
    setActionLoading(userId);
    try {
      await action();
      await loadUsers();
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

  return (
    <div style={{ padding: '32px 24px' }}>
      <div style={{ marginBottom: 36, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>Gestion Utilisateurs</h1>
          <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.85rem' }}>{users.length} utilisateur(s) inscrit(s)</p>
        </div>
        <button onClick={loadUsers} className="btn-ghost" style={{ gap: 8 }}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Actualiser
        </button>
      </div>

      <div style={{ marginBottom: 24, position: 'relative', display: 'flex', gap: 12 }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(226,232,240,0.3)' }} />
          <input 
            className="input-miami" 
            placeholder="Rechercher par nom ou email..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 44, width: '100%' }}
          />
        </div>
      </div>

      {loading && users.length === 0 ? (
        <div style={{ color: 'white', padding: 40, textAlign: 'center' }}>Chargement de la base utilisateurs...</div>
      ) : filtered.length === 0 ? (
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
                {filtered.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', opacity: u.is_banned ? 0.6 : 1 }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ 
                          width: 40, height: 40, borderRadius: '50%', 
                          background: u.is_banned ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #FF2D78, #7B2FBE)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                          fontSize: '1rem', fontWeight: 700
                        }}>
                          {(u.full_name || u.email || '?')[0].toUpperCase()}
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
                        <button 
                          onClick={() => handleAction(() => toggleAdminRole(u.id, u.role), u.id)}
                          className="btn-ghost" 
                          title={u.role === 'admin' ? "Rétrograder en Client" : "Promouvoir en Admin"}
                          style={{ padding: 8 }}
                          disabled={!!actionLoading}
                        >
                          <Shield size={16} />
                        </button>
                        
                        {u.is_banned ? (
                          <button 
                            onClick={() => handleAction(() => unbanUser(u.id), u.id)}
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
                                handleAction(() => banUser(u.id), u.id);
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
                              handleAction(() => deleteUserPermanently(u.id), u.id);
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
      )}
    </div>
  );
}
