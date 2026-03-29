import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Dumbbell, Plus, Eye, Edit } from 'lucide-react';

export default async function AdminProgramsPage() {
  const supabase = await createClient();

  const { data: programs } = await supabase
    .from('programs')
    .select('id, slug, title, published, created_at, updated_at')
    .order('created_at', { ascending: false });

  async function createProgram(formData: FormData) {
    'use server';
    const sb = await createClient();
    const title = formData.get('title') as string;
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const { data } = await sb.from('programs').insert({ title, slug }).select('slug').single();
    if (data) redirect(`/admin/programs/${data.slug}`);
  }

  return (
    <div style={{ padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>Programmes</h1>
          <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.85rem' }}>{programs?.length ?? 0} programme(s) créé(s)</p>
        </div>
        <form action={createProgram} style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <input name="title" required placeholder="Titre..." className="input-miami" style={{ width: 200, padding: '10px 14px' }} />
          <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap', padding: '10px 20px', background: 'var(--miami-cyan)', borderColor: 'var(--miami-cyan)' }}>
            <Plus size={16} /> Créer
          </button>
        </form>
      </div>

      {(!programs || programs.length === 0) ? (
        <div className="card-glass" style={{ padding: 64, textAlign: 'center' }}>
          <Dumbbell size={48} style={{ color: 'rgba(226,232,240,0.15)', marginBottom: 16 }} />
          <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.9rem' }}>Aucun programme. Créez en un ci-dessus.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {programs.map(p => (
            <div key={p.id} className="card-glass" style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(0,245,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--miami-cyan)', flexShrink: 0 }}>
                  <Dumbbell size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)', marginBottom: 2 }}>{p.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)' }}>/{p.slug} · Modifié le {new Date(p.updated_at).toLocaleDateString('fr-FR')}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`badge ${p.published ? 'badge-green' : 'badge-yellow'}`}>
                  {p.published ? 'Publié' : 'Brouillon'}
                </span>
                <Link href={`/programs/${p.slug}`} className="btn-ghost" style={{ fontSize: '0.8rem', padding: '7px 14px' }}>
                  <Eye size={13} /> Voir
                </Link>
                <Link href={`/admin/programs/${p.slug}`} className="btn-primary" style={{ fontSize: '0.8rem', padding: '7px 14px', background: 'var(--miami-cyan)', borderColor: 'var(--miami-cyan)' }}>
                  <Edit size={13} /> Éditer
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
