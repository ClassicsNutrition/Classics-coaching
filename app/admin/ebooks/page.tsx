import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BookOpen, Plus, Eye, Edit, Zap, Users, Dumbbell, Settings, TrendingUp } from 'lucide-react';

export default async function AdminEbooksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: ebooks } = await supabase
    .from('ebooks')
    .select('id, slug, title, published, created_at, updated_at')
    .order('created_at', { ascending: false });

  async function createEbook(formData: FormData) {
    'use server';
    const sb = await createClient();
    const title = formData.get('title') as string;
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const { data } = await sb.from('ebooks').insert({ title, slug }).select('slug').single();
    if (data) redirect(`/admin/ebooks/${data.slug}`);
  }

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>E-books</h1>
          <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.85rem' }}>{ebooks?.length ?? 0} e-book(s) créé(s)</p>
        </div>
        <form action={createEbook} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input name="title" required placeholder="Titre du nouvel e-book..." className="input-miami" style={{ width: 260, padding: '10px 14px' }} />
          <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap', padding: '10px 20px' }}>
            <Plus size={16} /> Créer
          </button>
        </form>
      </div>

      {(!ebooks || ebooks.length === 0) ? (
        <div className="card-glass" style={{ padding: 64, textAlign: 'center' }}>
          <BookOpen size={48} style={{ color: 'rgba(226,232,240,0.15)', marginBottom: 16 }} />
          <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.9rem' }}>Aucun e-book. Créez en un ci-dessus.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ebooks.map(eb => (
            <div key={eb.id} className="card-glass" style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,45,120,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--miami-pink)', flexShrink: 0 }}>
                  < BookOpen size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)', marginBottom: 2 }}>{eb.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)' }}>/{eb.slug} · Modifié le {new Date(eb.updated_at).toLocaleDateString('fr-FR')}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`badge ${eb.published ? 'badge-green' : 'badge-yellow'}`}>
                  {eb.published ? 'Publié' : 'Brouillon'}
                </span>
                <Link href={`/ebooks/${eb.slug}`} className="btn-ghost" style={{ fontSize: '0.8rem', padding: '7px 14px' }}>
                  <Eye size={13} /> Voir
                </Link>
                <Link href={`/admin/ebooks/${eb.slug}`} className="btn-primary" style={{ fontSize: '0.8rem', padding: '7px 14px' }}>
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
