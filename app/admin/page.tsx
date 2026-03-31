import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { Users, BookOpen, Dumbbell, Clock, TrendingUp, Settings } from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const adminSupabase = await createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Stats with fallbacks to 0
  const [uRes, eRes, pRes, rRes] = await Promise.all([
    adminSupabase.from('profiles').select('*', { count: 'exact', head: true }),
    adminSupabase.from('ebooks').select('*', { count: 'exact', head: true }),
    adminSupabase.from('programs').select('*', { count: 'exact', head: true }),
    adminSupabase.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  const stats = [
    { label: 'Utilisateurs', value: uRes.count ?? 0, icon: <Users size={22} />, color: 'var(--miami-cyan)', href: '/admin/users' },
    { label: 'E-books', value: eRes.count ?? 0, icon: <BookOpen size={22} />, color: 'var(--miami-pink)', href: '/admin/ebooks' },
    { label: 'Programmes', value: pRes.count ?? 0, icon: <Dumbbell size={22} />, color: 'var(--miami-purple-light)', href: '/admin/programs' },
    { label: 'Accès en attente', value: rRes.count ?? 0, icon: <Clock size={22} />, color: '#facc15', href: '/admin/ebooks' },
  ];

  return (
    <div style={{ padding: '40px' }}>
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
    </div>
  );
}
