'use client';

import { useState, useEffect } from 'react';
import { Search, Dumbbell, Play, X, Info, Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';

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
  created_at: string;
}

interface ExercisesLibraryProps {
  exercises: Exercise[];
  user?: any;
  initialFavorites?: string[];
}

const MAIN_CATEGORIES = ['Tous', 'Pectoraux', 'Dos', 'Épaules', 'Bras', 'Jambes', 'Abdominaux'];

const OBJECTIVES = [
  { name: 'Tous les Exercices', param: 'Tous', desc: 'Découvrez l\'ensemble des mouvements.', icon: '🔥', glow: 'rgba(255, 10, 94, 0.25)', color: 'var(--miami-pink)' },
  { name: 'Pectoraux (Pecs)', param: 'Pectoraux', desc: 'Pectoraux massifs et volumineux.', icon: '💪', glow: 'rgba(0, 245, 255, 0.25)', color: 'var(--miami-cyan)' },
  { name: 'Dos en V', param: 'Dos', desc: 'Cible l\'épaisseur et la largeur du dos.', icon: '🦅', glow: 'rgba(189, 0, 255, 0.25)', color: 'var(--miami-purple-light)' },
  { name: 'Épaules 3D', param: 'Épaules', desc: 'Deltoïdes volumineux et galbés.', icon: '🛡️', glow: 'rgba(250, 204, 21, 0.25)', color: '#facc15' },
  { name: 'Biceps & Bras', param: 'Bras', desc: 'Biceps massifs et triceps dessinés.', icon: '⚡', glow: 'rgba(0, 245, 255, 0.25)', color: 'var(--miami-cyan)' },
  { name: 'Jambes', param: 'Jambes', desc: 'Quadriceps, ischios et mollets puissants.', icon: '🦵', glow: 'rgba(255, 10, 94, 0.25)', color: 'var(--miami-pink)' },
  { name: 'Abdos en Béton', param: 'Abdominaux', desc: 'Gainage et sangle abdominale tracés.', icon: '🍫', glow: 'rgba(189, 0, 255, 0.25)', color: 'var(--miami-purple-light)' }
];

function isExerciseMatchingMuscle(exercise: Exercise, selectedMuscle: string, favorites: string[]): boolean {
  if (selectedMuscle === 'Tous') return true;
  if (selectedMuscle === 'Favoris') return favorites.includes(exercise.id);
  if (!exercise.muscle_group) return false;
  
  const portions = exercise.muscle_group.split(',').map(s => s.trim().toLowerCase());
  const search = selectedMuscle.toLowerCase();
  
  if (search === 'bras') {
    return portions.some(p => 
      p.includes('bras') || p.includes('biceps') || p.includes('triceps')
    );
  }
  
  return portions.some(p => p.includes(search));
}

