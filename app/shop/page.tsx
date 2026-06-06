import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ShopLibrary from '@/components/ShopLibrary';
import Footer from '@/components/Footer';
import { Suspense } from 'react';

export default async function ShopPage() {
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
          <div className="badge badge-pink" style={{ marginBottom: 12, display: 'inline-flex' }}>
            <ShoppingBag size={12} /> BOUTIQUE EN LIGNE
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'white', marginBottom: 12 }}>
            Compléments <span className="gradient-miami-text">Classics Nutrition</span>
          </h1>
          <p style={{ color: 'rgba(226,232,240,0.55)', fontSize: '1.05rem', maxWidth: 560 }}>
            Découvrez nos gammes de suppléments formulées pour propulser vos entraînements, votre forme et votre santé au niveau supérieur.
          </p>
        </div>

        <Suspense fallback={<div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 48 }}>Chargement de la boutique...</div>}>
          <ShopLibrary user={user} isAdmin={isAdmin} />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
