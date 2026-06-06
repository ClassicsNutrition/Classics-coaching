import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ChevronLeft, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function PrivacyPolicyPage() {
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
            <Lock size={12} /> PROTECTION DES DONNÉES
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: 'white', marginBottom: 12 }}>
            Politique de <span className="gradient-miami-text">Confidentialité</span>
          </h1>
          <p style={{ color: 'rgba(226,232,240,0.55)', fontSize: '0.95rem' }}>
            Dernière mise à jour le {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}.
          </p>
        </div>

        <div className="card-glass" style={{ padding: '40px', lineHeight: '1.7', fontSize: '0.92rem', color: 'rgba(245, 240, 255, 0.8)' }}>
          <p style={{ marginBottom: 24 }}>
            Chez <strong>Classics Coaching</strong>, la protection de vos données personnelles est une priorité absolue. Cette politique de confidentialité détaille la manière dont nous collectons, utilisons, stockons et protégeons vos informations personnelles dans le strict respect du Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679) et de la loi Informatique et Libertés.
          </p>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(255, 10, 94, 0.2)', paddingBottom: 6 }}>
              1. Responsable du Traitement
            </h2>
            <p>
              Les données personnelles des utilisateurs collectées sur le site sont traitées par :
            </p>
            <p style={{ marginTop: 10 }}>
              <strong>Smain Chebab</strong>, Entrepreneur Individuel, ayant son siège social situé au 12 Avenue des Champs-Élysées, 75008 Paris, France.
              <br />
              Adresse e-mail : <strong>contact@classicsnutrition.com</strong>.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(0, 245, 255, 0.2)', paddingBottom: 6 }}>
              2. Données Collectées
            </h2>
            <p style={{ marginBottom: 12 }}>
              Nous collectons et traitons les catégories de données suivantes :
            </p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><strong>Données d'identification :</strong> Nom, prénom, adresse e-mail, avatar de profil.</li>
              <li><strong>Données de connexion :</strong> Mots de passe chiffrés, identifiant utilisateur unique (géré de manière sécurisée par notre base de données).</li>
              <li><strong>Données de messagerie :</strong> Échanges de messages textes et partages d'exercices entre vous et votre coach Smain Chebab au sein du chat privé.</li>
              <li><strong>Données de navigation et PWA :</strong> Token de souscription aux notifications push (si vous avez expressément consenti à les recevoir sur votre téléphone ou ordinateur).</li>
            </ul>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(189, 0, 255, 0.2)', paddingBottom: 6 }}>
              3. Finalités et Bases Légales du Traitement
            </h2>
            <p style={{ marginBottom: 12 }}>
              Vos données sont traitées pour les finalités suivantes :
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12, fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.1)', color: 'white', textAlign: 'left' }}>
                  <th style={{ padding: '8px 12px' }}>Finalité du traitement</th>
                  <th style={{ padding: '8px 12px' }}>Base légale (RGPD)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 12px' }}>Gestion de votre compte client, accès aux programmes sportifs et e-books.</td>
                  <td style={{ padding: '10px 12px' }}>Exécution d'un contrat ou mesures précontractuelles.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 12px' }}>Messagerie privée et accompagnement personnalisé avec votre coach.</td>
                  <td style={{ padding: '10px 12px' }}>Exécution d'un contrat ou intérêt légitime d'accompagnement.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 12px' }}>Envoi de notifications motivationnelles et rappels d'entraînement toutes les 4 heures.</td>
                  <td style={{ padding: '10px 12px' }}>Consentement de l'utilisateur (opt-in de la cloche / du bandeau PWA).</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 12px' }}>Facturation des compléments de la boutique, gestion des droits d'accès administratifs.</td>
                  <td style={{ padding: '10px 12px' }}>Obligation légale de facturation et respect des droits de vente.</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(255, 10, 94, 0.2)', paddingBottom: 6 }}>
              4. Destinataires des Données
            </h2>
            <p style={{ marginBottom: 12 }}>
              Vos données personnelles restent strictement confidentielles et ne sont vendues ou partagées à aucun tiers commercial.
            </p>
            <p>
              Les seuls destinataires de vos données sont :
              <br />
              - <strong>Smain Chebab</strong> (en tant que gérant et coach unique de la plateforme).
              <br />
              - Notre fournisseur d'infrastructure de base de données cloud hautement sécurisé <strong>Supabase</strong> (les données sont hébergées au sein de l'Union Européenne).
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(0, 245, 255, 0.2)', paddingBottom: 6 }}>
              5. Durée de Conservation des Données
            </h2>
            <p>
              Vos données d'identification et de messagerie sont conservées pendant toute la durée d'ouverture de votre compte client. Si votre compte reste inactif pendant une durée de 3 ans consécutifs, vos données seront automatiquement supprimées.
              En cas de suppression de votre compte, toutes vos données (profil, favoris, historique de chat) sont immédiatement et définitivement effacées de notre base de données.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(189, 0, 255, 0.2)', paddingBottom: 6 }}>
              6. Vos Droits (RGPD)
            </h2>
            <p style={{ marginBottom: 12 }}>
              Conformément à la réglementation sur la protection des données, vous disposez des droits suivants :
            </p>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              <li><strong>Droit d'accès :</strong> Obtenir la confirmation que vos données sont traitées et en recevoir une copie.</li>
              <li><strong>Droit de rectification :</strong> Demander la correction d'informations inexactes ou incomplètes.</li>
              <li><strong>Droit à l'effacement (« droit à l'oubli ») :</strong> Demander la suppression totale de vos données de notre base.</li>
              <li><strong>Droit d'opposition et de retrait du consentement :</strong> Retirer votre consentement aux notifications de motivation PWA à tout moment depuis les réglages de votre navigateur.</li>
              <li><strong>Droit à la limitation du traitement :</strong> Geler l'utilisation de vos données dans certaines conditions.</li>
              <li><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format structuré couramment utilisé.</li>
            </ul>
            <p>
              Pour exercer ces droits, vous pouvez nous écrire directement à : <strong>contact@classicsnutrition.com</strong>.
              Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés - <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--miami-cyan)' }}>cnil.fr</a>).
            </p>
          </section>

          <section style={{ marginBottom: 12 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'white', marginBottom: 16, borderBottom: '1px solid rgba(255, 10, 94, 0.2)', paddingBottom: 6 }}>
              7. Sécurité des Données
            </h2>
            <p>
              Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour garantir un niveau de sécurité adapté au risque, incluant le protocole HTTPS pour tous les transferts de données, le hachage sécurisé des mots de passe et la gestion stricte des politiques de contrôle d'accès de la base de données (politiques RLS de Supabase).
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