export default function ExercisesLibrary({ exercises, user, initialFavorites = [] }: ExercisesLibraryProps) {
  const supabase = createClient();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('Tous');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [favorites, setFavorites] = useState<string[]>(initialFavorites);
  const [visibleCount, setVisibleCount] = useState(12);

  // Sync search parameters from URL (e.g. ?muscle=Pectoraux)
  useEffect(() => {
    const muscleParam = searchParams.get('muscle');
    if (muscleParam) {
      const capitalized = muscleParam.charAt(0).toUpperCase() + muscleParam.slice(1).toLowerCase();
      let normalized = capitalized;
      if (normalized.startsWith('Pec')) normalized = 'Pectoraux';
      if (normalized.startsWith('Abdo')) normalized = 'Abdominaux';

      if (MAIN_CATEGORIES.includes(normalized) || normalized === 'Bras') {
        // "Bras" is used as the param, but is translated to categories correctly
        setSelectedMuscle(normalized);
      }
    } else {
      setSelectedMuscle('Tous');
    }
  }, [searchParams]);

  // Reset visible exercise count on filter change
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedMuscle, searchTerm]);

  // Filters
  const matchesSearch = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));

  const filteredExercises = exercises.filter(ex => {
    const matchesQuery = matchesSearch(ex.name) || (ex.muscle_group && matchesSearch(ex.muscle_group));
    const matchesMuscle = isExerciseMatchingMuscle(ex, selectedMuscle, favorites);
    return matchesQuery && matchesMuscle;
  });

  const hasSearch = searchTerm.trim().length > 0;

  async function toggleFavorite(exerciseId: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!user) {
      alert("Connectez-vous pour ajouter cet exercice à vos favoris.");
      return;
    }
    const isFav = favorites.includes(exerciseId);
    setFavorites(prev => 
      isFav ? prev.filter(id => id !== exerciseId) : [...prev, exerciseId]
    );
    if (isFav) {
      const { error } = await supabase
        .from('favorite_exercises')
        .delete()
        .eq('user_id', user.id)
        .eq('exercise_id', exerciseId);
      if (error) {
        console.error("Error removing favorite:", error.message);
        setFavorites(prev => [...prev, exerciseId]);
      }
    } else {
      const { error } = await supabase
        .from('favorite_exercises')
        .insert({ user_id: user.id, exercise_id: exerciseId });
      if (error) {
        console.error("Error adding favorite:", error.message);
        setFavorites(prev => prev.filter(id => id !== exerciseId));
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
      
      {/* Search Bar Container */}
      <div 
        className="card-glass" 
        style={{ 
          padding: '24px 32px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 16,
          border: '1px solid rgba(0, 245, 255, 0.25)',
          boxShadow: '0 8px 32px rgba(7, 6, 26, 0.5), 0 0 25px rgba(0, 245, 255, 0.08)',
          borderRadius: 20
        }}
      >
        <div style={{ position: 'relative', width: '100%' }}>
          <Search 
            size={22} 
            style={{ 
              position: 'absolute', 
              left: 18, 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--miami-cyan)' 
            }} 
          />
          <input 
            className="input-miami" 
            placeholder="Rechercher un mouvement spécifique (ex: développé couché, squat, curl...)" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ 
              paddingLeft: 54, 
              width: '100%', 
              height: 56, 
              fontSize: '1.05rem',
              borderRadius: 14,
              borderColor: searchTerm ? 'var(--miami-cyan)' : 'rgba(255, 10, 94, 0.25)'
            }}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'rgba(226, 232, 240, 0.5)',
                cursor: 'pointer',
                padding: 4
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        {hasSearch && (
          <div style={{ fontSize: '0.9rem', color: 'rgba(245, 240, 255, 0.65)' }}>
            Résultats de recherche pour &quot;<span style={{ color: 'var(--miami-cyan)' }}>{searchTerm}</span>&quot; : 
            {` ${filteredExercises.length} mouvement(s) trouvé(s).`}
          </div>
        )}
      </div>
      
      {/* Objective Filter Cards */}
      {!hasSearch && (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 16, 
            background: 'rgba(20, 19, 58, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '24px',
            borderRadius: 20,
            backdropFilter: 'blur(10px)'
          }}
        >
          {(user 
            ? [...OBJECTIVES, { name: 'Mes Favoris', param: 'Favoris', desc: 'Vos mouvements préférés enregistrés.', icon: '❤️', glow: 'rgba(255, 10, 94, 0.25)', color: 'var(--miami-pink)' }] 
            : OBJECTIVES
          ).map(obj => {
            const isSelected = selectedMuscle === obj.param;
            return (
              <div
                key={obj.param}
                onClick={() => setSelectedMuscle(obj.param)}
                className="hover-lift"
                style={{
                  background: isSelected ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.01)',
                  border: `1px solid ${isSelected ? obj.color : 'rgba(255, 255, 255, 0.06)'}`,
                  borderRadius: 14,
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected ? `0 0 15px ${obj.glow}` : 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.01)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.25rem' }}>{obj.icon}</span>
                  <span style={{ 
                    color: 'white', 
                    fontWeight: 700, 
                    fontSize: '0.95rem',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.03em'
                  }}>
                    {obj.name}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'rgba(245, 240, 255, 0.55)', lineHeight: 1.3 }}>
                  {obj.desc}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Exercises Grid Container */}
      <div className="card-glass" style={{ padding: '32px 24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 10, 
              background: 'rgba(255, 10, 94, 0.12)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--miami-pink)',
              boxShadow: '0 0 10px rgba(255, 10, 94, 0.2)'
            }}>
              <Dumbbell size={20} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 'normal', color: 'white', letterSpacing: '0.04em' }}>
              {selectedMuscle === 'Tous' ? 'Tous les mouvements' : selectedMuscle === 'Favoris' ? 'Mes Favoris' : `Mouvements ciblant : ${selectedMuscle}`}
            </h2>
          </div>
          <div className="badge badge-pink" style={{ letterSpacing: '0.05em' }}>
            {filteredExercises.length} Exercice(s) trouvé(s)
          </div>
        </div>

        {filteredExercises.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 16px', color: 'rgba(245, 240, 255, 0.4)' }}>
            <Info size={44} style={{ marginBottom: 16, opacity: 0.3, color: 'var(--miami-pink)' }} />
            <p style={{ fontSize: '1rem', fontWeight: 500 }}>Aucun exercice trouvé dans cette catégorie.</p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(245,240,255,0.4)', marginTop: 4 }}>Essayez de modifier vos filtres ou d'affiner votre recherche.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {filteredExercises.slice(0, visibleCount).map(ex => (
                <div
                  key={ex.id}
                  onClick={() => setActiveExercise(ex)}
                  className="hover-lift"
                  style={{
                    background: 'rgba(20, 19, 58, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: 16,
                    padding: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(255, 10, 94, 0.35)';
                    e.currentTarget.style.background = 'rgba(255, 10, 94, 0.02)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.background = 'rgba(20, 19, 58, 0.35)';
                  }}
                >
                  <div style={{ 
                    width: '100%', 
                    height: 140, 
                    borderRadius: 12, 
                    background: 'rgba(7, 6, 26, 0.5)', 
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    border: '1px solid rgba(255, 255, 255, 0.03)'
                  }}>
                    {ex.gif_url ? (
                      <img 
                        src={ex.gif_url} 
                        alt={ex.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <Dumbbell size={32} style={{ color: 'rgba(245, 240, 255, 0.15)' }} />
                    )}
                    
                    {/* Favorite Heart Button */}
                    <button
                      onClick={(e) => toggleFavorite(ex.id, e)}
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 10,
                        background: 'rgba(7, 6, 26, 0.75)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: favorites.includes(ex.id) ? 'var(--miami-pink)' : 'rgba(245, 240, 255, 0.7)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: favorites.includes(ex.id) ? '0 0 10px rgba(255, 10, 94, 0.4)' : 'none'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.color = 'var(--miami-pink)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.color = favorites.includes(ex.id) ? 'var(--miami-pink)' : 'rgba(245, 240, 255, 0.7)';
                      }}
                    >
                      <Heart 
                        size={16} 
                        style={{ 
                          fill: favorites.includes(ex.id) ? 'var(--miami-pink)' : 'none',
                          transition: 'fill 0.2s ease'
                        }} 
                      />
                    </button>

                    {/* Play Overlay */}
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
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--miami-pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 15px var(--miami-pink)' }}>
                        <Play size={18} style={{ fill: 'currentColor', marginLeft: 2 }} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ 
                      color: 'white', 
                      fontSize: '1rem', 
                      fontWeight: 700, 
                      marginBottom: 8,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '2.6em',
                      lineHeight: 1.3
                    }}>
                      {ex.name}
                    </h4>
                    {ex.muscle_group && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {getMainMuscles(ex.muscle_group).map((m: string) => (
                          <span 
                            key={m}
                            className="badge" 
                            style={{ 
                              fontSize: '0.7rem', 
                              background: 'rgba(189, 0, 255, 0.12)', 
                              color: 'var(--miami-purple-light)', 
                              border: '1px solid rgba(189, 0, 255, 0.25)',
                              padding: '4px 8px'
                            }}
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {filteredExercises.length > visibleCount && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                <button 
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="btn-ghost"
                  style={{ 
                    padding: '14px 32px', 
                    fontSize: '0.9rem', 
                    color: 'var(--miami-pink)', 
                    borderColor: 'rgba(255, 10, 94, 0.35)',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(255, 45, 120, 0.15)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255, 10, 94, 0.08)';
                    e.currentTarget.style.borderColor = 'var(--miami-pink)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255, 10, 94, 0.35)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Voir plus de mouvements
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Exercise Details Modal Popup */}
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
              maxWidth: 580, 
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
                transition: 'all 0.2s',
                zIndex: 10
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,10,94,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
            >
              <X size={20} />
            </button>

            {/* Modal Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 10 }}>
              
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
                          fontSize: '0.75rem',
                          padding: '4px 10px'
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
                    lineHeight: 1.1, 
                    letterSpacing: '0.04em',
                    margin: 0,
                    flex: 1
                  }}>
                    {activeExercise.name}
                  </h3>
                  <button
                    onClick={(e) => toggleFavorite(activeExercise.id, e)}
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
                        fill: favorites.includes(activeExercise.id) ? 'var(--miami-pink)' : 'none',
                        transition: 'fill 0.2s'
                      }} 
                    />
                    {favorites.includes(activeExercise.id) ? 'Favori' : 'Ajouter aux favoris'}
                  </button>
                </div>
              </div>

              {/* Demo Animation Container */}
              <div style={{ 
                width: '100%', 
                height: 300, 
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
                  marginBottom: 12,
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
    </div>
  );
}
