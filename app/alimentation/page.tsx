import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ChevronLeft, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AlimentationLibrary from '@/components/AlimentationLibrary';
import Footer from '@/components/Footer';
import { Suspense } from 'react';

export default async function AlimentationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    isAdmin = profile?.role === 'admin';
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--miami-night)' }}>
      <Navbar user={user} isAdmin={isAdmin} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(226,232,240,0.5)', fontSize: '0.85rem', textDecoration: 'none', marginBottom: 32 }}>
          <ChevronLeft size={16} /> Retour accueil
        </Link>

        <div style={{ marginBottom: 48 }}>
          <div className="badge badge-cyan" style={{ marginBottom: 12, display: 'inline-flex' }}>
            <Zap size={12} /> ALIMENTATION SAINE & NUTRITION
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'white', marginBottom: 12 }}>
            Guide de <span className="gradient-miami-text">nutrition</span>
          </h1>
          <p style={{ color: 'rgba(226,232,240,0.55)', fontSize: '1.05rem', maxWidth: 560 }}>
            Découvrez notre sélection d&apos;aliments 100% sains et recommandés par Classics Coaching pour maximiser votre énergie, votre récupération et vos performances.
          </p>
        </div>

        <Suspense fallback={<div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 48 }}>Chargement du guide...</div>}>
          <AlimentationLibrary user={user} isAdmin={isAdmin} />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
