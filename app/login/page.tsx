'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else { router.push('/profile'); router.refresh(); }
  }

  return (
    <div className="min-h-screen miami-grid-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--miami-night)' }}>
      {/* Orbs */}
      <div style={{ position: 'fixed', top: '20%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,45,120,0.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '20%', right: '10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,245,255,0.1) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div className="card-glass animate-fadeInUp" style={{ width: '100%', maxWidth: 440, padding: 48, position: 'relative' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textDecoration: 'none', marginBottom: 32 }}>
          <img src="/logo.png" alt="Classics Coaching" style={{ height: 60, width: 'auto' }} />
        </Link>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: 8 }}>
          Bon retour 👋
        </h1>
        <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.9rem', marginBottom: 36 }}>
          Connectez-vous à votre espace coaching
        </p>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 16px', color: '#f87171', fontSize: '0.875rem', marginBottom: 24 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label className="label-miami">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(226,232,240,0.35)' }} />
              <input className="input-miami" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="vous@email.com" style={{ paddingLeft: 40 }} />
            </div>
          </div>
          <div>
            <label className="label-miami">Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(226,232,240,0.35)' }} />
              <input className="input-miami" type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={{ paddingLeft: 40, paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(226,232,240,0.35)', cursor: 'pointer' }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <Link href="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--miami-pink)', textDecoration: 'none' }}>
              Mot de passe oublié ?
            </Link>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Connexion...' : <><span>Se connecter</span> <ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 28, color: 'rgba(226,232,240,0.5)', fontSize: '0.875rem' }}>
          Pas encore de compte ?{' '}
          <Link href="/register" style={{ color: 'var(--miami-cyan)', fontWeight: 600, textDecoration: 'none' }}>
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
