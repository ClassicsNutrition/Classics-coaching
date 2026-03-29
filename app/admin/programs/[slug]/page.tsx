'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { 
  Block, BlockType, createBlock, 
  HeadingBlock, TextBlock, ExerciseBlock, TableBlock, CalloutBlock 
} from '@/lib/blocks';
import EbookRenderer from '@/components/EbookRenderer';
import { 
  ArrowLeft, Save, Plus, Trash2, CheckCircle2, XCircle, 
  ChevronUp, ChevronDown, UserPlus, Users, FileText, 
  Eye, EyeOff, Zap, Layout, Settings, Dumbbell
} from 'lucide-react';

interface Props { params: Promise<{ slug: string }> }

export default function AdminProgramEditorPage({ params }: Props) {
  const { slug } = use(params);
  const supabase = createClient();

  const [tab, setTab] = useState<'editor' | 'access'>('editor');
  const [program, setProgram] = useState<any>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [preview, setPreview] = useState(false);

  // Access tab
  const [reservations, setReservations] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [grantLoading, setGrantLoading] = useState('');

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('programs').select('*').eq('slug', slug).single();
      if (data) {
        setProgram(data);
        setBlocks(Array.isArray(data.sections) ? data.sections : []);
      }
      setLoading(false);
      loadReservations(data?.id);
    }
    load();
  }, [slug]);

  async function loadReservations(contentId?: string) {
    if (!contentId) return;
    const { data } = await supabase
      .from('reservations')
      .select('*, profiles(email)')
      .eq('content_id', contentId)
      .eq('content_type', 'program')
      .order('created_at', { ascending: false });
    setReservations(data || []);
  }

  async function handleSave() {
    setSaving(true);
    setSaveMsg('');
    const { error } = await supabase
      .from('programs')
      .update({ 
        sections: blocks, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', program.id);
    
    setSaveMsg(error ? '❌ Erreur de sauvegarde' : '✅ Sauvegardé avec succès !');
    setSaving(false);
    setTimeout(() => setSaveMsg(''), 3000);
  }

  // Block Helpers
  function addBlock(type: BlockType) {
    setBlocks(b => [...b, createBlock(type)]);
    setShowAddMenu(false);
  }

  function removeBlock(id: string) {
    if (confirm('Supprimer ce bloc ?')) {
      setBlocks(b => b.filter(x => x.id !== id));
    }
  }

  function moveBlock(id: string, dir: -1 | 1) {
    setBlocks(b => {
      const i = b.findIndex(x => x.id === id);
      if ((dir === -1 && i === 0) || (dir === 1 && i === b.length - 1)) return b;
      const arr = [...b];
      [arr[i], arr[i + dir]] = [arr[i + dir], arr[i]];
      return arr;
    });
  }

  if (loading) return <div style={{ color: 'white', padding: 40 }}>Chargement...</div>;
  if (!program) return <div style={{ color: 'white', padding: 40 }}>Programme introuvable.</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--miami-night)', display: 'flex', flexDirection: 'row' }} className="editor-container">
      {/* Sidebar for Editor - Simplified */}
      <aside className="editor-sidebar" style={{ width: 300, borderRight: '1px solid rgba(0,245,255,0.1)', background: 'rgba(6,6,15,0.95)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: 24, borderBottom: '1px solid rgba(0,245,255,0.1)' }}>
          <Link href="/admin/programs" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(226,232,240,0.5)', textDecoration: 'none', fontSize: '0.8rem', marginBottom: 16 }}>
            <ArrowLeft size={14} /> Retour
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg, #00F5FF, #7B2FBE)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Dumbbell size={20} />
            </div>
            <div>
              <h1 style={{ color: 'white', fontSize: '1rem', fontWeight: 800, margin: 0, fontFamily: 'var(--font-display)' }}>{program.title}</h1>
              <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.75rem', margin: 0 }}>Édition Programme</p>
            </div>
          </div>
        </div>

        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button onClick={() => setTab('editor')} style={{ 
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: tab === 'editor' ? 'rgba(0,245,255,0.1)' : 'transparent',
            color: tab === 'editor' ? 'white' : 'rgba(226,232,240,0.6)',
            fontSize: '0.875rem', fontWeight: 600, textAlign: 'left'
          }}>
            <Layout size={18} /> Éditeur de blocs
          </button>
          <button onClick={() => setTab('access')} style={{ 
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: tab === 'access' ? 'rgba(0,245,255,0.1)' : 'transparent',
            color: tab === 'access' ? 'white' : 'rgba(226,232,240,0.6)',
            fontSize: '0.875rem', fontWeight: 600, textAlign: 'left'
          }}>
            <Users size={18} /> Gestion des accès
          </button>
        </div>

        <div style={{ marginTop: 'auto', padding: 20, borderTop: '1px solid rgba(0,245,255,0.1)' }}>
          <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'var(--miami-cyan)', borderColor: 'var(--miami-cyan)' }}>
            <Save size={16} /> {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
          {saveMsg && <div style={{ marginTop: 12, fontSize: '0.75rem', textAlign: 'center', color: saveMsg.includes('❌') ? 'var(--miami-pink)' : '#10b981' }}>{saveMsg}</div>}
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {tab === 'editor' ? (
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>Construction du parcours</h2>
              <button 
                onClick={() => setPreview(!preview)} 
                className="btn-ghost" 
                style={{ fontSize: '0.85rem', color: preview ? 'var(--miami-cyan)' : 'white' }}
              >
                {preview ? <EyeOff size={16} /> : <Eye size={16} />} {preview ? 'Fermer aperçu' : 'Voir aperçu'}
              </button>
            </div>

            {preview ? (
              <div className="card-glass" style={{ padding: 40 }}>
                <EbookRenderer blocks={blocks} themePrimary={program.theme_primary} themeAccent={program.theme_accent} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {blocks.map((block, i) => (
                  <div key={block.id} className="card-glass" style={{ padding: 0, overflow: 'hidden', border: editingId === block.id ? '1px solid var(--miami-cyan)' : '1px solid rgba(0,245,255,0.1)' }}>
                    <div 
                      onClick={() => setEditingId(editingId === block.id ? null : block.id)}
                      style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{getBlockEmoji(block.type)}</span>
                      <span style={{ color: 'white', fontWeight: 700, flex: 1, fontSize: '0.9rem' }}>
                        {getBlockLabel(block.type)}
                        <span style={{ color: 'rgba(226,232,240,0.3)', fontWeight: 400, marginLeft: 10 }}>— {getBlockSummary(block)}</span>
                      </span>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={e => { e.stopPropagation(); moveBlock(block.id, -1); }} disabled={i === 0} style={{ background: 'none', border: 'none', color: 'rgba(226,232,240,0.3)', cursor: 'pointer' }}><ChevronUp size={16} /></button>
                        <button onClick={e => { e.stopPropagation(); moveBlock(block.id, 1); }} disabled={i === blocks.length - 1} style={{ background: 'none', border: 'none', color: 'rgba(226,232,240,0.3)', cursor: 'pointer' }}><ChevronDown size={16} /></button>
                        <button onClick={e => { e.stopPropagation(); removeBlock(block.id); }} style={{ background: 'none', border: 'none', color: 'var(--miami-pink)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </div>
                    </div>

                    {editingId === block.id && (
                      <div style={{ padding: 24, borderTop: '1px solid rgba(0,245,255,0.08)' }}>
                        {renderBlockEditor(block, (patch) => {
                          setBlocks(b => b.map(x => x.id === block.id ? { ...x, ...patch } as Block : x));
                        })}
                      </div>
                    )}
                  </div>
                ))}

                <div style={{ position: 'relative', marginTop: 20 }}>
                  <button onClick={() => setShowAddMenu(!showAddMenu)} className="btn-ghost" style={{ width: '100%', borderStyle: 'dashed', justifyContent: 'center', border: '2px dashed rgba(0,245,255,0.2)', padding: 16 }}>
                    <Plus size={18} /> Ajouter un bloc de contenu
                  </button>
                  {showAddMenu && (
                    <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, zIndex: 100, background: 'var(--miami-night)', border: '1px solid rgba(0,245,255,0.2)', borderRadius: 16, padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                      {(['heading', 'text', 'exercise', 'table', 'callout', 'divider'] as BlockType[]).map(type => (
                        <button key={type} onClick={() => addBlock(type)} style={{ 
                          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: '16px 8px', color: 'white', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all 0.2s'
                        }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,245,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                           <span style={{ fontSize: '1.5rem' }}>{getBlockEmoji(type)}</span>
                           <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{getBlockLabel(type)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
             <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: 24 }}>Gestion des accès</h2>
             
             <div className="card-glass" style={{ padding: 28, marginBottom: 32 }}>
                <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>Accorder l&apos;accès manuellement</h3>
                <div style={{ display: 'flex', gap: 12 }}>
                  <input 
                    className="input-miami" 
                    placeholder="email@client.com" 
                    value={newEmail} 
                    onChange={e => setNewEmail(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button 
                    onClick={() => handleGrantAccess(newEmail)} 
                    disabled={!newEmail || !!grantLoading}
                    className="btn-primary"
                    style={{ background: 'var(--miami-cyan)', borderColor: 'var(--miami-cyan)' }}
                  >
                    <UserPlus size={16} /> Accorder
                  </button>
                </div>
             </div>

             <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Utilisateurs autorisés ({reservations.length})</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
               {reservations.length === 0 ? (
                 <p style={{ color: 'rgba(226,232,240,0.4)', textAlign: 'center', padding: 40 }}>Aucun accès accordé pour le moment.</p>
               ) : (
                 reservations.map(res => (
                   <div key={res.id} className="card-glass" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(226,232,240,0.5)' }}>
                          <Users size={16} />
                        </div>
                        <div>
                          <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{res.profiles?.email || 'Utilisateur inconnu'}</div>
                          <div style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.75rem' }}>Accordé le {new Date(res.created_at).toLocaleDateString('fr-FR')}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                         <span className={`badge ${res.status === 'granted' ? 'badge-green' : 'badge-yellow'}`}>
                           {res.status === 'granted' ? 'Accordé' : 'En attente'}
                         </span>
                         <button onClick={() => handleDeleteReservation(res.id)} style={{ background: 'none', border: 'none', color: 'rgba(226,232,240,0.3)', cursor: 'pointer' }}>
                           <Trash2 size={16} />
                         </button>
                      </div>
                   </div>
                 ))
               )}
             </div>
          </div>
        )}
      </main>
      <style jsx>{`
        @media (max-width: 1024px) {
          .editor-container { flex-direction: column !important; }
          .editor-sidebar { width: 100% !important; border-right: none !important; border-bottom: 1px solid rgba(0,245,255,0.1); }
          main { height: auto !important; }
        }
      `}</style>
    </div>
  );

  async function handleGrantAccess(email: string) {
    setGrantLoading(email);
    // Find user profile by email
    const { data: prof } = await supabase.from('profiles').select('id').eq('email', email.trim()).maybeSingle();
    
    if (!prof) {
      alert("Ce client n'a pas encore créé de compte sur le site. Il doit s'inscrire avant que vous puissiez lui accorder l'accès.");
      setGrantLoading('');
      return;
    }

    const { error } = await supabase.from('reservations').upsert({
      user_id: prof.id,
      content_type: 'program',
      content_id: program.id,
      status: 'granted'
    }, { onConflict: 'user_id,content_type,content_id' });

    if (!error) {
      setNewEmail('');
      loadReservations(program.id);
    }
    setGrantLoading('');
  }

  async function handleDeleteReservation(id: string) {
    if (!confirm('Supprimer cet accès ?')) return;
    await supabase.from('reservations').delete().eq('id', id);
    loadReservations(program.id);
  }
}

// Helpers
function getBlockEmoji(type: BlockType) {
  const map: any = { heading: '🎯', text: '📝', exercise: '💪', table: '📊', callout: '💡', divider: '➖' };
  return map[type] || '📄';
}

function getBlockLabel(type: BlockType) {
  const map: any = { heading: 'Titre', text: 'Paragraphe', exercise: 'Exercice', table: 'Tableau', callout: 'Encadré', divider: 'Séparateur' };
  return map[type] || type;
}

function getBlockSummary(block: Block) {
  if (block.type === 'heading') return block.content || 'Vide';
  if (block.type === 'text') return (block.content || '').slice(0, 50) + '...';
  if (block.type === 'exercise') return block.name || 'Sans nom';
  if (block.type === 'table') return (block.headers || []).join(', ');
  return '';
}

function renderBlockEditor(block: Block, onUpdate: (patch: any) => void) {
  switch (block.type) {
    case 'heading':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3].map(l => (
              <button key={l} onClick={() => onUpdate({ level: l })} style={{ 
                padding: '8px 16px', borderRadius: 8, border: '1px solid currentColor',
                background: block.level === l ? 'rgba(0,245,255,0.1)' : 'transparent',
                color: block.level === l ? 'var(--miami-cyan)' : 'rgba(226,232,240,0.4)',
                fontWeight: 800, cursor: 'pointer'
              }}>H{l}</button>
            ))}
          </div>
          <input className="input-miami" value={block.content} onChange={e => onUpdate({ content: e.target.value })} placeholder="Texte du titre..." style={{ fontSize: block.level === 1 ? '1.5rem' : '1.2rem', fontWeight: 800 }} />
        </div>
      );
    case 'text':
      return <textarea className="input-miami" rows={6} value={block.content} onChange={e => onUpdate({ content: e.target.value })} placeholder="Contenu du texte..." style={{ lineHeight: 1.6 }} />;
    case 'exercise':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.75rem', display: 'block', marginBottom: 6 }}>Nom de l&apos;exercice</label>
            <input className="input-miami" value={block.name} onChange={e => onUpdate({ name: e.target.value })} placeholder="Ex: Développé couché" />
          </div>
          <div>
            <label style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.75rem', display: 'block', marginBottom: 6 }}>Muscle ciblé</label>
            <input className="input-miami" value={block.muscleGroup} onChange={e => onUpdate({ muscleGroup: e.target.value })} placeholder="Ex: Pectoraux" />
          </div>
          <div>
             <label style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.75rem', display: 'block', marginBottom: 6 }}>URL du GIF (optionnel)</label>
             <input className="input-miami" value={block.gifUrl} onChange={e => onUpdate({ gifUrl: e.target.value })} placeholder="https://..." />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.75rem', display: 'block', marginBottom: 6 }}>Séries</label>
              <input type="number" className="input-miami" value={block.sets} onChange={e => onUpdate({ sets: parseInt(e.target.value) })} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.75rem', display: 'block', marginBottom: 6 }}>Reps</label>
              <input className="input-miami" value={block.reps} onChange={e => onUpdate({ reps: e.target.value })} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.75rem', display: 'block', marginBottom: 6 }}>Repos</label>
              <input className="input-miami" value={block.restTime} onChange={e => onUpdate({ restTime: e.target.value })} />
            </div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.75rem', display: 'block', marginBottom: 6 }}>Instructions</label>
            <textarea className="input-miami" rows={3} value={block.description} onChange={e => onUpdate({ description: e.target.value })} placeholder="Consignes techniques..." />
          </div>
        </div>
      );
    case 'callout':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <input className="input-miami" style={{ width: 60, textAlign: 'center', fontSize: '1.5rem' }} value={block.emoji} onChange={e => onUpdate({ emoji: e.target.value })} />
            <input className="input-miami" style={{ flex: 1 }} value={block.title} onChange={e => onUpdate({ title: e.target.value })} placeholder="Titre de l&apos;encadré" />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['pink', 'cyan', 'purple', 'yellow'] as const).map(c => (
              <button key={c} onClick={() => onUpdate({ color: c })} style={{ 
                width: 32, height: 32, borderRadius: '50%', background: `var(--miami-${c})`, border: block.color === c ? '3px solid white' : 'none', cursor: 'pointer' 
              }} />
            ))}
          </div>
          <textarea className="input-miami" rows={3} value={block.content} onChange={e => onUpdate({ content: e.target.value })} placeholder="Message de l&apos;encadré..." />
        </div>
      );
    case 'table':
      return <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.85rem' }}>L&apos;éditeur de tableau sera disponible prochainement. Pour l&apos;instant, les tableaux sont statiques.</p>;
    case 'divider':
      return <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.85rem' }}>Ligne de séparation décorative.</p>;
    default:
      return null;
  }
}
