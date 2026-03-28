import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Users, BookOpen, Dumbbell, Clock, TrendingUp, Settings } from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/profile');

  // Stats
  const [{ count: usersCount }, { count: ebooksCount }, { count: programsCount }, { count: pendingCount }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('ebooks').select('*', { count: 'exact', head: true }),
    supabase.from('programs').select('*', { count: 'exact', head: true }),
    supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  const stats = [
    { label: 'Utilisateurs', value: usersCount ?? 0, icon: <Users size={22} />, color: 'var(--miami-cyan)', href: '/admin/users' },
    { label: 'E-books', value: ebooksCount ?? 0, icon: <BookOpen size={22} />, color: 'var(--miami-pink)', href: '/admin/ebooks' },
    { label: 'Programmes', value: programsCount ?? 0, icon: <Dumbbell size={22} />, color: 'var(--miami-purple-light)', href: '/admin/programs' },
    { label: 'Accès en attente', value: pendingCount ?? 0, icon: <Clock size={22} />, color: '#facc15', href: '/admin/ebooks' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--miami-night)', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, borderRight: '1px solid rgba(255,45,120,0.1)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 4, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', background: 'rgba(6,6,15,0.95)' }}>
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
          { href: '/admin/exercises', label: 'Exercices', icon: <Settings size={18} /> },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10,
            textDecoration: 'none', color: 'rgba(226,232,240,0.65)',
            fontSize: '0.875rem', fontWeight: 500,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,45,120,0.1)'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(226,232,240,0.65)'; }}
          >
            {item.icon} {item.label}
          </Link>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid rgba(255,45,120,0.1)' }}>
          <Link href="/profile" className="btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}>
            ← Espace client
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '40px 40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: 6 }}>
            Dashboard
          </h1>
          <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.9rem' }}>
            Bienvenue, {user.email}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
          {stats.map(stat => (
            <Link key={stat.label} href={stat.href} className="card-glass card-glass-hover" style={{ padding: 28, textDecoration: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${stat.color}18`,
                  border: `1px solid ${stat.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: stat.color,
                }}>
                  {stat.icon}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(226,232,240,0.5)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {stat.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card-glass" style={{ padding: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'white', marginBottom: 20 }}>
            Actions rapides
          </h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/admin/ebooks" className="btn-primary" style={{ fontSize: '0.875rem', padding: '10px 20px' }}>
              <BookOpen size={15} /> Gérer les e-books
            </Link>
            <Link href="/admin/programs" className="btn-secondary" style={{ fontSize: '0.875rem', padding: '10px 20px' }}>
              <Dumbbell size={15} /> Gérer les programmes
            </Link>
            <Link href="/admin/users" className="btn-ghost" style={{ fontSize: '0.875rem', padding: '10px 20px' }}>
              <Users size={15} /> Gérer les utilisateurs
            </Link>
            <Link href="/admin/exercises" className="btn-ghost" style={{ fontSize: '0.875rem', padding: '10px 20px' }}>
              <Settings size={15} /> Bibliothèque d&apos;exercices
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
