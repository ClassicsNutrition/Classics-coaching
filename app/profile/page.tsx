import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Zap, LogOut, BookOpen, Dumbbell, User, Clock } from 'lucide-react';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Get profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get reservations with content details
  const { data: reservations } = await supabase
    .from('reservations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const grantedEbooks = reservations?.filter(r => r.content_type === 'ebook' && r.status === 'granted') ?? [];
  const grantedPrograms = reservations?.filter(r => r.content_type === 'program' && r.status === 'granted') ?? [];
  const pendingCount = reservations?.filter(r => r.status === 'pending').length ?? 0;

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Client';
  const joinDate = new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--miami-night)' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid rgba(255,45,120,0.1)', padding: '0 24px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(6,6,15,0.9)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #FF2D78, #7B2FBE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'white' }}>
            Classics <span style={{ color: 'var(--miami-pink)' }}>Coaching</span>
          </span>
        </Link>
        <form action="/auth/signout" method="post">
          <button type="submit" className="btn-ghost" style={{ fontSize: '0.85rem' }}>
            <LogOut size={14} /> Déconnexion
          </button>
        </form>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        {/* Profile Header */}
        <div className="card-glass animate-fadeInUp" style={{ padding: 40, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF2D78, #7B2FBE)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 800, color: 'white',
            boxShadow: '0 0 30px rgba(255,45,120,0.4)',
          }}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>
              Bonjour, {displayName} 👋
            </h1>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.9rem' }}>
              {user.email} · Membre depuis {joinDate}
            </p>
            {profile?.role === 'admin' && (
              <span className="badge badge-pink" style={{ marginTop: 10, display: 'inline-flex' }}>Admin</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {[
              { value: grantedEbooks.length, label: 'E-books', icon: <BookOpen size={16} /> },
              { value: grantedPrograms.length, label: 'Programmes', icon: <Dumbbell size={16} /> },
              { value: pendingCount, label: 'En attente', icon: <Clock size={16} /> },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--miami-cyan)', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(226,232,240,0.5)', fontSize: '0.75rem', marginTop: 4 }}>
                  {stat.icon} {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* E-books */}
          <div className="card-glass animate-fadeInUp animate-delay-100" style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,45,120,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--miami-pink)' }}>
                <BookOpen size={20} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>Mes E-books</h2>
            </div>

            {grantedEbooks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: 'rgba(226,232,240,0.4)' }}>
                <BookOpen size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
                <p style={{ fontSize: '0.875rem' }}>Aucun e-book disponible</p>
                <Link href="/ebooks" className="btn-ghost" style={{ marginTop: 12, fontSize: '0.8rem', justifyContent: 'center' }}>
                  Voir les e-books
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {grantedEbooks.map(r => (
                  <Link key={r.id} href={`/ebooks/${r.content_id}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px',
                    background: 'rgba(255,45,120,0.06)',
                    border: '1px solid rgba(255,45,120,0.1)',
                    borderRadius: 10, textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}>
                    <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>E-book #{r.content_id.slice(-6)}</span>
                    <span className="badge badge-green">Accès accordé</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Programs */}
          <div className="card-glass animate-fadeInUp animate-delay-200" style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,245,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--miami-cyan)' }}>
                <Dumbbell size={20} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>Mes Programmes</h2>
            </div>

            {grantedPrograms.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: 'rgba(226,232,240,0.4)' }}>
                <Dumbbell size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
                <p style={{ fontSize: '0.875rem' }}>Aucun programme disponible</p>
                <Link href="/programs" className="btn-ghost" style={{ marginTop: 12, fontSize: '0.8rem', justifyContent: 'center' }}>
                  Voir les programmes
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {grantedPrograms.map(r => (
                  <Link key={r.id} href={`/programs/${r.content_id}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px',
                    background: 'rgba(0,245,255,0.06)',
                    border: '1px solid rgba(0,245,255,0.1)',
                    borderRadius: 10, textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}>
                    <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>Programme #{r.content_id.slice(-6)}</span>
                    <span className="badge badge-cyan">Accès accordé</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Admin link */}
        {profile?.role === 'admin' && (
          <div className="card-glass animate-fadeInUp" style={{ padding: 24, marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,45,120,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--miami-pink)' }}>
                <User size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)' }}>Espace Administrateur</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(226,232,240,0.5)' }}>Gérer les contenus, utilisateurs et accès</div>
              </div>
            </div>
            <Link href="/admin" className="btn-primary" style={{ padding: '10px 20px' }}>
              Back-Office →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
