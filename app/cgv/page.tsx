import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function CGVPage() {
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
            <ShoppingBag size={12} /> CONTRAT DE VENTE
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'white', marginBottom: 12 }}>
            Conditions Générales <span className="gradient-miami-text">de Vente</span>
          </h1>
          <p style={{ color: 'rgba(226,232,240,0.55)', fontSize: '0.95rem' }}>
            En vigueur au {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}.
          </p>
        </div>

        <div className="card-glass" style={{ padding: '40px', lineHeight: '1.7', fontSize: '0.92rem', color: 'rgba(245, 240, 255, 0.8)' }}>
          <p style={{ marginBottom: 24 }}>
            Les présentes Conditions Générales de Vente (dites « CGV ») s'appliquent sans restriction ni réserve à l'ensemble des ventes conclues par l'éditeur du site (ci-après désigné par « le Vendeur ») auprès d'acheteurs non professionnels (ci-après désignés par « le Client » ou « l'Utilisateur ») désirant acquérir les services de coaching, programmes d'entraînement, e-books et compléments alimentaires proposés sur le site <strong>Classics Coaching</strong>.
          </p>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(255, 10, 94, 0.2)', paddingBottom: 6 }}>
              1. Dispositions Générales et Identification
            </h2>
            <p>
              Le site <strong>Classics Coaching</strong> est exploité par <strong>Smain Chebab</strong>, Entrepreneur Individuel enregistré sous le SIRET 912 345 678 00012, dont le siège social est situé à Paris, France.
              <br />
              Toute commande passée sur le site implique l'acceptation expresse et sans réserve des présentes CGV par le Client.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(0, 245, 255, 0.2)', paddingBottom: 6 }}>
              2. Caractéristiques des Produits et Services
            </h2>
            <p style={{ marginBottom: 12 }}>
              Le site propose à la vente les offres suivantes :
            </p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>
                <strong>Programmes Sportifs :</strong> Contenus d'entraînement numériques privatifs (exercices, fiches techniques, schémas de répétitions) débloqués au sein de l'espace client.
              </li>
              <li>
                <strong>E-books Experts :</strong> Livres numériques interactifs rédigés par Smain Chebab, consultables directement en ligne après autorisation d'accès.
              </li>
              <li>
                <strong>Compléments Alimentaires :</strong> Vente en ligne de compléments de marque Classics Nutrition (Whey Native, Pre-Workout ABE, Gainer Jumbo, EAA).
              </li>
              <li>
                <strong>Suivi Messagerie Chat :</strong> Service d'accompagnement de messagerie privée bilatérale avec le coach Smain Chebab.
              </li>
            </ul>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(189, 0, 255, 0.2)', paddingBottom: 6 }}>
              3. Prix et Modalités de Paiement
            </h2>
            <p style={{ marginBottom: 12 }}>
              Les prix de nos produits et services sont indiqués en Euros (€) et s'entendent toutes taxes comprises (TTC), sauf indication contraire.
            </p>
            <p>
              Le paiement est exigible immédiatement lors de la validation de la commande ou de la demande d'accès. Les règlements s'effectuent par carte bancaire de façon sécurisée (Stripe ou autre prestataire bancaire certifié intégré). Le Vendeur ne stocke aucun détail bancaire du Client.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(255, 10, 94, 0.2)', paddingBottom: 6 }}>
              4. Droit de Rétractation
            </h2>
            <div style={{ background: 'rgba(255, 10, 94, 0.05)', border: '1px solid rgba(255, 10, 94, 0.2)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
              <p style={{ fontWeight: 600, color: 'white', marginBottom: 6 }}>⚠️ Information légale importante concernant les contenus numériques :</p>
              <p style={{ fontSize: '0.85rem', margin: 0 }}>
                Conformément à l'article L. 221-28 13° du Code de la consommation français, le droit de rétractation de 14 jours ne peut pas être exercé pour les contrats de fourniture d'un contenu numérique non présenté sur un support matériel, dont l'exécution a commencé après accord préalable exprès du consommateur et renoncement exprès à son droit de rétractation.
              </p>
            </div>
            <p>
              Par conséquent, lors de la demande d'accès immédiat à un programme ou e-book débloqué, le Client renonce expressément à son droit de rétractation. Aucun remboursement ne sera accordé une fois le contenu débloqué au sein de l'espace client.
              Pour les produits physiques (compléments alimentaires), le Client dispose d'un délai légal de 14 jours à compter de la livraison pour renvoyer le produit non ouvert et dans son emballage d'origine.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(0, 245, 255, 0.2)', paddingBottom: 6 }}>
              5. Avertissement Médical et Limite de Responsabilité
            </h2>
            <p style={{ marginBottom: 12 }}>
              Les conseils en nutrition, les programmes d'entraînement et les mouvements d'exercices décrits ne constituent pas un avis médical. Le Client s'engage à consulter son médecin traitant afin d'obtenir un certificat de non-contre-indication à la pratique d'activités physiques intenses et à la prise de suppléments alimentaires avant de démarrer tout programme ou de consommer des compléments.
            </p>
            <p>
              Le Vendeur (Smain Chebab) s'engage à fournir des services de coaching avec diligence et professionnalisme (obligation de moyens) mais ne saurait être tenu pour responsable en cas de blessures, accidents, mauvaise exécution des mouvements par le Client ou inaptitude médicale.
            </p>
          </section>

          <section style={{ marginBottom: 12 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(189, 0, 255, 0.2)', paddingBottom: 6 }}>
              6. Loi Applicable et Juridiction Compétente
            </h2>
            <p>
              Les présentes CGV sont soumises à l'application du droit français. En cas de litige ou de réclamation, le Client s'adressera en priorité au Vendeur à l'adresse <strong>contact@classicsnutrition.com</strong> pour obtenir une solution amiable. À défaut d'accord amiable, tout litige découlant des présentes conditions générales de vente sera soumis à la juridiction exclusive des tribunaux compétents de la ville de Paris.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
