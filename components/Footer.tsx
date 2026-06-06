'use client';

import Link from 'next/link';
import { Dumbbell } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--miami-border)',
      padding: '70px 24px 40px',
      color: 'rgba(245,240,255,0.5)',
      fontSize: '0.9rem',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, var(--miami-night) 0%, #040310 100%)'
    }}>
      {/* Palm tree SVG silhouettes left/right in footer */}
      <div style={{ position: 'absolute', bottom: -20, left: 10, width: 140, height: 'auto', opacity: 0.04, pointerEvents: 'none', transform: 'scaleX(-1)' }}>
        <svg viewBox="0 0 100 100" fill="currentColor" style={{ color: 'var(--miami-pink)' }}>
          <path d="M10,100 Q15,60 35,45 Q40,42 45,43 Q43,35 30,30 Q20,26 10,32 Q25,24 45,35 Q48,37 49,42 Q49,30 40,20 Q30,10 15,12 Q30,8 46,24 Q48,26 49,30 Q51,18 48,8 Q44,0 30,0 Q43,-2 52,12 Q53,14 53,18 Q57,10 65,4 Q75,-2 90,0 Q75,3 64,14 Q62,16 61,20 Q67,13 78,10 Q90,7 100,15 Q86,13 71,20 Q69,21 67,25 Q75,22 86,22 Q98,22 105,32 Q92,28 75,28 Q71,28 67,31 Q72,34 78,40 Q85,48 90,60 Q82,50 72,43 Q68,40 64,41 Q62,45 61,50 Q56,70 50,100 Z" />
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: -20, right: 10, width: 140, height: 'auto', opacity: 0.04, pointerEvents: 'none' }}>
        <svg viewBox="0 0 100 100" fill="currentColor" style={{ color: 'var(--miami-cyan)' }}>
          <path d="M10,100 Q15,60 35,45 Q40,42 45,43 Q43,35 30,30 Q20,26 10,32 Q25,24 45,35 Q48,37 49,42 Q49,30 40,20 Q30,10 15,12 Q30,8 46,24 Q48,26 49,30 Q51,18 48,8 Q44,0 30,0 Q43,-2 52,12 Q53,14 53,18 Q57,10 65,4 Q75,-2 90,0 Q75,3 64,14 Q62,16 61,20 Q67,13 78,10 Q90,7 100,15 Q86,13 71,20 Q69,21 67,25 Q75,22 86,22 Q98,22 105,32 Q92,28 75,28 Q71,28 67,31 Q72,34 78,40 Q85,48 90,60 Q82,50 72,43 Q68,40 64,41 Q62,45 61,50 Q56,70 50,100 Z" />
        </svg>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 40,
          textAlign: 'left',
          marginBottom: 40
        }}>
          {/* Brand block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, width: 'fit-content' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--miami-pink) 0%, var(--miami-purple-light) 100%)',
                width: 36,
                height: 36,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(255, 10, 94, 0.4)'
              }}>
                <Dumbbell size={18} style={{ color: 'white' }} />
              </div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                letterSpacing: '0.05em',
                color: 'white'
              }}>
                CLASSICS COACHING
              </span>
            </Link>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.6, color: 'rgba(245, 240, 255, 0.6)' }}>
              Accompagnement sportif haut de gamme et nutrition de précision par Smain Chebab, fondateur de Classics Nutrition.
            </p>
          </div>

          {/* Navigation block */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', marginBottom: 20, letterSpacing: '0.04em' }}>NAVIGATION</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><Link href="/" className="footer-link">Accueil</Link></li>
              <li><Link href="/programs" className="footer-link">Programmes Sportifs</Link></li>
              <li><Link href="/alimentation" className="footer-link">Nutrition & Alimentation</Link></li>
              <li><Link href="/shop" className="footer-link">Boutique Compléments</Link></li>
              <li><Link href="/ebooks" className="footer-link">E-books Experts</Link></li>
            </ul>
          </div>

          {/* Legal / GDPR block */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', marginBottom: 20, letterSpacing: '0.04em' }}>INFORMATIONS LÉGALES</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li><Link href="/mentions-legales" className="footer-link">Mentions Légales</Link></li>
              <li><Link href="/cgv" className="footer-link">Conditions Générales de Vente (CGV)</Link></li>
              <li><Link href="/privacy" className="footer-link">Politique de Confidentialité</Link></li>
              <li><Link href="/cookies" className="footer-link">Gestion des Cookies (RGPD)</Link></li>
            </ul>
          </div>

          {/* Contacts / Partners block */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', marginBottom: 20, letterSpacing: '0.04em' }}>CONTACT</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.85rem' }}>
              <li style={{ color: 'rgba(245, 240, 255, 0.7)' }}>Email : contact@classicsnutrition.com</li>
              <li style={{ color: 'rgba(245, 240, 255, 0.7)' }}>Support : 7j/7 via l'espace client</li>
              <li style={{ marginTop: 8 }}>
                <a href="https://classicsnutrition.com" target="_blank" rel="noopener noreferrer" className="partner-link">
                  Classics Nutrition →
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and legal disclaimer */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: 30,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20,
          fontSize: '0.8rem',
          color: 'rgba(245, 240, 255, 0.4)'
        }}>
          <span>
            © {new Date().getFullYear()} Classics Coaching. Conçu par <strong>Smain Chebab</strong> (CEO de Classics Nutrition) & développé par <strong>Messaoudi Youssef</strong> (Ingénieur Informatique, LRN CORP). Tous droits réservés.
          </span>
          <span style={{ display: 'flex', gap: 16 }}>
            <span>Hébergement : Vercel Inc.</span>
            <span>RGPD : Conforme CNIL</span>
          </span>
        </div>
      </div>

      <style>{`
        .footer-link {
          color: rgba(245, 240, 255, 0.6);
          text-decoration: none;
          transition: all 0.2s ease;
          font-size: 0.85rem;
        }
        .footer-link:hover {
          color: var(--miami-cyan);
          text-shadow: 0 0 8px rgba(0, 245, 255, 0.5);
          padding-left: 4px;
        }
        .partner-link {
          color: var(--miami-pink);
          text-shadow: 0 0 6px rgba(255, 10, 94, 0.3);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .partner-link:hover {
          color: white;
          text-shadow: 0 0 8px var(--miami-pink);
        }
      `}</style>
    </footer>
  );
}
