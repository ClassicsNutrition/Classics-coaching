import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Dumbbell, Plus, Eye, Edit, Zap, Users, BookOpen, Settings, TrendingUp } from 'lucide-react';

export default async function AdminProgramsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/profile');

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
    <div style={{ minHeight: '100vh', background: 'var(--miami-night)', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, borderRight: '1px solid rgba(255,45,120,0.1)', padding: '24px 16px', flexShrink: 0, background: 'rgba(6,6,15,0.95)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 32, padding: '0 8px' }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #FF2D78, #7B2FBE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: 'white' }}>Admin <span style={{ color: 'var(--miami-pink)' }}>Panel</span></span>
        </Link>
        {[
          { href: '/admin', label: 'Dashboard', icon: <TrendingUp size={18} /> },
          { href: '/admin/users', label: 'Utilisateurs', icon: <Users size={18} /> },
          { href: '/admin/ebooks', label: 'E-books', icon: <BookOpen size={18} /> },
          { href: '/admin/programs', label: 'Programmes', icon: <Dumbbell size={18} />, active: true },
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>Programmes</h1>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.85rem' }}>{programs?.length ?? 0} programme(s) créé(s)</p>
          </div>
          <form action={createProgram} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input name="title" required placeholder="Titre du nouveau programme..." className="input-miami" style={{ width: 260, padding: '10px 14px' }} />
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
      </main>
    </div>
  );
}
