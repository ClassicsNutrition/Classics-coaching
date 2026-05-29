'use client';

import { useState } from 'react';
import { ShoppingBag, Mail, CheckCircle2, Star, Sparkles, Zap, Flame, ShieldAlert, Award } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  category: 'Protéines' | 'Force & Performance' | 'Santé & Vitalité' | 'Sèche & Minceur';
  emoji: string;
  description: string;
  price: number;
  highlight: string;
  rating: number;
  reviews: number;
}

const SUPPLEMENT_PRODUCTS: ProductItem[] = [
  {
    id: 'whey-isolate',
    name: '100% Whey Isolate Native',
    category: 'Protéines',
    emoji: '🥛',
    description: 'Isolate de lactosérum natif non dénaturé de pureté maximale. Absorption ultra-rapide pour une synthèse protéique et une récupération musculaire optimales.',
    price: 39.90,
    highlight: '90% Protéine | Sans lactose',
    rating: 4.9,
    reviews: 142
  },
  {
    id: 'creatine-pure',
    name: 'Pure Créatine Monohydrate',
    category: 'Force & Performance',
    emoji: '⚡',
    description: 'Créatine monohydrate micronisée haut de gamme (Creapure®). Augmente la force explosive, le volume musculaire et la vitesse de récupération entre les séries.',
    price: 24.90,
    highlight: '100% Creapure® | Pureté 99.9%',
    rating: 4.8,
    reviews: 98
  },
  {
    id: 'pre-workout-storm',
    name: 'Pre-Workout Storm (Booster)',
    category: 'Force & Performance',
    emoji: '🔥',
    description: 'Formule explosive enrichie en L-Citrulline, Bêta-Alanine, Caféine et Tyrosine. Procure une congestion massive, une énergie débordante et un focus laser.',
    price: 34.90,
    highlight: 'Congestion & Focus | Zéro crash',
    rating: 4.7,
    reviews: 115
  },
  {
    id: 'omega-3-ultra',
    name: 'Ultra Oméga-3 (Haute concentration)',
    category: 'Santé & Vitalité',
    emoji: '🐟',
    description: 'Huile de poisson sauvage concentrée en EPA et DHA sous forme triglycéride. Anti-inflammatoire puissant pour protéger le cœur, le cerveau et les articulations.',
    price: 19.90,
    highlight: '800mg EPA / 400mg DHA',
    rating: 4.9,
    reviews: 76
  },
  {
    id: 'fat-burner-shred',
    name: 'Brûleur de Graisses - Shred Pro',
    category: 'Sèche & Minceur',
    emoji: '🌶️',
    description: 'Complexe thermogénique à base de thé vert, carnitine, piment de cayenne et chrome. Accélère la combustion des graisses tenaces et contrôle l\'appétit.',
    price: 29.90,
    highlight: 'Thermogenèse | Coupe-faim naturel',
    rating: 4.6,
    reviews: 84
  },
  {
    id: 'multi-vitamins',
    name: 'Multi-Vitamines Athlète Co-enzymé',
    category: 'Santé & Vitalité',
    emoji: '💊',
    description: 'Spectre complet de 24 vitamines et minéraux biodisponibles enrichi en antioxydants. Comble les carences alimentaires et optimise le métabolisme énergétique.',
    price: 18.90,
    highlight: 'Vitamines bio-actives | Sans fer',
    rating: 4.8,
    reviews: 121
  }
];

interface ShopLibraryProps {
  user: any;
  isAdmin?: boolean;
}

