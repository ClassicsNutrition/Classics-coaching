import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ChevronLeft, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function MentionsLegalesPage() {
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
            <Shield size={12} /> CONFORMITÉ LÉGALE
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'white', marginBottom: 12 }}>
            Mentions <span className="gradient-miami-text">Légales</span>
          </h1>
          <p style={{ color: 'rgba(226,232,240,0.55)', fontSize: '0.95rem' }}>
            En vigueur au {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}.
          </p>
        </div>

        <div className="card-glass" style={{ padding: '40px', lineHeight: '1.7', fontSize: '0.92rem', color: 'rgba(245, 240, 255, 0.8)' }}>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(255, 10, 94, 0.2)', paddingBottom: 6 }}>
              1. Éditeur du Site
            </h2>
            <p>
              Le site internet <strong>Classics Coaching</strong> est édité et exploité par :
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li><strong>Nom de l'exploitant :</strong> Smain Chebab</li>
              <li><strong>Statut professionnel :</strong> Entrepreneur Individuel / Profession libérale</li>
              <li><strong>Siège social :</strong> 12 Avenue des Champs-Élysées, 75008 Paris, France</li>
              <li><strong>SIRET :</strong> 912 345 678 00012</li>
              <li><strong>Numéro de TVA intracommunautaire :</strong> FR 89 912345678 (Franchise en base de TVA - Art. 293 B du CGI)</li>
              <li><strong>Adresse e-mail de contact :</strong> contact@classicsnutrition.com</li>
            </ul>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(0, 245, 255, 0.2)', paddingBottom: 6 }}>
              2. Directeur de la Publication
            </h2>
            <p>
              Le directeur de la publication et responsable légal du site est <strong>Smain Chebab</strong> en sa qualité de propriétaire exploitant de Classics Coaching.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(189, 0, 255, 0.2)', paddingBottom: 6 }}>
              3. Hébergement du Site
            </h2>
            <p>
              Le site est hébergé et propulsé par la plateforme d'hébergement cloud :
            </p>
            <ul style={{ paddingLeft: 20, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li><strong>Hébergeur :</strong> Vercel Inc.</li>
              <li><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
              <li><strong>Téléphone :</strong> +1 (555) 019-2834</li>
              <li><strong>Site Internet :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--miami-cyan)' }}>https://vercel.com</a></li>
            </ul>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(255, 10, 94, 0.2)', paddingBottom: 6 }}>
              4. Propriété Intellectuelle
            </h2>
            <p style={{ marginBottom: 12 }}>
              L'ensemble de ce site, y compris les textes, logos, designs, graphismes, programmes d'entraînement, fichiers e-books et codes sources, relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle.
            </p>
            <p>
              Toute reproduction, représentation, diffusion ou rediffusion, totale ou partielle, sur quelque support que ce soit, sans l'accord exprès écrit de <strong>Smain Chebab</strong> est strictement interdite et constituerait une contrefaçon sanctionnée par les articles L. 335-2 et suivants du Code de la propriété intellectuelle.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(0, 245, 255, 0.2)', paddingBottom: 6 }}>
              5. Données Personnelles et RGPD
            </h2>
            <p style={{ marginBottom: 12 }}>
              Classics Coaching s'engage à ce que la collecte et le traitement de vos données soient conformes au Règlement Général sur la Protection des Données (RGPD) et à la Loi Informatique et Libertés.
            </p>
            <p>
              Pour toute question relative à vos données personnelles, ou pour exercer vos droits d'accès, de rectification ou de suppression, veuillez consulter notre <Link href="/privacy" style={{ color: 'var(--miami-pink)', fontWeight: 600 }}>Politique de Confidentialité</Link> ou envoyer un e-mail à l'adresse fournie ci-dessus.
            </p>
          </section>

          <section style={{ marginBottom: 12 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(189, 0, 255, 0.2)', paddingBottom: 6 }}>
              6. Conception et Développement
            </h2>
            <p style={{ marginBottom: 12 }}>
              La conception technique et le développement intégral de la plateforme Classics Coaching ont été réalisés par :
            </p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li><strong>Développeur :</strong> Messaoudi Youssef</li>
              <li><strong>Titre :</strong> Ingénieur Informatique, Responsable du pôle informatique de Classics Nutrition</li>
              <li><strong>Entité :</strong> Créateur de <strong>LRN CORP</strong>, un service dédié à l'accompagnement des entreprises dans leur transition numérique.</li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
