import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Dumbbell, Lock, ArrowRight, Zap, ChevronLeft } from 'lucide-react';

export default async function ProgramsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: programs } = await supabase
    .from('programs')
    .select('id, slug, title, description, cover_url, theme_primary, theme_accent')
    .eq('published', true)
    .order('created_at', { ascending: false });

  // Get user's reservations
  let grantedIds: string[] = [];
  let pendingIds: string[] = [];
  if (user) {
    const { data: res } = await supabase
      .from('reservations')
      .select('content_id, status')
      .eq('user_id', user.id)
      .eq('content_type', 'program');
    grantedIds = res?.filter(r => r.status === 'granted').map(r => r.content_id) ?? [];
    pendingIds = res?.filter(r => r.status === 'pending').map(r => r.content_id) ?? [];
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--miami-night)' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid rgba(0,245,255,0.1)', padding: '0 24px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(6,6,15,0.9)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="Classics Coaching" style={{ height: 40, width: 'auto' }} />
        </Link>
        {user ? (
          <Link href="/profile" className="btn-ghost" style={{ fontSize: '0.85rem' }}>Mon Espace</Link>
        ) : (
          <Link href="/login" className="btn-primary" style={{ fontSize: '0.85rem', padding: '9px 18px', background: 'var(--miami-cyan)', borderColor: 'var(--miami-cyan)' }}>Connexion</Link>
        )}
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(226,232,240,0.5)', fontSize: '0.85rem', textDecoration: 'none', marginBottom: 32 }}>
          <ChevronLeft size={16} /> Retour accueil
        </Link>

        <div style={{ marginBottom: 48 }}>
          <div className="badge badge-cyan" style={{ marginBottom: 12, display: 'inline-flex' }}>
            <Dumbbell size={12} /> PROGRAMMES DE COACHING
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'white', marginBottom: 12 }}>
            Plans d&apos;entraînement{' '}
            <span className="gradient-miami-text" style={{ background: 'linear-gradient(to right, var(--miami-cyan), #7B2FBE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>experts</span>
          </h1>
          <p style={{ color: 'rgba(226,232,240,0.55)', fontSize: '1.05rem', maxWidth: 560 }}>
            Des parcours structurés et personnalisés pour atteindre vos objectifs physiques avec la méthodologie Classics Coaching.
          </p>
        </div>

        {(!programs || programs.length === 0) ? (
          <div className="card-glass" style={{ padding: 64, textAlign: 'center' }}>
            <Dumbbell size={48} style={{ color: 'rgba(226,232,240,0.2)', marginBottom: 16 }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'white', marginBottom: 8 }}>
              Bientôt disponible
            </h3>
            <p style={{ color: 'rgba(226,232,240,0.45)', fontSize: '0.9rem' }}>
              Les programmes sont en cours de préparation. Revenez très bientôt !
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {programs.map((program) => {
              const isGranted = grantedIds.includes(program.id);
              const isPending = pendingIds.includes(program.id);
              const primary = program.theme_primary || '#00F5FF';

              return (
                <div key={program.id} className="card-glass card-glass-hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {/* Cover */}
                  <div style={{
                    height: 180,
                    background: program.cover_url
                      ? `url(${program.cover_url}) center/cover`
                      : `linear-gradient(135deg, ${primary}33, var(--miami-dusk))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    {!program.cover_url && <Dumbbell size={48} style={{ color: primary, opacity: 0.5 }} />}
                    {isGranted && (
                      <div className="badge badge-green" style={{ position: 'absolute', top: 12, right: 12 }}>Accès accordé</div>
                    )}
                    {isPending && (
                      <div className="badge badge-yellow" style={{ position: 'absolute', top: 12, right: 12 }}>En attente</div>
                    )}
                  </div>
                  <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: 8 }}>
                      {program.title}
                    </h3>
                    {program.description && (
                      <p style={{ color: 'rgba(226,232,240,0.55)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 20, flex: 1 }}>
                        {program.description}
                      </p>
                    )}
                    <Link href={`/programs/${program.slug}`} className={isGranted ? 'btn-primary' : 'btn-ghost'} style={{ justifyContent: 'center', fontSize: '0.875rem', borderColor: isGranted ? primary : 'rgba(226,232,240,0.1)', background: isGranted ? primary : 'transparent' }}>
                      {isGranted ? (
                        <><Dumbbell size={14} /> Voir le programme</>
                      ) : isPending ? (
                        <><Lock size={14} /> Demande en attente</>
                      ) : (
                        <><Lock size={14} /> Demander l&apos;accès <ArrowRight size={14} /></>
                      )}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
