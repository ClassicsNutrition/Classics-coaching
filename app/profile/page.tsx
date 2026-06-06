import { redirect } from 'next/navigation';
import Link from 'next/link';
export const revalidate = 0;
import { createClient } from '@/lib/supabase/server';
import { LogOut, BookOpen, Dumbbell, User, Clock, Heart, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ProfileFavoritesList from '@/components/ProfileFavoritesList';
import ProfileAvatarEditor from '@/components/ProfileAvatarEditor';
import ProfileChat from '@/components/ProfileChat';
import ProfileMorphologyForm from '@/components/ProfileMorphologyForm';

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
  const { data: qRes } = await supabase
    .from('reservations')
    .select(`
      *,
      ebooks(title, slug),
      programs(title, slug)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const reservations = qRes || [];
  const grantedEbooks = reservations.filter((r: any) => r.content_type === 'ebook' && r.status === 'granted');
  const grantedPrograms = reservations.filter((r: any) => r.content_type === 'program' && r.status === 'granted');
  const pendingCount = reservations.filter((r: any) => r.status === 'pending').length;

  // Fetch user's favorite exercises
  const { data: dbFavs } = await supabase
    .from('favorite_exercises')
    .select(`
      exercise_id,
      exercises (
        id,
        name,
        gif_url,
        muscle_group,
        instructions
      )
    `)
    .eq('user_id', user.id);
  const favoriteExercises = dbFavs?.map((f: any) => f.exercises).filter(Boolean) || [];

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Client';
  const joinDate = new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  
  // Get chat room for user to check unread messages
  const { data: chatRoom } = await supabase
    .from('chat_rooms')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();
  const unreadMessagesCount = chatRoom?.user_unread_count || 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--miami-night)' }}>
      <Navbar user={user} isAdmin={profile?.role === 'admin' || user.app_metadata?.role === 'admin'} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        {/* Profile Header */}
        <div className="card-glass animate-fadeInUp" style={{ padding: 'clamp(24px, 5vw, 40px)', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          <ProfileAvatarEditor 
            currentAvatarUrl={profile?.avatar_url} 
            userId={user.id} 
            displayName={displayName} 
          />
          <div style={{ flex: '1 1 300px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: 4 }}>
              Bonjour, {displayName} 👋
            </h1>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.9rem' }}>
              {user.email} · Membre depuis {joinDate}
            </p>
            {(profile?.role === 'admin' || user.app_metadata?.role === 'admin') && (
              <span className="badge badge-pink" style={{ marginTop: 10, display: 'inline-flex' }}>Admin</span>
            )}
            <form action="/auth/signout" method="post" style={{ marginTop: 16 }}>
              <button type="submit" className="btn-ghost" style={{ padding: '10px 16px', fontSize: '0.85rem', border: '1px solid rgba(255,45,120,0.2)' }}>
                <LogOut size={16} /> Déconnexion
              </button>
            </form>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
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

        {/* Client Notification Center (Banner for new chat messages) */}
        {unreadMessagesCount > 0 && (
          <div className="card-glass animate-fadeInUp" style={{
            padding: '16px 24px',
            marginBottom: 32,
            border: '1px solid var(--miami-pink)',
            background: 'rgba(255, 45, 120, 0.05)',
            boxShadow: '0 0 15px rgba(255, 45, 120, 0.1)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.5rem' }}>💬</span>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>Nouveau message de votre coach !</div>
                <div style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.8rem' }}>Vous avez {unreadMessagesCount} nouveau(x) message(s) de Classics Coaching.</div>
              </div>
            </div>
            <a href="#messagerie-coach" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', textDecoration: 'none' }}>
              Répondre
            </a>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {/* E-books */}
          <div className="card-glass animate-fadeInUp animate-delay-100" style={{ padding: 'clamp(24px, 4vw, 32px)' }}>
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
                  <Link key={r.id} href={`/ebooks/${r.ebooks?.slug || r.content_id}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px',
                    background: 'rgba(255,45,120,0.06)',
                    border: '1px solid rgba(255,45,120,0.1)',
                    borderRadius: 10, textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}>
                    <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{r.ebooks?.title || `E-book #${r.content_id.slice(-6)}`}</span>
                    <span className="badge badge-green">Voir</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Programs */}
          <div className="card-glass animate-fadeInUp animate-delay-200" style={{ padding: 'clamp(24px, 4vw, 32px)' }}>
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
                  <Link key={r.id} href={`/programs/${r.programs?.slug || r.content_id}`} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 16px',
                    background: 'rgba(0,245,255,0.06)',
                    border: '1px solid rgba(0,245,255,0.1)',
                    borderRadius: 10, textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}>
                    <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{r.programs?.title || `Programme #${r.content_id.slice(-6)}`}</span>
                    <span className="badge badge-cyan">Voir</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Favorite Exercises Section */}
        <div className="card-glass animate-fadeInUp animate-delay-300" style={{ padding: 'clamp(24px, 4vw, 32px)', marginTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255, 10, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--miami-pink)' }}>
              <Heart size={20} style={{ fill: 'currentColor' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>Mes Exercices Favoris</h2>
          </div>

          <ProfileFavoritesList initialExercises={favoriteExercises} userId={user.id} />
        </div>

        {/* Profil Morphologique */}
        <ProfileMorphologyForm 
          userId={user.id}
          initialHeight={profile?.height}
          initialWeight={profile?.weight}
          initialObjective={profile?.objective}
          initialMedicalHistory={profile?.medical_history}
          initialSportsHistory={profile?.sports_history}
        />

        {/* Messagerie avec le Coach */}
        <div id="messagerie-coach" className="card-glass animate-fadeInUp animate-delay-300" style={{ padding: 'clamp(24px, 4vw, 32px)', marginTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0, 245, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--miami-cyan)' }}>
              <MessageSquare size={20} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>Messagerie avec le Coach</h2>
          </div>
          
          <ProfileChat />
        </div>

        {/* Admin link */}
        {(profile?.role === 'admin' || user.app_metadata?.role === 'admin') && (
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
