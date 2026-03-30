'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function ConfirmSuccessPage() {
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    if (countdown <= 0) {
      router.push('/');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, router]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--miami-night)', display: 'flex', flexDirection: 'column' }}>
      <Navbar user={null} />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="card-glass animate-fadeInUp" style={{ maxWidth: 500, width: '100%', padding: '48px 32px', textAlign: 'center' }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981',
            margin: '0 auto 24px', boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)'
          }}>
            <CheckCircle2 size={48} />
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: 16 }}>
            Accès <span className="gradient-miami-text">Confirmé !</span>
          </h1>
          
          <p style={{ color: 'rgba(226, 232, 240, 0.65)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: 32 }}>
            Bravo ! Votre compte Classics Coaching est maintenant activé. Vous pouvez dès à présent accéder à vos programmes et e-books.
          </p>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: 16, padding: '20px', marginBottom: 32, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <p style={{ color: 'rgba(226, 232, 240, 0.5)', fontSize: '0.9rem', marginBottom: 8 }}>
              Redirection automatique dans
            </p>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--miami-pink)' }}>
              {countdown}
            </div>
            <p style={{ color: 'rgba(226, 232, 240, 0.3)', fontSize: '0.75rem', marginTop: 4 }}>secondes</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link href="/" className="btn-primary" style={{ justifyContent: 'center', width: '100%' }}>
              Accéder au site maintenant <ArrowRight size={18} />
            </Link>
            <Link href="/profile" className="btn-ghost" style={{ justifyContent: 'center', width: '100%' }}>
              Aller sur mon profil
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        .gradient-miami-text {
          background: linear-gradient(to right, var(--miami-pink), var(--miami-purple));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}
