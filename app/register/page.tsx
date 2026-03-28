'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, Eye, EyeOff, User, Zap, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) { setError(error.message); setLoading(false); }
    else {
      setSuccess('Vérifiez votre email pour confirmer votre inscription !');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen miami-grid-bg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--miami-night)' }}>
      <div style={{ position: 'fixed', top: '15%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,47,190,0.15) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div className="card-glass animate-fadeInUp" style={{ width: '100%', maxWidth: 440, padding: 48 }}>
        <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textDecoration: 'none', marginBottom: 32 }}>
          <img src="/logo.png" alt="Classics Coaching" style={{ height: 60, width: 'auto' }} />
        </Link>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'white', marginBottom: 8 }}>
          Créer mon compte
        </h1>
        <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.9rem', marginBottom: 36 }}>
          Rejoignez la communauté Classics Coaching
        </p>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '12px 16px', color: '#f87171', fontSize: '0.875rem', marginBottom: 24 }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 12, padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>✉️</div>
            <h3 style={{ color: '#4ade80', fontWeight: 700, marginBottom: 8 }}>Email envoyé !</h3>
            <p style={{ color: 'rgba(226,232,240,0.65)', fontSize: '0.9rem' }}>{success}</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="label-miami">Nom complet</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(226,232,240,0.35)' }} />
                <input className="input-miami" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Votre nom" style={{ paddingLeft: 40 }} />
              </div>
            </div>
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
                <input className="input-miami" type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="Minimum 8 caractères" style={{ paddingLeft: 40, paddingRight: 44 }} minLength={8} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(226,232,240,0.35)', cursor: 'pointer' }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '14px', opacity: loading ? 0.7 : 1, marginTop: 4 }}>
              {loading ? 'Création...' : <><span>Créer mon compte</span> <ArrowRight size={16} /></>}
            </button>
          </form>
        )}

        <p style={{ textAlign: 'center', marginTop: 28, color: 'rgba(226,232,240,0.5)', fontSize: '0.875rem' }}>
          Déjà un compte ?{' '}
          <Link href="/login" style={{ color: 'var(--miami-cyan)', fontWeight: 600, textDecoration: 'none' }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
