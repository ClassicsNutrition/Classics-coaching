import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import EbookRenderer from '@/components/EbookRenderer';
import { ArrowLeft, Lock, Dumbbell, Zap } from 'lucide-react';
import { Block } from '@/lib/blocks';

interface Props { params: Promise<{ slug: string }> }

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!program) notFound();

  // Check access
  let hasAccess = false;
  let reservationStatus: string | null = null;
  if (user) {
    const { data: res } = await supabase
      .from('reservations')
      .select('status')
      .eq('user_id', user.id)
      .eq('content_type', 'program')
      .eq('content_id', program.id)
      .single();
    hasAccess = res?.status === 'granted';
    reservationStatus = res?.status ?? null;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--miami-night)' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid rgba(0,245,255,0.1)', padding: '0 24px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(6,6,15,0.9)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg, #00F5FF, #7B2FBE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'white' }}>
            Classics <span style={{ color: 'var(--miami-cyan)' }}>Coaching</span>
          </span>
        </Link>
        {user ? (
          <Link href="/profile" className="btn-ghost" style={{ fontSize: '0.85rem' }}>Mon Espace</Link>
        ) : (
          <Link href="/login" className="btn-primary" style={{ fontSize: '0.85rem', padding: '9px 18px', background: 'var(--miami-cyan)', borderColor: 'var(--miami-cyan)' }}>Connexion</Link>
        )}
      </nav>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>
        <Link href="/programs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(226,232,240,0.5)', fontSize: '0.85rem', textDecoration: 'none', marginBottom: 32 }}>
          <ArrowLeft size={16} /> Tous les programmes
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div className="badge badge-cyan" style={{ marginBottom: 12, display: 'inline-flex' }}>
            <Dumbbell size={12} /> PROGRAMME
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: 'white', marginBottom: 12, lineHeight: 1.15 }}>
            {program.title}
          </h1>
          {program.description && (
            <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: '1.05rem', lineHeight: 1.7 }}>
              {program.description}
            </p>
          )}
        </div>

        {/* Access Gate */}
        {!hasAccess ? (
          <div className="card-glass" style={{ padding: 64, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'white', marginBottom: 12 }}>
              Contenu Réservé
            </h2>
            <p style={{ color: 'rgba(226,232,240,0.55)', maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.7 }}>
              {reservationStatus === 'pending'
                ? 'Votre demande d\'accès est en cours de traitement. Vous serez notifié dès qu\'elle sera approuvée.'
                : 'Ce programme est réservé aux membres. Demandez l\'accès ci-dessous et nous vous répondrons rapidement.'}
            </p>
            {!user ? (
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/login" className="btn-primary" style={{ background: 'var(--miami-cyan)', borderColor: 'var(--miami-cyan)' }}>
                  <Lock size={16} /> Se connecter pour accéder
                </Link>
                <Link href="/register" className="btn-ghost">Créer un compte</Link>
              </div>
            ) : reservationStatus !== 'pending' ? (
              <RequestAccessButton programId={program.id} userId={user.id} />
            ) : (
              <span className="badge badge-yellow" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>
                ⏳ Demande en attente d&apos;approbation
              </span>
            )}
          </div>
        ) : (
          <div className="card-glass" style={{ padding: 48 }}>
            <EbookRenderer
              blocks={(program.sections || []) as Block[]}
              themePrimary={program.theme_primary}
              themeAccent={program.theme_accent}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Server Action for requesting access
function RequestAccessButton({ programId, userId }: { programId: string; userId: string }) {
  async function requestAccess() {
    'use server';
    const supabase = await createClient();
    await supabase.from('reservations').upsert({
      user_id: userId,
      content_type: 'program',
      content_id: programId,
      status: 'pending',
    }, { onConflict: 'user_id,content_type,content_id' });
    redirect(`/programs`);
  }

  return (
    <form action={requestAccess}>
      <button type="submit" className="btn-primary" style={{ background: 'var(--miami-cyan)', borderColor: 'var(--miami-cyan)' }}>
        <Lock size={16} /> Demander l&apos;accès
      </button>
    </form>
  );
}
