'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  Plus, Trash2, Edit, Zap, Users, BookOpen, Dumbbell, 
  Settings, TrendingUp, Search, ArrowLeft, Save, X
} from 'lucide-react';

export default function AdminExercisesPage() {
  const supabase = createClient();

  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingEx, setEditingEx] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadExercises();
  }, []);

  async function loadExercises() {
    const { data } = await supabase.from('exercises').select('*').order('name', { ascending: true });
    setExercises(data || []);
    setLoading(false);
  }

  const filtered = exercises.filter(ex => 
    ex.name.toLowerCase().includes(search.toLowerCase()) || 
    ex.muscle_group?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name') as string,
      muscle_group: formData.get('muscle_group') as string,
      gif_url: formData.get('gif_url') as string,
      instructions: formData.get('instructions') as string,
    };

    let error;
    if (editingEx?.id) {
      ({ error } = await supabase.from('exercises').update(payload).eq('id', editingEx.id));
    } else {
      ({ error } = await supabase.from('exercises').insert(payload));
    }

    if (!error) {
      setEditingEx(null);
      loadExercises();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet exercice ?')) return;
    await supabase.from('exercises').delete().eq('id', id);
    loadExercises();
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
          { href: '/admin/users', label: 'Utilisateurs', icon: <Users size={18} /> },
          { href: '/admin/ebooks', label: 'E-books', icon: <BookOpen size={18} /> },
          { href: '/admin/programs', label: 'Programmes', icon: <Dumbbell size={18} /> },
          { href: '/admin/exercises', label: 'Exercices', icon: <Settings size={18} />, active: true },
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>Bibliothèque d&apos;exercices</h1>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.85rem' }}>{exercises.length} exercice(s) disponible(s)</p>
          </div>
          <button onClick={() => setEditingEx({})} className="btn-primary">
            <Plus size={16} /> Ajouter un exercice
          </button>
        </div>

        <div style={{ marginBottom: 24, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(226,232,240,0.3)' }} />
          <input 
            className="input-miami" 
            placeholder="Rechercher un exercice ou un muscle..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 44, width: '100%', maxWidth: 400 }}
          />
        </div>

        {loading ? (
          <div style={{ color: 'white', padding: 40 }}>Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="card-glass" style={{ padding: 64, textAlign: 'center' }}>
            <Settings size={48} style={{ color: 'rgba(226,232,240,0.15)', marginBottom: 16 }} />
            <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.9rem' }}>Aucun exercice trouvé.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {filtered.map(ex => (
              <div key={ex.id} className="card-glass" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 60, height: 60, borderRadius: 10, background: 'rgba(255,255,255,0.03)', overflow: 'hidden', flexShrink: 0 }}>
                    {ex.gif_url ? (
                      <img src={ex.gif_url} alt={ex.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(226,232,240,0.2)' }}>
                        <Settings size={24} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>{ex.name}</h3>
                    <div className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{ex.muscle_group || 'Global'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                  <button onClick={() => setEditingEx(ex)} className="btn-ghost" style={{ flex: 1, fontSize: '0.8rem', padding: '6px' }}>
                    <Edit size={14} /> Éditer
                  </button>
                  <button onClick={() => handleDelete(ex.id)} className="btn-ghost" style={{ flex: 0, padding: '6px', color: 'var(--miami-pink)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Overlay */}
        {editingEx && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div className="card-glass" style={{ width: '100%', maxWidth: 500, padding: 32, position: 'relative' }}>
              <button onClick={() => setEditingEx(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={24} />
              </button>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: 24 }}>
                {editingEx.id ? 'Éditer l&apos;exercice' : 'Nouvel exercice'}
              </h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', marginBottom: 6 }}>Nom de l&apos;exercice *</label>
                  <input name="name" required className="input-miami" defaultValue={editingEx.name} placeholder="Ex: Développé couché" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', marginBottom: 6 }}>Muscle ciblé</label>
                  <input name="muscle_group" className="input-miami" defaultValue={editingEx.muscle_group} placeholder="Ex: Pectoraux" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', marginBottom: 6 }}>URL du GIF de démonstration</label>
                  <input name="gif_url" className="input-miami" defaultValue={editingEx.gif_url} placeholder="https://..." />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', marginBottom: 6 }}>Instructions</label>
                  <textarea name="instructions" className="input-miami" rows={4} defaultValue={editingEx.instructions} placeholder="Descendre la barre jusqu'aux pectoraux..." />
                </div>
                <button type="submit" disabled={saving} className="btn-primary" style={{ marginTop: 12 }}>
                  <Save size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
