import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import EbookRenderer from '@/components/EbookRenderer';
import { ArrowLeft, Lock, BookOpen, Zap } from 'lucide-react';
import { Block } from '@/lib/blocks';
import Navbar from '@/components/Navbar';

interface Props { params: Promise<{ slug: string }> }

export default async function EbookPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    isAdmin = profile?.role === 'admin';
  }

  const { data: ebook } = await supabase
    .from('ebooks')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!ebook) notFound();

  // Check access
  let hasAccess = false;
  let reservationStatus: string | null = null;
  if (user) {
    const { data: res } = await supabase
      .from('reservations')
      .select('status')
      .eq('user_id', user.id)
      .eq('content_type', 'ebook')
      .eq('content_id', ebook.id)
      .single();
    hasAccess = res?.status === 'granted';
    reservationStatus = res?.status ?? null;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--miami-night)' }}>
      <Navbar user={user} isAdmin={isAdmin} />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>
        <Link href="/ebooks" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(226,232,240,0.5)', fontSize: '0.85rem', textDecoration: 'none', marginBottom: 32 }}>
          <ArrowLeft size={16} /> Tous les e-books
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div className="badge badge-pink" style={{ marginBottom: 12, display: 'inline-flex' }}>
            <BookOpen size={12} /> E-BOOK
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: 'white', marginBottom: 12, lineHeight: 1.15 }}>
            {ebook.title}
          </h1>
          {ebook.description && (
            <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: '1.05rem', lineHeight: 1.7 }}>
              {ebook.description}
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
                : 'Cet e-book est réservé aux abonnés. Demandez l\'accès ci-dessous et nous vous répondrons rapidement.'}
            </p>
            {!user ? (
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/login" className="btn-primary">
                  <Lock size={16} /> Se connecter pour accéder
                </Link>
                <Link href="/register" className="btn-ghost">Créer un compte</Link>
              </div>
            ) : reservationStatus !== 'pending' ? (
              <RequestAccessButton ebookId={ebook.id} userId={user.id} />
            ) : (
              <span className="badge badge-yellow" style={{ fontSize: '0.9rem', padding: '8px 20px' }}>
                ⏳ Demande en attente d&apos;approbation
              </span>
            )}
          </div>
        ) : (
          <div className="card-glass" style={{ padding: 48 }}>
            <EbookRenderer
              blocks={(ebook.sections || []) as Block[]}
              pdfUrl={ebook.pdf_url}
              themePrimary={ebook.theme_primary}
              themeAccent={ebook.theme_accent}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Server Action for requesting access
function RequestAccessButton({ ebookId, userId }: { ebookId: string; userId: string }) {
  async function requestAccess() {
    'use server';
    const supabase = await createClient();
    await supabase.from('reservations').upsert({
      user_id: userId,
      content_type: 'ebook',
      content_id: ebookId,
      status: 'pending',
    }, { onConflict: 'user_id,content_type,content_id' });
    redirect(`/ebooks`);
  }

  return (
    <form action={requestAccess}>
      <button type="submit" className="btn-primary">
        <Lock size={16} /> Demander l&apos;accès
      </button>
    </form>
  );
}
