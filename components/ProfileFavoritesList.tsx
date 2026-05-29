'use client';

import { useState } from 'react';
import { Heart, Dumbbell, X, Play } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

function getMainMuscles(muscleGroupStr?: string): string[] {
  if (!muscleGroupStr) return [];
  const parts = muscleGroupStr.split(',').map(m => m.trim());
  const simplified = parts.map(p => {
    const beforeDash = p.split(' - ')[0];
    const beforeParen = beforeDash.split('(')[0];
    return beforeParen.trim();
  });
  return Array.from(new Set(simplified)).slice(0, 2);
}

interface Exercise {
  id: string;
  name: string;
  gif_url?: string;
  muscle_group?: string;
  instructions?: string;
}

interface ProfileFavoritesListProps {
  initialExercises: Exercise[];
  userId: string;
}

export default function ProfileFavoritesList({ initialExercises, userId }: ProfileFavoritesListProps) {
  const supabase = createClient();
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  async function handleRemoveFavorite(exerciseId: string, e: React.MouseEvent) {
    e.stopPropagation(); // Prevent opening modal

    // Optimistic Update
    setExercises(prev => prev.filter(ex => ex.id !== exerciseId));

    const { error } = await supabase
      .from('favorite_exercises')
      .delete()
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId);

    if (error) {
      console.error("Error removing favorite:", error.message);
      // Revert if error occurs (we'd have to find it back, but let's re-fetch or alert)
      alert("Une erreur est survenue lors de la suppression de vos favoris.");
      // Reload page to get fresh state if query failed
      window.location.reload();
    }
  }

  if (exercises.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 16px', color: 'rgba(226,232,240,0.4)' }}>
        <Heart size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
        <p style={{ fontSize: '0.875rem' }}>Aucun exercice dans vos favoris pour le moment.</p>
        <Link href="/" className="btn-ghost" style={{ marginTop: 12, fontSize: '0.8rem', display: 'inline-flex', justifyContent: 'center' }}>
          Découvrir les exercices
        </Link>
      </div>
    );
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {exercises.map(ex => (
          <div 
            key={ex.id} 
            onClick={() => setActiveExercise(ex)}
            className="hover-lift" 
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 12,
              padding: 14,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
          >
            <div style={{ 
              width: '100%', 
              height: 100, 
              borderRadius: 8, 
              background: 'rgba(7, 6, 26, 0.4)', 
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              {ex.gif_url ? (
                <img src={ex.gif_url} alt={ex.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Dumbbell size={24} style={{ color: 'rgba(245, 240, 255, 0.2)' }} />
              )}

              {/* Unfavorite Heart Button */}
              <button
                onClick={(e) => handleRemoveFavorite(ex.id, e)}
                title="Retirer des favoris"
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 10,
                  background: 'rgba(7, 6, 26, 0.75)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--miami-pink)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 0 8px rgba(255, 10, 94, 0.3)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.color = '#ff6b9d';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.color = 'var(--miami-pink)';
                }}
              >
                <Heart size={14} style={{ fill: 'var(--miami-pink)' }} />
              </button>

              {/* Play overlay on hover */}
              <div style={{
                position: 'absolute', inset: 0, 
                background: 'rgba(7, 6, 26, 0.4)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.2s',
                zIndex: 5
              }}
              className="play-overlay"
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0'}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--miami-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 10px var(--miami-pink)' }}>
                  <Play size={14} style={{ fill: 'currentColor', marginLeft: 2 }} />
                </div>
              </div>
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 700, marginBottom: 6 }}>
                {ex.name}
              </h4>
              {ex.muscle_group && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {getMainMuscles(ex.muscle_group).map((m: string) => (
                    <span key={m} className="badge" style={{ fontSize: '0.65rem', background: 'rgba(189, 0, 255, 0.1)', color: 'var(--miami-purple-light)', border: '1px solid rgba(189, 0, 255, 0.2)' }}>
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Exercise Details Modal */}
      {activeExercise && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(4, 3, 16, 0.85)', 
            backdropFilter: 'blur(16px)', 
            zIndex: 1100, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: 20 
          }}
          onClick={() => setActiveExercise(null)}
        >
          <div 
            className="card-glass" 
            style={{ 
              width: '100%', 
              maxWidth: 550, 
              padding: 32, 
              position: 'relative',
              border: '1px solid rgba(255, 10, 94, 0.3)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 10, 94, 0.15)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveExercise(null)} 
              style={{ 
                position: 'absolute', 
                top: 20, 
                right: 20, 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                color: 'white', 
                cursor: 'pointer',
                borderRadius: '50%',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,10,94,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <X size={20} />
            </button>

            {/* Modal Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 10 }}>
              <div>
                {activeExercise.muscle_group && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 12 }}>
                    {activeExercise.muscle_group.split(',').map((m: string) => (
                      <span 
                        key={m.trim()}
                        className="badge" 
                        style={{ 
                          background: 'rgba(189, 0, 255, 0.15)', 
                          color: 'var(--miami-purple-light)', 
                          border: '1px solid rgba(189, 0, 255, 0.3)',
                          letterSpacing: '0.05em',
                          fontSize: '0.75rem'
                        }}
                      >
                        {m.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <h3 style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: '2.5rem', 
                    fontWeight: 'normal', 
                    color: 'white', 
                    lineHeight: 1, 
                    letterSpacing: '0.04em',
                    margin: 0,
                    flex: 1
                  }}>
                    {activeExercise.name}
                  </h3>
                  <button
                    onClick={(e) => handleRemoveFavorite(activeExercise.id, e).then(() => setActiveExercise(null))}
                    style={{
                      background: 'rgba(255, 10, 94, 0.1)',
                      border: '1px solid rgba(255, 10, 94, 0.25)',
                      borderRadius: '12px',
                      padding: '8px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      marginRight: 40
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255, 10, 94, 0.2)';
                      e.currentTarget.style.borderColor = 'var(--miami-pink)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255, 10, 94, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(255, 10, 94, 0.25)';
                    }}
                  >
                    <Heart 
                      size={16} 
                      style={{ 
                        color: 'var(--miami-pink)', 
                        fill: 'var(--miami-pink)',
                        transition: 'fill 0.2s'
                      }} 
                    />
                    Retirer des favoris
                  </button>
                </div>
              </div>

              {/* Demo Animation Container */}
              <div style={{ 
                width: '100%', 
                height: 280, 
                borderRadius: 16, 
                background: 'rgba(7, 6, 26, 0.6)', 
                border: '1px solid rgba(255, 255, 255, 0.05)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.6)'
              }}>
                {activeExercise.gif_url ? (
                  <img 
                    src={activeExercise.gif_url} 
                    alt={activeExercise.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: 'rgba(245, 240, 255, 0.3)' }}>
                    <Dumbbell size={48} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                    <p style={{ fontSize: '0.9rem' }}>Pas d&apos;animation disponible</p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div>
                <h4 style={{ 
                  color: 'white', 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '1.4rem', 
                  fontWeight: 'normal', 
                  letterSpacing: '0.04em',
                  marginBottom: 10,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: 6
                }}>
                  Instructions de mouvement
                </h4>
                {activeExercise.instructions ? (
                  <p style={{ 
                    fontSize: '0.95rem', 
                    color: 'rgba(245, 240, 255, 0.75)', 
                    lineHeight: 1.6, 
                    whiteSpace: 'pre-line',
                    margin: 0
                  }}>
                    {activeExercise.instructions}
                  </p>
                ) : (
                  <p style={{ fontSize: '0.95rem', color: 'rgba(245, 240, 255, 0.4)', fontStyle: 'italic', margin: 0 }}>
                    Aucune instruction disponible pour cet exercice.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
