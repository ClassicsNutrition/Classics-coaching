import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BookOpen, Dumbbell, Star, ArrowRight, Zap, Heart, ShoppingBag, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HomeLibrary from '@/components/HomeLibrary';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    isAdmin = profile?.role === 'admin';
  }

  // Fetch published programs
  const { data: dbPrograms } = await supabase
    .from('programs')
    .select('id, title, slug, description, cover_url')
    .eq('published', true);

  // Fetch all exercises
  const { data: dbExercises } = await supabase
    .from('exercises')
    .select('*')
    .order('name', { ascending: true });

  const programs = dbPrograms || [];
  const exercises = dbExercises || [];

  return (
    <div className="min-h-screen" style={{ background: 'var(--miami-night)', color: '#F5F0FF' }}>
      <Navbar user={user} isAdmin={isAdmin} />

      {/* Hero Section */}
      <section 
        className="miami-grid-bg" 
        style={{ 
          paddingTop: 160, 
          paddingBottom: 120, 
          position: 'relative', 
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255, 90, 146, 0.15) 0%, rgba(189, 0, 255, 0.08) 50%, var(--miami-night) 100%)'
        }}
      >
        {/* SVG Decorative Palm Trees in Hero */}
        <div style={{ position: 'absolute', bottom: -10, left: '-20px', width: 260, height: 'auto', opacity: 0.15, pointerEvents: 'none', transform: 'scaleX(-1)' }}>
          <svg viewBox="0 0 100 100" fill="currentColor" style={{ color: 'var(--miami-pink)' }}>
            <path d="M10,100 Q15,60 35,45 Q40,42 45,43 Q43,35 30,30 Q20,26 10,32 Q25,24 45,35 Q48,37 49,42 Q49,30 40,20 Q30,10 15,12 Q30,8 46,24 Q48,26 49,30 Q51,18 48,8 Q44,0 30,0 Q43,-2 52,12 Q53,14 53,18 Q57,10 65,4 Q75,-2 90,0 Q75,3 64,14 Q62,16 61,20 Q67,13 78,10 Q90,7 100,15 Q86,13 71,20 Q69,21 67,25 Q75,22 86,22 Q98,22 105,32 Q92,28 75,28 Q71,28 67,31 Q72,34 78,40 Q85,48 90,60 Q82,50 72,43 Q68,40 64,41 Q62,45 61,50 Q56,70 50,100 Z" />
          </svg>
        </div>
        <div style={{ position: 'absolute', bottom: -10, right: '-20px', width: 260, height: 'auto', opacity: 0.15, pointerEvents: 'none' }}>
          <svg viewBox="0 0 100 100" fill="currentColor" style={{ color: 'var(--miami-cyan)' }}>
            <path d="M10,100 Q15,60 35,45 Q40,42 45,43 Q43,35 30,30 Q20,26 10,32 Q25,24 45,35 Q48,37 49,42 Q49,30 40,20 Q30,10 15,12 Q30,8 46,24 Q48,26 49,30 Q51,18 48,8 Q44,0 30,0 Q43,-2 52,12 Q53,14 53,18 Q57,10 65,4 Q75,-2 90,0 Q75,3 64,14 Q62,16 61,20 Q67,13 78,10 Q90,7 100,15 Q86,13 71,20 Q69,21 67,25 Q75,22 86,22 Q98,22 105,32 Q92,28 75,28 Q71,28 67,31 Q72,34 78,40 Q85,48 90,60 Q82,50 72,43 Q68,40 64,41 Q62,45 61,50 Q56,70 50,100 Z" />
          </svg>
        </div>

        {/* Decorative Orbs */}
        <div style={{
          position: 'absolute', top: 80, right: '15%', width: 450, height: 450,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,10,94,0.18) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 80, left: '10%', width: 350, height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,245,255,0.15) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="badge badge-pink animate-fadeInUp" style={{ marginBottom: 24, display: 'inline-flex', letterSpacing: '0.1em' }}>
            <Zap size={12} /> COACHING PREMIUM
          </div>

          <h1 className="animate-fadeInUp animate-delay-100" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
            fontWeight: 'normal',
            lineHeight: 0.95,
            letterSpacing: '0.04em',
            marginBottom: 24,
            textShadow: '0 0 30px rgba(255,10,94,0.3)',
          }}>
            <span style={{ color: 'white' }}>Transformez votre</span>{' '}
            <br />
            <span className="gradient-miami-text" style={{ filter: 'drop-shadow(0 0 15px rgba(189,0,255,0.2))' }}>corps & votre esprit</span>
          </h1>

          <p className="animate-fadeInUp animate-delay-200" style={{
            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            color: 'rgba(245,240,255,0.7)',
            maxWidth: 650,
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            La plateforme de bien-être de <strong style={{ color: 'var(--miami-cyan)', textShadow: '0 0 10px rgba(0,245,255,0.3)' }}>Smain Chebab</strong>, fondateur de Classics Nutrition. Programmes personnalisés, e-books experts et compléments alimentaires professionnels.
          </p>

          <div className="animate-fadeInUp animate-delay-300" style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/ebooks" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px', letterSpacing: '0.05em' }}>
              <BookOpen size={18} /> Découvrir les E-books
            </Link>
            <a href="https://classicsnutrition.com" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 32px', letterSpacing: '0.05em' }}>
              <ShoppingBag size={18} /> Boutique Nutrition
            </a>
          </div>

          {/* Stats Section with Neon Cards */}
          <div className="animate-fadeInUp animate-delay-400" style={{
            display: 'flex', justifyContent: 'center', gap: 32, marginTop: 80,
            flexWrap: 'wrap',
          }}>
            {[
              { value: '500+', label: 'Clients accompagnés', icon: '🏆', border: 'rgba(255,10,94,0.3)', glow: 'rgba(255,10,94,0.12)' },
              { value: '20+', label: 'Programmes créés', icon: '💪', border: 'rgba(189,0,255,0.3)', glow: 'rgba(189,0,255,0.12)' },
              { value: '98%', label: 'Taux de satisfaction', icon: '🔥', border: 'rgba(0,245,255,0.3)', glow: 'rgba(0,245,255,0.12)' },
            ].map((stat) => (
              <div 
                key={stat.label} 
                className="hover-lift"
                style={{ 
                  textAlign: 'center',
                  background: 'rgba(20, 19, 58, 0.45)',
                  border: `1px solid ${stat.border}`,
                  boxShadow: `0 8px 32px rgba(7, 6, 26, 0.5), 0 0 20px ${stat.glow}`,
                  borderRadius: 16,
                  padding: '24px 40px',
                  minWidth: 240,
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Neon Top Border Accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, transparent, ${stat.border.replace('0.3', '1')}, transparent)` }} />
                
                <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{stat.icon}</div>
                <div style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '3.5rem', 
                  fontWeight: 'normal', 
                  color: 'white', 
                  lineHeight: 1,
                  letterSpacing: '0.04em'
                }} className="gradient-miami-text">
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(226,232,240,0.6)', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '100px 24px', maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge badge-cyan" style={{ display: 'inline-flex', marginBottom: 16, letterSpacing: '0.1em' }}>L&#39;ÉCOSYSTÈME COMPLET</div>
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontWeight: 'normal', 
            letterSpacing: '0.05em',
            color: 'white',
            textShadow: '0 0 20px rgba(0,245,255,0.25)'
          }}>
            Tout ce dont vous avez besoin
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            {
              icon: <BookOpen size={28} />,
              title: 'E-books Experts',
              desc: 'Des guides numériques interactifs créés par Smain Chebab, couvrant nutrition, musculation et bien-être.',
              color: 'var(--miami-pink)',
              href: '/ebooks',
            },
            {
              icon: <Dumbbell size={28} />,
              title: 'Programmes Sportifs',
              desc: 'Des plans d\'entraînement structurés et personnalisés selon vos objectifs et votre niveau.',
              color: 'var(--miami-cyan)',
              href: '/programs',
            },
            {
              icon: <ShoppingBag size={28} />,
              title: 'Compléments Alimentaires',
              desc: 'Retrouvez les meilleurs compléments recommandés directement sur classicsnutrition.com.',
              color: 'var(--miami-purple-light)',
              href: 'https://classicsnutrition.com',
            },
            {
              icon: <Heart size={28} />,
              title: 'Suivi Personnalisé',
              desc: 'Un espace client dédié pour accéder à vos programmes, suivre vos progrès et rester motivé.',
              color: '#facc15',
              href: user ? '/profile' : '/register',
            },
          ].map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="card-glass card-glass-hover"
              style={{ 
                padding: 32, 
                textDecoration: 'none', 
                display: 'block',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              {/* Colored top-left border decoration */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '40px',
                background: feature.color,
                borderRadius: '0 0 4px 0'
              }} />

              <div style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: `${feature.color}15`,
                border: `1px solid ${feature.color}35`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: feature.color,
                marginBottom: 20,
                boxShadow: `0 0 15px ${feature.color}15`
              }}>
                {feature.icon}
              </div>
              <h3 style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.8rem', 
                fontWeight: 'normal', 
                letterSpacing: '0.04em',
                color: 'white', 
                marginBottom: 12 
              }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(245,240,255,0.65)', lineHeight: 1.6, marginBottom: 20 }}>
                {feature.desc}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: feature.color, fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                En savoir plus <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Search & Library Section */}
      <section style={{ padding: '100px 24px', background: 'rgba(7, 6, 26, 0.4)', borderTop: '1px solid rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 54 }}>
            <div className="badge badge-cyan" style={{ display: 'inline-flex', marginBottom: 16, letterSpacing: '0.1em' }}>MOUVEMENTS & PLANS</div>
            <h2 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
              fontWeight: 'normal', 
              letterSpacing: '0.05em',
              color: 'white',
              textShadow: '0 0 20px rgba(0,245,255,0.25)'
            }}>
              Rechercher un Exercice ou Programme
            </h2>
          </div>
          <HomeLibrary programs={programs} exercises={exercises} />
        </div>
      </section>

      {/* About / CTA Section */}
      <section style={{ padding: '80px 24px', position: 'relative' }}>
        <div className="container-responsive" style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div 
            className="card-glass" 
            style={{ 
              padding: '60px 40px', 
              position: 'relative', 
              overflow: 'hidden',
              border: '1px solid rgba(255, 10, 94, 0.25)',
              background: 'linear-gradient(135deg, rgba(20,19,58,0.7) 0%, rgba(7,6,26,0.95) 100%)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(255,10,94,0.1)'
            }}
          >
            {/* Background Orbs */}
            <div style={{
              position: 'absolute', top: -100, right: -100, width: 450, height: 450,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(189,0,255,0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: -100, left: -100, width: 350, height: 350,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,245,255,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <div>
                <div className="badge badge-pink" style={{ marginBottom: 20, letterSpacing: '0.1em' }}>
                  <Star size={12} /> SMAIN CHEBAB
                </div>
                <h2 style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
                  fontWeight: 'normal', 
                  letterSpacing: '0.04em',
                  color: 'white', 
                  marginBottom: 20, 
                  lineHeight: 1.05 
                }}>
                  Fondateur & CEO de{' '}
                  <span className="gradient-miami-text" style={{ filter: 'drop-shadow(0 0 10px rgba(255,10,94,0.3))' }}>Classics Nutrition</span>
                </h2>
                <p style={{ color: 'rgba(245,240,255,0.7)', lineHeight: 1.8, marginBottom: 32, fontSize: '1.05rem' }}>
                  Expert en nutrition sportive et coaching bien-être, Smain Chebab partage son expertise à travers une plateforme complète alliant conseils personnalisés, programmes structurés et compléments alimentaires de qualité professionnelle.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link href={user ? '/profile' : '/register'} className="btn-primary" style={{ letterSpacing: '0.05em' }}>
                    {user ? 'Mon Espace Client' : 'Commencer Gratuitement'} <ChevronRight size={16} />
                  </Link>
                  <a href="https://classicsnutrition.com" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ letterSpacing: '0.05em' }}>
                    Visiter la Boutique
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: '🏆', title: 'Expert certifié', desc: 'Nutrition sportive & coaching bien-être', border: 'rgba(255,10,94,0.25)' },
                  { icon: '💪', title: 'Classics Nutrition', desc: 'Fondateur d\'une marque de compléments premium', border: 'rgba(189,0,255,0.25)' },
                  { icon: '🎯', title: 'Approche sur-mesure', desc: 'Programmes adaptés à chaque profil', border: 'rgba(0,245,255,0.25)' },
                ].map((item) => (
                  <div key={item.title} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 16,
                    background: 'rgba(20,19,58,0.5)',
                    border: `1px solid ${item.border}`,
                    borderRadius: 14, 
                    padding: '20px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    transition: 'border-color 0.3s ease',
                  }}
                  className="hover-lift"
                  >
                    <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
                    <div>
                      <div style={{ 
                        fontWeight: 'normal', 
                        color: 'white', 
                        marginBottom: 4, 
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.3rem',
                        letterSpacing: '0.04em'
                      }}>{item.title}</div>
                      <div style={{ fontSize: '0.9rem', color: 'rgba(245,240,255,0.6)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Link Banner */}
      <section style={{ padding: '40px 24px 80px' }}>
        <div className="container-responsive" style={{ maxWidth: 1280, margin: '0 auto' }}>
          <a href="https://classicsnutrition.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div className="gradient-miami hover-lift" style={{
              borderRadius: 20, 
              padding: '40px 32px',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              textAlign: 'left',
              gap: 24,
              boxShadow: '0 20px 60px rgba(255,10,94,0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            >
              {/* Shiny effect overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 100%)',
                transform: 'skewX(-25deg)',
              }} />

              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>
                  PARTENAIRE OFFICIEL
                </div>
                <h3 style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '2.5rem', 
                  fontWeight: 'normal', 
                  letterSpacing: '0.04em',
                  color: 'white', 
                  marginBottom: 8 
                }}>
                  Classicsnutrition.com
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem' }}>
                  Compléments alimentaires professionnels recommandés par Smain Chebab
                </p>
              </div>
              <div className="btn-ghost" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <ShoppingBag size={16} /> Voir la boutique <ArrowRight size={16} />
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--miami-border)',
        padding: '60px 24px',
        textAlign: 'center',
        color: 'rgba(245,240,255,0.4)',
        fontSize: '0.9rem',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, var(--miami-night) 0%, #040310 100%)'
      }}>
        {/* Palm tree SVG silhouettes left/right in footer */}
        <div style={{ position: 'absolute', bottom: -20, left: 10, width: 140, height: 'auto', opacity: 0.08, pointerEvents: 'none', transform: 'scaleX(-1)' }}>
          <svg viewBox="0 0 100 100" fill="currentColor" style={{ color: 'var(--miami-pink)' }}>
            <path d="M10,100 Q15,60 35,45 Q40,42 45,43 Q43,35 30,30 Q20,26 10,32 Q25,24 45,35 Q48,37 49,42 Q49,30 40,20 Q30,10 15,12 Q30,8 46,24 Q48,26 49,30 Q51,18 48,8 Q44,0 30,0 Q43,-2 52,12 Q53,14 53,18 Q57,10 65,4 Q75,-2 90,0 Q75,3 64,14 Q62,16 61,20 Q67,13 78,10 Q90,7 100,15 Q86,13 71,20 Q69,21 67,25 Q75,22 86,22 Q98,22 105,32 Q92,28 75,28 Q71,28 67,31 Q72,34 78,40 Q85,48 90,60 Q82,50 72,43 Q68,40 64,41 Q62,45 61,50 Q56,70 50,100 Z" />
          </svg>
        </div>
        <div style={{ position: 'absolute', bottom: -20, right: 10, width: 140, height: 'auto', opacity: 0.08, pointerEvents: 'none' }}>
          <svg viewBox="0 0 100 100" fill="currentColor" style={{ color: 'var(--miami-cyan)' }}>
            <path d="M10,100 Q15,60 35,45 Q40,42 45,43 Q43,35 30,30 Q20,26 10,32 Q25,24 45,35 Q48,37 49,42 Q49,30 40,20 Q30,10 15,12 Q30,8 46,24 Q48,26 49,30 Q51,18 48,8 Q44,0 30,0 Q43,-2 52,12 Q53,14 53,18 Q57,10 65,4 Q75,-2 90,0 Q75,3 64,14 Q62,16 61,20 Q67,13 78,10 Q90,7 100,15 Q86,13 71,20 Q69,21 67,25 Q75,22 86,22 Q98,22 105,32 Q92,28 75,28 Q71,28 67,31 Q72,34 78,40 Q85,48 90,60 Q82,50 72,43 Q68,40 64,41 Q62,45 61,50 Q56,70 50,100 Z" />
          </svg>
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{ letterSpacing: '0.05em' }}>© 2024 Classics Coaching — Smain Chebab. Tous droits réservés.</p>
          <p style={{ marginTop: 12 }}>
            En partenariat avec{' '}
            <a 
              href="https://classicsnutrition.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="partner-link"
            >
              Classics Nutrition
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