export default function ShopLibrary({ user, isAdmin }: ShopLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Veuillez entrer une adresse e-mail valide.');
      return;
    }
    setErrorMsg('');
    setSubscribed(true);
  };

  const categories = [
    { name: 'Tous', param: 'Tous', icon: '🛍️' },
    { name: 'Protéines', param: 'Protéines', icon: '🥛' },
    { name: 'Force & Performance', param: 'Force & Performance', icon: '⚡' },
    { name: 'Santé & Vitalité', param: 'Santé & Vitalité', icon: '🌿' },
    { name: 'Sèche & Minceur', param: 'Sèche & Minceur', icon: '🔥' }
  ];

  const filteredProducts = selectedCategory === 'Tous' 
    ? SUPPLEMENT_PRODUCTS 
    : SUPPLEMENT_PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48, width: '100%' }}>
      
      {/* Interactive Coming Soon Banner & Newsletter Form */}
      <div 
        className="card-glass"
        style={{ 
          padding: '40px 32px',
          border: '1px solid rgba(255, 10, 94, 0.3)',
          boxShadow: '0 12px 40px rgba(7, 6, 26, 0.6), 0 0 30px rgba(255, 10, 94, 0.15)',
          borderRadius: 24,
          background: 'radial-gradient(circle at 100% 0%, rgba(255, 10, 94, 0.1) 0%, rgba(7, 6, 26, 0.5) 100%)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glow Accent */}
        <div style={{
          position: 'absolute', top: -50, right: -50, width: 250, height: 250,
          background: 'radial-gradient(circle, rgba(255, 10, 94, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 650, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="badge badge-pink animate-pulse" style={{ display: 'inline-flex', alignSelf: 'center', gap: 6, letterSpacing: '0.1em' }}>
            <Sparkles size={12} /> PROCHAINEMENT DISPONIBLE
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'white', letterSpacing: '0.04em', margin: 0 }}>
            Boutique Classics Nutrition
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(245, 240, 255, 0.75)', lineHeight: 1.6, margin: 0 }}>
            Découvrez bientôt notre propre gamme de compléments alimentaires haut de gamme développée avec Smain Chebab. Conçus avec les meilleurs ingrédients brevetés pour des résultats optimaux.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--miami-cyan)', fontWeight: 600, margin: 0 }}>
                Inscrivez-vous pour être notifié au lancement et profitez de -15% sur votre première commande !
              </p>
              
              <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 500, margin: '0 auto', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
                  <Mail 
                    size={18} 
                    style={{ 
                      position: 'absolute', 
                      left: 16, 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: 'rgba(245, 240, 255, 0.4)' 
                    }} 
                  />
                  <input 
                    type="email"
                    className="input-miami" 
                    placeholder="Votre adresse e-mail" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{ 
                      paddingLeft: 46, 
                      width: '100%', 
                      height: 48, 
                      fontSize: '0.95rem',
                      borderRadius: 12,
                      borderColor: 'rgba(255, 10, 94, 0.25)'
                    }}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ 
                    height: 48, 
                    padding: '0 24px', 
                    fontSize: '0.9rem', 
                    borderRadius: 12, 
                    letterSpacing: '0.04em',
                    boxShadow: '0 0 15px rgba(255, 10, 94, 0.4)',
                    cursor: 'pointer'
                  }}
                >
                  M&#39;inscrire au lancement
                </button>
              </div>
              {errorMsg && (
                <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 500 }}>
                  {errorMsg}
                </span>
              )}
            </form>
          ) : (
            <div 
              className="animate-fadeInUp"
              style={{ 
                marginTop: 16,
                background: 'rgba(0, 245, 255, 0.05)',
                border: '1px solid rgba(0, 245, 255, 0.25)',
                padding: '20px 24px',
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 0 20px rgba(0, 245, 255, 0.1)'
              }}
            >
              <CheckCircle2 size={32} style={{ color: 'var(--miami-cyan)' }} />
              <h4 style={{ color: 'white', fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>
                Inscription confirmée !
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'rgba(245, 240, 255, 0.75)', margin: 0 }}>
                Merci de votre intérêt. Votre code de réduction exclusif de **-15%** à l&#39;ouverture est :
              </p>
              <div style={{
                background: 'rgba(7, 6, 26, 0.6)',
                border: '1px dotted var(--miami-cyan)',
                padding: '8px 24px',
                borderRadius: 8,
                fontFamily: 'monospace',
                fontSize: '1.2rem',
                color: 'var(--miami-cyan)',
                letterSpacing: '0.1em',
                fontWeight: 700,
                marginTop: 4
              }}>
                CLASSICS15
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category selector row */}
      <div 
        className="card-glass"
        style={{ 
          padding: '24px 32px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: 20
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <ShoppingBag size={20} style={{ color: 'var(--miami-cyan)' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'white', letterSpacing: '0.04em', margin: 0 }}>
            Notre catalogue futur
          </h3>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.param;
            return (
              <button
                key={cat.param}
                onClick={() => setSelectedCategory(cat.param)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: `1px solid ${isSelected ? 'var(--miami-cyan)' : 'rgba(255, 255, 255, 0.08)'}`,
                  background: isSelected ? 'rgba(0, 245, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                  color: isSelected ? 'white' : 'rgba(245, 240, 255, 0.7)',
                  boxShadow: isSelected ? '0 0 10px rgba(0, 245, 255, 0.2)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: '1rem' }}>{cat.icon}</span> {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Supplement grid items with "Soon" overlays */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 24 }}>
        {filteredProducts.map(product => (
          <div
            key={product.id}
            style={{
              background: 'rgba(20, 19, 58, 0.35)',
              border: '1px solid rgba(255, 10, 94, 0.1)',
              borderRadius: 20,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* Top Corner "Soon" Tag */}
            <div style={{
              position: 'absolute',
              top: 14,
              right: 14,
              background: 'rgba(255, 10, 94, 0.12)',
              border: '1px solid rgba(255, 10, 94, 0.3)',
              color: 'var(--miami-pink)',
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              boxShadow: '0 0 8px rgba(255, 10, 94, 0.2)'
            }}>
              Arrive bientôt
            </div>

            {/* Product visual mock header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: 14,
                background: 'rgba(7, 6, 26, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.2rem',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                {product.emoji}
              </div>
              <div>
                <span style={{ 
                  fontSize: '0.7rem', 
                  background: 'rgba(0, 245, 255, 0.1)', 
                  border: '1px solid rgba(0, 245, 255, 0.15)',
                  color: 'var(--miami-cyan)',
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontWeight: 600
                }}>
                  {product.category}
                </span>
                <h4 style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', margin: '6px 0 0 0', fontFamily: 'var(--font-body)' }}>
                  {product.name}
                </h4>
              </div>
            </div>

            {/* Micro Details/Highlight */}
            <div style={{ 
              fontSize: '0.75rem', 
              color: 'white', 
              background: 'rgba(255,255,255,0.03)',
              padding: '6px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.04)',
              fontWeight: 600
            }}>
              🔑 {product.highlight}
            </div>

            <p style={{ fontSize: '0.85rem', color: 'rgba(245, 240, 255, 0.65)', lineHeight: 1.5, margin: 0, flex: 1 }}>
              {product.description}
            </p>

            {/* Rating Stars Mock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'rgba(245, 240, 255, 0.5)' }}>
              <div style={{ display: 'flex', color: '#facc15' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
              </div>
              <strong style={{ color: 'white' }}>{product.rating}</strong>
              <span>({product.reviews} avis)</span>
            </div>

            {/* Pricing and Action button */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: 16,
              marginTop: 4
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'rgba(245, 240, 255, 0.4)', textDecoration: 'line-through', marginRight: 6 }}>
                  {(product.price * 1.2).toFixed(2)} €
                </span>
                <strong style={{ fontSize: '1.25rem', color: 'white' }}>
                  {product.price.toFixed(2)} €
                </strong>
              </div>

              <button
                disabled
                style={{
                  padding: '10px 16px',
                  borderRadius: 10,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: 'transparent',
                  border: '1px dashed rgba(255, 10, 94, 0.4)',
                  color: 'var(--miami-pink-light)',
                  cursor: 'not-allowed',
                  letterSpacing: '0.02em'
                }}
              >
                Indisponible
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Premium Quality Quality Assurances */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: 20, 
          marginTop: 16,
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: 32
        }}
      >
        {[
          { icon: <Award size={24} style={{ color: 'var(--miami-cyan)' }} />, title: 'Qualité Pharmaceutique', desc: 'Matières premières certifiées de pureté maximale.' },
          { icon: <Zap size={24} style={{ color: 'var(--miami-pink)' }} />, title: 'Formulations Scientifiques', desc: 'Dosages cliniquement efficaces, sans ingrédients superflus.' },
          { icon: <Flame size={24} style={{ color: '#facc15' }} />, title: '100% Transparent', desc: 'Étiquetage précis et analyses de lots publiques.' }
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, 
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              {item.icon}
            </div>
            <div>
              <h5 style={{ color: 'white', fontSize: '0.9rem', fontWeight: 700, margin: '0 0 4px 0' }}>
                {item.title}
              </h5>
              <p style={{ color: 'rgba(245, 240, 255, 0.55)', fontSize: '0.78rem', lineHeight: 1.4, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
