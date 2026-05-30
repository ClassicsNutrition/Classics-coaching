import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ChevronLeft, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ExercisesLibrary from '@/components/ExercisesLibrary';
import { Suspense } from 'react';

export default async function ExercisesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    isAdmin = profile?.role === 'admin';
  }

  // Fetch all exercises from Supabase
  const { data: dbExercises } = await supabase
    .from('exercises')
    .select('*')
    .order('name', { ascending: true });

  const exercises = dbExercises || [];

  // Fetch user's favorite exercise IDs if logged in
  let favoriteIds: string[] = [];
  if (user) {
    const { data: favs } = await supabase
      .from('favorite_exercises')
      .select('exercise_id')
      .eq('user_id', user.id);
    favoriteIds = favs?.map(f => f.exercise_id) || [];
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--miami-night)', color: '#F5F0FF' }}>
      <Navbar user={user} isAdmin={isAdmin} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(226,232,240,0.5)', fontSize: '0.85rem', textDecoration: 'none', marginBottom: 32 }}>
          <ChevronLeft size={16} /> Retour accueil
        </Link>

        <div style={{ marginBottom: 48 }}>
          <div className="badge badge-pink" style={{ marginBottom: 12, display: 'inline-flex', letterSpacing: '0.1em' }}>
            <Zap size={12} /> GUIDE & VIDÉOS D'EXÉCUTION
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'white', marginBottom: 12 }}>
            Bibliothèque d&#39; <span className="gradient-miami-text">Exercices</span>
          </h1>
          <p style={{ color: 'rgba(226,232,240,0.55)', fontSize: '1.05rem', maxWidth: 620 }}>
            Maîtrisez l&#39;exécution technique de vos mouvements grâce à notre guide vidéo et descriptif complet pour optimiser vos performances et éviter les blessures.
          </p>
        </div>

        <Suspense fallback={<div style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 48 }}>Chargement de la bibliothèque...</div>}>
          <ExercisesLibrary 
            exercises={exercises} 
            user={user} 
            initialFavorites={favoriteIds} 
          />
        </Suspense>
      </div>
    </div>
  );
}
