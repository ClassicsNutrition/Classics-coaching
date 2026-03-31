import Link from 'next/link';
export const revalidate = 0;
import { createClient } from '@/lib/supabase/server';
import { BookOpen, Dumbbell, Star, ArrowRight, Zap, Heart, ShoppingBag, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  isAdmin = profile?.role === 'admin' || user.app_metadata?.role === 'admin';
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--miami-night)' }}>
      <Navbar user={user} isAdmin={isAdmin} />

      {/* Hero Section */}
      <section className="miami-grid-bg" style={{ paddingTop: 160, paddingBottom: 120, position: 'relative', overflow: 'hidden' }}>
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', top: 80, right: '15%', width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,45,120,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 80, left: '10%', width: 300, height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,245,255,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="badge badge-pink animate-fadeInUp" style={{ marginBottom: 24, display: 'inline-flex' }}>
            <Zap size={12} /> COACHING PREMIUM
          </div>

          <h1 className="animate-fadeInUp animate-delay-100" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 24,
          }}>
            <span style={{ color: 'white' }}>Transformez votre</span>{' '}
            <br />
            <span className="gradient-miami-text">corps & votre esprit</span>
          </h1>

          <p className="animate-fadeInUp animate-delay-200" style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(226,232,240,0.7)',
            maxWidth: 600,
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}>
            La plateforme de bien-être de <strong style={{ color: 'var(--miami-cyan)' }}>Smain Chebab</strong>, fondateur de Classics Nutrition. Programmes personnalisés, e-books experts et compléments alimentaires professionnels.
          </p>

          <div className="animate-fadeInUp animate-delay-300" style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link href="/ebooks" className="btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              <BookOpen size={18} /> Découvrir les E-books
            </Link>
            <a href="https://classicsnutrition.com" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
              <ShoppingBag size={18} /> Boutique Nutrition
            </a>
          </div>

          {/* Stats */}
          <div className="animate-fadeInUp animate-delay-400" style={{
            display: 'flex', justifyContent: 'center', gap: 48, marginTop: 80,
            flexWrap: 'wrap',
          }}>
            {[
              { value: '500+', label: 'Clients accompagnés' },
              { value: '20+', label: 'Programmes créés' },
              { value: '98%', label: 'Taux de satisfaction' },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'white', lineHeight: 1 }} className="gradient-miami-text">{stat.value}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(226,232,240,0.5)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 24px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge badge-cyan" style={{ display: 'inline-flex', marginBottom: 16 }}>L&#39;ÉCOSYSTÈME COMPLET</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, color: 'white' }}>
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
              style={{ padding: 32, textDecoration: 'none', display: 'block' }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: `${feature.color}20`,
                border: `1px solid ${feature.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: feature.color, marginBottom: 20,
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: 12 }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(226,232,240,0.6)', lineHeight: 1.6, marginBottom: 20 }}>
                {feature.desc}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: feature.color, fontSize: '0.85rem', fontWeight: 600 }}>
                En savoir plus <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About / CTA Section */}
      <section style={{ padding: '60px 0' }}>
        <div className="container-responsive" style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="card-glass" style={{ padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: -100, right: -100, width: 400, height: 400,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(123,47,190,0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48, alignItems: 'center', position: 'relative', zIndex: 1 }}>
              <div>
                <div className="badge badge-pink" style={{ marginBottom: 20 }}>
                  <Star size={12} /> SMAIN CHEBAB
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: 20, lineHeight: 1.2 }}>
                  Fondateur & CEO de{' '}
                  <span className="gradient-miami-text">Classics Nutrition</span>
                </h2>
                <p style={{ color: 'rgba(226,232,240,0.65)', lineHeight: 1.8, marginBottom: 32, fontSize: '1rem' }}>
                  Expert en nutrition sportive et coaching bien-être, Smain Chebab partage son expertise à travers une plateforme complète alliant conseils personnalisés, programmes structurés et compléments alimentaires de qualité professionnelle.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link href={user ? '/profile' : '/register'} className="btn-primary">
                    {user ? 'Mon Espace Client' : 'Commencer Gratuitement'} <ChevronRight size={16} />
                  </Link>
                  <a href="https://classicsnutrition.com" target="_blank" rel="noopener noreferrer" className="btn-ghost">
                    Visiter la Boutique
                  </a>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { icon: '🏆', title: 'Expert certifié', desc: 'Nutrition sportive & coaching bien-être' },
                  { icon: '💪', title: 'Classics Nutrition', desc: 'Fondateur d\'une marque de compléments premium' },
                  { icon: '🎯', title: 'Approche sur-mesure', desc: 'Programmes adaptés à chaque profil' },
                ].map((item) => (
                  <div key={item.title} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 16,
                    background: 'rgba(255,45,120,0.05)',
                    border: '1px solid rgba(255,45,120,0.1)',
                    borderRadius: 12, padding: '16px 20px',
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: 'white', marginBottom: 4, fontFamily: 'var(--font-display)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'rgba(226,232,240,0.55)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 60px' }}>
        <div className="container-responsive" style={{ maxWidth: 1280, margin: '0 auto' }}>
          <a href="https://classicsnutrition.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div className="gradient-miami hover-lift" style={{
              borderRadius: 20, padding: '32px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', textAlign: 'center',
              gap: 24,
              boxShadow: '0 20px 60px rgba(255,45,120,0.3)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            >
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
                  PARTENAIRE OFFICIEL
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: 8 }}>
                  Classicsnutrition.com
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem' }}>
                  Compléments alimentaires professionnels recommandés par Smain Chebab
                </p>
              </div>
              <div className="btn-ghost" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
                <ShoppingBag size={16} /> Voir la boutique <ArrowRight size={16} />
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,45,120,0.1)',
        padding: '40px 24px',
        textAlign: 'center',
        color: 'rgba(226,232,240,0.4)',
        fontSize: '0.85rem',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p>© 2024 Classics Coaching — Smain Chebab. Tous droits réservés.</p>
          <p style={{ marginTop: 8 }}>
            En partenariat avec{' '}
            <a href="https://classicsnutrition.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--miami-pink)', textDecoration: 'none' }}>
              Classics Nutrition
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
