'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Dumbbell, Play, X, Info, ArrowRight, Heart } from 'lucide-react';
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

interface Program {
  id: string;
  title: string;
  slug: string;
  description?: string;
  cover_url?: string;
}

interface HomeLibraryProps {
  programs: Program[];
  exercises: Exercise[];
  user?: any;
  initialFavorites?: string[];
}

const MAIN_CATEGORIES = ['Tous', 'Pectoraux', 'Dos', 'Épaules', 'Bras', 'Jambes', 'Abdominaux'];

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

export default function HomeLibrary({ programs, exercises, user, initialFavorites = [] }: HomeLibraryProps) {
  const supabase = createClient();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('Tous');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [favorites, setFavorites] = useState<string[]>(initialFavorites);
  const [visibleCount, setVisibleCount] = useState(8);

  // Sync search parameters from URL (e.g. ?muscle=Pectoraux)
  useEffect(() => {
    const muscleParam = searchParams.get('muscle');
    if (muscleParam) {
      const capitalized = muscleParam.charAt(0).toUpperCase() + muscleParam.slice(1).toLowerCase();
      let normalized = capitalized;
      if (normalized.startsWith('Pec')) normalized = 'Pectoraux';
      if (normalized.startsWith('Abdo')) normalized = 'Abdominaux';

      if (MAIN_CATEGORIES.includes(normalized)) {
        setSelectedMuscle(normalized);
      }
    } else {
      setSelectedMuscle('Tous');
    }
  }, [searchParams]);

  // Reset visible exercise count on filter change
  useEffect(() => {
    setVisibleCount(8);
  }, [selectedMuscle, searchTerm]);

  // Filters
  const matchesSearch = (text: string) => text.toLowerCase().includes(searchTerm.toLowerCase());

  const filteredPrograms = programs.filter(p => 
    matchesSearch(p.title) || (p.description && matchesSearch(p.description))
  );

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
      
      {/* Interactive Search Bar Container */}
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
            placeholder="Rechercher un exercice de musculation ou un programme d'entraînement..." 
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
            {` ${filteredPrograms.length} programme(s) et ${filteredExercises.length} exercice(s) trouvé(s).`}
          </div>
        )}
      </div>

      {/* Grid of Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, alignItems: 'start' }}>
        
        {/* Left Column: Public Programs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card-glass" style={{ padding: '32px 24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 10, 
                background: 'rgba(0, 245, 255, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'var(--miami-cyan)',
                boxShadow: '0 0 10px rgba(0, 245, 255, 0.2)'
              }}>
                <Dumbbell size={20} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 'normal', color: 'white', letterSpacing: '0.04em' }}>
                {hasSearch ? 'Programmes correspondants' : 'Nos Programmes'}
              </h2>
            </div>

            {filteredPrograms.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: 'rgba(245, 240, 255, 0.4)' }}>
                <Dumbbell size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
                <p style={{ fontSize: '0.9rem' }}>Aucun programme correspondant</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {filteredPrograms.map(p => (
                  <Link 
                    key={p.id} 
                    href={`/programs/${p.slug}`} 
                    className="hover-lift"
                    style={{
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: 8,
                      padding: '20px',
                      background: 'rgba(0, 245, 255, 0.04)',
                      border: '1px solid rgba(0, 245, 255, 0.15)',
                      borderRadius: 14, 
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--miami-cyan)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0, 245, 255, 0.15)'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
                        {p.title}
                      </span>
                      <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Découvrir <ArrowRight size={10} style={{ marginLeft: 2 }} /></span>
                    </div>
                    {p.description && (
                      <p style={{ fontSize: '0.85rem', color: 'rgba(245, 240, 255, 0.6)', lineHeight: 1.5, margin: 0 }}>
                        {p.description.length > 90 ? `${p.description.slice(0, 90)}...` : p.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Public Exercises Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
                  <Play size={20} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 'normal', color: 'white', letterSpacing: '0.04em' }}>
                  Exercices Disponibles
                </h2>
              </div>
              <div className="badge badge-pink" style={{ letterSpacing: '0.05em' }}>
                {exercises.length} Mouvements
              </div>
            </div>

            {/* Muscle Group Tab Filters */}
            {!hasSearch && (
              <div 
                style={{ 
                  display: 'flex', 
                  gap: 8, 
                  overflowX: 'auto', 
                  paddingBottom: 12, 
                  marginBottom: 20,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                }}
                className="scrollbar-hide"
              >
                {(user ? [...MAIN_CATEGORIES, 'Favoris'] : MAIN_CATEGORIES).map(group => (
                  <button
                    key={group}
                    onClick={() => setSelectedMuscle(group)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 20,
                      background: selectedMuscle === group ? 'var(--miami-pink)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${selectedMuscle === group ? 'var(--miami-pink)' : 'rgba(255, 255, 255, 0.08)'}`,
                      color: selectedMuscle === group ? 'white' : 'rgba(245, 240, 255, 0.7)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    {group === 'Favoris' ? '❤️ Favoris' : group}
                  </button>
                ))}
              </div>
            )}

            {filteredExercises.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: 'rgba(245, 240, 255, 0.4)' }}>
                <Info size={36} style={{ marginBottom: 12, opacity: 0.3, color: 'var(--miami-pink)' }} />
                <p style={{ fontSize: '0.9rem' }}>Aucun exercice trouvé</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                  {filteredExercises.slice(0, visibleCount).map(ex => (
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
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'rgba(255, 10, 94, 0.25)';
                        e.currentTarget.style.background = 'rgba(255, 10, 94, 0.02)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
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
                          <img 
                            src={ex.gif_url} 
                            alt={ex.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        ) : (
                          <Dumbbell size={24} style={{ color: 'rgba(245, 240, 255, 0.2)' }} />
                        )}
                        
                        {/* Favorite Heart Button */}
                        <button
                          onClick={(e) => toggleFavorite(ex.id, e)}
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 10,
                            background: 'rgba(7, 6, 26, 0.65)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '50%',
                            width: 28,
                            height: 28,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: favorites.includes(ex.id) ? 'var(--miami-pink)' : 'rgba(245, 240, 255, 0.7)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: favorites.includes(ex.id) ? '0 0 8px rgba(255, 10, 94, 0.3)' : 'none'
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
                            size={14} 
                            style={{ 
                              fill: favorites.includes(ex.id) ? 'var(--miami-pink)' : 'none',
                              transition: 'fill 0.2s ease'
                            }} 
                          />
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
                        <h4 style={{ 
                          color: 'white', 
                          fontSize: '0.9rem', 
                          fontWeight: 700, 
                          marginBottom: 6,
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
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {getMainMuscles(ex.muscle_group).map((m: string) => (
                              <span 
                                key={m}
                                className="badge" 
                                style={{ 
                                  fontSize: '0.65rem', 
                                  background: 'rgba(189, 0, 255, 0.1)', 
                                  color: 'var(--miami-purple-light)', 
                                  border: '1px solid rgba(189, 0, 255, 0.2)' 
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
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                    <button 
                      onClick={() => setVisibleCount(prev => prev + 8)}
                      className="btn-ghost"
                      style={{ 
                        padding: '12px 28px', 
                        fontSize: '0.85rem', 
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
                      Voir plus d&#39;exercices
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

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
    </div>
  );
}
