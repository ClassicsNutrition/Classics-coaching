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

  const [giphySearch, setGiphySearch] = useState('');
  const [giphyResults, setGiphyResults] = useState<any[]>([]);
  const [searchingGiphy, setSearchingGiphy] = useState(false);
  const [showGiphyOverlay, setShowGiphyOverlay] = useState(false);

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

  async function handleGiphySearch() {
    if (!giphySearch) return;
    setSearchingGiphy(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
      const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(giphySearch)}&limit=12`);
      const { data } = await res.json();
      setGiphyResults(data || []);
    } catch (err) {
      console.error('Giphy error:', err);
    }
    setSearchingGiphy(false);
  }

  return (
    <div style={{ padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>Bibliothèque d&apos;exercices</h1>
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
          placeholder="Rechercher un exercice..." 
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card-glass" style={{ width: '100%', maxWidth: 500, padding: 32, position: 'relative' }}>
            <button onClick={() => setEditingEx(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: 24 }}>
              {editingEx.id ? "Éditer l'exercice" : 'Nouvel exercice'}
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
                <div style={{ display: 'flex', gap: 10 }}>
                  <input id="ex_gif_url" name="gif_url" className="input-miami" defaultValue={editingEx.gif_url} placeholder="https://..." style={{ flex: 1 }} />
                  <button type="button" onClick={() => setShowGiphyOverlay(true)} className="btn-secondary" style={{ padding: '0 12px' }}>
                    <Search size={16} />
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', marginBottom: 6 }}>Instructions</label>
                <textarea name="instructions" className="input-miami" rows={4} defaultValue={editingEx.instructions} placeholder="Descendre la barre..." />
              </div>
              <button type="submit" disabled={saving} className="btn-primary" style={{ marginTop: 12 }}>
                <Save size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Giphy Search Overlay */}
      {showGiphyOverlay && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card-glass" style={{ width: '100%', maxWidth: 600, height: '80vh', display: 'flex', flexDirection: 'column', padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ color: 'white', fontWeight: 800 }}>Rechercher un GIF</h3>
              <button onClick={() => setShowGiphyOverlay(false)} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <input 
                className="input-miami" 
                placeholder="Ex: bench press..." 
                value={giphySearch}
                onChange={e => setGiphySearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGiphySearch()}
                style={{ flex: 1 }}
              />
              <button onClick={handleGiphySearch} disabled={searchingGiphy} className="btn-primary">
                {searchingGiphy ? '...' : <Search size={18} />}
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
              {giphyResults.map(gif => (
                <div 
                  key={gif.id} 
                  onClick={() => {
                    const input = document.getElementById('ex_gif_url') as HTMLInputElement;
                    if (input) input.value = gif.images.fixed_height.url;
                    setShowGiphyOverlay(false);
                  }}
                  style={{ cursor: 'pointer', borderRadius: 8, overflow: 'hidden', height: 130, border: '2px solid transparent', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--miami-cyan)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <img src={gif.images.fixed_height_small.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
              {giphyResults.length === 0 && !searchingGiphy && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'rgba(255,255,255,0.3)', marginTop: 40 }}>
                  Entrez un mot-clé pour rechercher un GIF.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
