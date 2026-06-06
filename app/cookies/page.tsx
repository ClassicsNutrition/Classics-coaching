import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ChevronLeft, Cookie } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function CookiePolicyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    isAdmin = profile?.role === 'admin';
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--miami-night)', color: '#F5F0FF', display: 'flex', flexDirection: 'column' }}>
      <Navbar user={user} isAdmin={isAdmin} />

      <div style={{ flex: 1, maxWidth: 880, margin: '0 auto', padding: '48px 24px', width: '100%' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(226,232,240,0.5)', fontSize: '0.85rem', textDecoration: 'none', marginBottom: 32 }}>
          <ChevronLeft size={16} /> Retour accueil
        </Link>

        <div style={{ marginBottom: 40 }}>
          <div className="badge badge-pink" style={{ marginBottom: 12, display: 'inline-flex' }}>
            <Cookie size={12} /> RESPECT DE LA VIE PRIVÉE
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'white', marginBottom: 12 }}>
            Politique des <span className="gradient-miami-text">Cookies</span>
          </h1>
          <p style={{ color: 'rgba(226,232,240,0.55)', fontSize: '0.95rem' }}>
            En vigueur au {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}.
          </p>
        </div>

        <div className="card-glass" style={{ padding: '40px', lineHeight: '1.7', fontSize: '0.92rem', color: 'rgba(245, 240, 255, 0.8)' }}>
          <p style={{ marginBottom: 24 }}>
            Le site <strong>Classics Coaching</strong> est conçu pour respecter au mieux votre vie privée. Cette politique décrit l'utilisation des cookies et technologies de stockage similaires sur notre site web, conformément aux directives de la CNIL et au RGPD.
          </p>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(255, 10, 94, 0.2)', paddingBottom: 6 }}>
              1. Qu'est-ce qu'un cookie ?
            </h2>
            <p>
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou smartphone) lors de la visite d'un site internet. Il permet au site de mémoriser des informations relatives à votre visite, comme vos identifiants de connexion, afin de faciliter votre navigation ultérieure et de sécuriser l'accès à votre espace.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(0, 245, 255, 0.2)', paddingBottom: 6 }}>
              2. Les Cookies que nous utilisons
            </h2>
            <p style={{ marginBottom: 12 }}>
              Notre site utilise exclusivement des <strong>cookies techniques et de session strictement nécessaires</strong> au fonctionnement de la plateforme. Nous n'utilisons aucun cookie de ciblage publicitaire, de suivi comportemental ou de marketing tiers.
            </p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li>
                <strong>Cookies de session et authentification (Supabase) :</strong> Indispensables pour vous connecter à votre espace client, mémoriser votre identité, et maintenir votre session active. Ils expirent dès que vous vous déconnectez ou fermez votre navigateur.
              </li>
              <li>
                <strong>Stockage Local (Local Storage) & Service Worker :</strong> Utilisé pour stocker de façon locale et sécurisée l'état d'autorisation de vos notifications de motivation PWA et la planification des citations motivationnelles toutes les 4 heures.
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(189, 0, 255, 0.2)', paddingBottom: 6 }}>
              3. Consentement et exemption (CNIL)
            </h2>
            <p>
              Les cookies de session et d'authentification étant indispensables à la fourniture du service (l'accès à votre espace client Classics Coaching), ils sont dispensés du consentement préalable de l'utilisateur conformément aux lignes directrices de la CNIL.
              En revanche, les notifications Push PWA (notifications système sur votre écran) nécessitent votre accord préalable exprès via le bandeau Miami Vice ou l'icône de cloche. Vous pouvez révoquer cette autorisation à tout moment.
            </p>
          </section>

          <section style={{ marginBottom: 12 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(255, 10, 94, 0.2)', paddingBottom: 6 }}>
              4. Comment gérer les cookies depuis votre navigateur ?
            </h2>
            <p style={{ marginBottom: 12 }}>
              Vous pouvez configurer votre navigateur pour accepter, refuser ou supprimer les cookies à tout moment. Veuillez noter que si vous désactivez l'ensemble des cookies, vous ne pourrez plus vous connecter à votre espace Classics Coaching ni accéder à vos programmes achetés.
            </p>
            <p>
              Pour configurer vos préférences selon votre navigateur, consultez les pages d'aide officielles :
              <br />
              - <strong>Google Chrome :</strong> <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--miami-cyan)' }}>Aide Chrome</a>
              <br />
              - <strong>Apple Safari :</strong> <a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--miami-cyan)' }}>Aide Safari</a>
              <br />
              - <strong>Mozilla Firefox :</strong> <a href="https://support.mozilla.org/fr/kb/autoriser-bloquer-cookies-preferences-navigation" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--miami-cyan)' }}>Aide Firefox</a>
              <br />
              - <strong>Microsoft Edge :</strong> <a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-et-g%C3%A9rer-les-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--miami-cyan)' }}>Aide Edge</a>
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
