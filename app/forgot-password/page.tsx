'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Mail, Zap, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen miami-grid-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--miami-night)' }}>
      <div className="card-glass animate-fadeInUp" style={{ width: '100%', maxWidth: 420, padding: 48 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 36 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #FF2D78, #7B2FBE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'white' }}>
            Classics <span style={{ color: 'var(--miami-pink)' }}>Coaching</span>
          </span>
        </Link>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📬</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: 12 }}>Email envoyé !</h2>
            <p style={{ color: 'rgba(226,232,240,0.6)', marginBottom: 28, lineHeight: 1.6 }}>
              Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.
            </p>
            <Link href="/login" className="btn-ghost" style={{ justifyContent: 'center' }}>
              <ArrowLeft size={16} /> Retour à la connexion
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: 8 }}>
              Mot de passe oublié
            </h1>
            <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.9rem', marginBottom: 36, lineHeight: 1.6 }}>
              Entrez votre email et nous vous enverrons un lien de réinitialisation.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label className="label-miami">Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(226,232,240,0.35)' }} />
                  <input className="input-miami" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="vous@email.com" style={{ paddingLeft: 40 }} />
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', padding: '14px', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Envoi...' : 'Envoyer le lien'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: 24 }}>
              <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(226,232,240,0.5)', fontSize: '0.875rem', textDecoration: 'none' }}>
                <ArrowLeft size={14} /> Retour à la connexion
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
