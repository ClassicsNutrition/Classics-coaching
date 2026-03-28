'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, Trash2, Edit, Zap, Users, BookOpen, Dumbbell, 
  Settings, TrendingUp, Search, Shield, User
} from 'lucide-react';

export default function AdminUsersPage() {
  const supabase = createClient();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }

  const filtered = users.filter(u => 
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  async function toggleRole(user: any) {
    const newRole = user.role === 'admin' ? 'client' : 'admin';
    if (!confirm(`Changer le rôle de ${user.full_name || user.email} en ${newRole} ?`)) return;
    
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', user.id);
    if (!error) loadUsers();
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--miami-night)', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, borderRight: '1px solid rgba(255,45,120,0.1)', padding: '24px 16px', flexShrink: 0, background: 'rgba(6,6,15,0.95)', position: 'sticky', top: 0, height: '100vh' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 32, padding: '0 8px' }}>
          <img src="/logo.png" alt="Classics Coaching" style={{ height: 32, width: 'auto' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: 'white' }}>
            Admin <span style={{ color: 'var(--miami-pink)' }}>Panel</span>
          </span>
        </Link>
        {[
          { href: '/admin', label: 'Dashboard', icon: <TrendingUp size={18} /> },
          { href: '/admin/users', label: 'Utilisateurs', icon: <Users size={18} />, active: true },
          { href: '/admin/ebooks', label: 'E-books', icon: <BookOpen size={18} /> },
          { href: '/admin/programs', label: 'Programmes', icon: <Dumbbell size={18} /> },
          { href: '/admin/exercises', label: 'Exercices', icon: <Settings size={18} /> },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
            color: item.active ? 'white' : 'rgba(226,232,240,0.65)',
            background: item.active ? 'rgba(255,45,120,0.15)' : 'transparent',
            fontSize: '0.875rem', fontWeight: item.active ? 700 : 500, marginBottom: 2,
          }}>
            {item.icon} {item.label}
          </Link>
        ))}
      </aside>

      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>Gestion Utilisateurs</h1>
          <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.85rem' }}>{users.length} utilisateur(s) inscrit(s)</p>
        </div>

        <div style={{ marginBottom: 24, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(226,232,240,0.3)' }} />
          <input 
            className="input-miami" 
            placeholder="Rechercher par nom ou email..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 44, width: '100%', maxWidth: 400 }}
          />
        </div>

        {loading ? (
          <div style={{ color: 'white', padding: 40 }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="card-glass" style={{ padding: 64, textAlign: 'center' }}>
            <Users size={48} style={{ color: 'rgba(226,232,240,0.15)', marginBottom: 16 }} />
            <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.9rem' }}>Aucun utilisateur trouvé.</p>
          </div>
        ) : (
          <div className="card-glass" style={{ overflow: 'hidden', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase' }}>Utilisateur</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase' }}>Rôle</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase' }}>Inscription</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                          <User size={18} />
                        </div>
                        <div>
                          <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{u.full_name || 'Sans nom'}</div>
                          <div style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.75rem' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span className={`badge ${u.role === 'admin' ? 'badge-pink' : 'badge-ghost'}`} style={{ fontSize: '0.7rem' }}>
                        {u.role === 'admin' ? <Shield size={10} style={{ marginRight: 4 }} /> : null}
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', color: 'rgba(226,232,240,0.5)', fontSize: '0.85rem' }}>
                      {new Date(u.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                      <button 
                        onClick={() => toggleRole(u)} 
                        className="btn-ghost" 
                        style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                      >
                         Changer rôle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
