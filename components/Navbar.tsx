'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User, LogOut, BookOpen, Dumbbell, ShieldCheck, ChevronDown } from 'lucide-react';

interface NavbarProps {
  user: any;
  isAdmin?: boolean;
}

export default function Navbar({ user, isAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileExercisesOpen, setIsMobileExercisesOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsMobileExercisesOpen(false); // Close accordion when closing menu
    }
  };

  const exerciseCategories = [
    { name: 'Pectoraux (Pecs)', param: 'Pectoraux', icon: '💪' },
    { name: 'Dos', param: 'Dos', icon: '🦅' },
    { name: 'Épaules', param: 'Épaules', icon: '🛡️' },
    { name: 'Biceps & Bras', param: 'Bras', icon: '🔥' },
    { name: 'Jambes', param: 'Jambes', icon: '🦵' },
    { name: 'Abdominaux', param: 'Abdominaux', icon: '🍫' }
  ];

  return (
    <>
      {/* Sunset Top Bar */}
      <div style={{
        height: '3px',
        background: 'linear-gradient(90deg, var(--miami-pink), var(--miami-purple), var(--miami-cyan))',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 101
      }} />

      <nav style={{ 
        borderBottom: '1px solid var(--miami-border)', 
        padding: '0 24px', 
        height: 70, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        background: 'rgba(7, 6, 26, 0.95)', 
        backdropFilter: 'blur(20px)', 
        position: 'sticky', 
        top: 3, 
        zIndex: 100 
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/logo.png" alt="Classics Coaching" style={{ height: 45, width: 'auto', filter: 'drop-shadow(0 0 8px rgba(0, 245, 255, 0.2))' }} />
        </Link>

        {/* Desktop Links */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/ebooks" className="btn-ghost" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>E-books</Link>
          
          {/* Desktop Dropdown: Exercices */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button 
              className="btn-ghost" 
              style={{ 
                fontSize: '0.85rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                background: 'transparent',
                border: '1px solid rgba(226, 232, 240, 0.1)',
                padding: '10px 20px',
                borderRadius: '10px',
                color: 'rgba(226, 232, 240, 0.7)'
              }}
            >
              Exercices <ChevronDown size={14} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {isDropdownOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  background: 'rgba(7, 6, 26, 0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--miami-border)',
                  borderRadius: 14,
                  padding: '12px 0',
                  minWidth: 210,
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 10, 94, 0.12)',
                  zIndex: 150,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  marginTop: 6
                }}
              >
                {exerciseCategories.map((item) => (
                  <Link
                    key={item.name}
                    href={`/?muscle=${item.param}`}
                    style={{
                      padding: '10px 20px',
                      fontSize: '0.85rem',
                      color: 'rgba(245, 240, 255, 0.8)',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      transition: 'all 0.2s ease-in-out',
                      fontWeight: 600
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255, 10, 94, 0.08)';
                      e.currentTarget.style.color = 'var(--miami-pink)';
                      e.currentTarget.style.paddingLeft = '24px';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'rgba(245, 240, 255, 0.8)';
                      e.currentTarget.style.paddingLeft = '20px';
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{item.icon}</span> {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/programs" className="btn-ghost" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Programmes</Link>
          
          {isAdmin && (
            <Link href="/admin" className="btn-ghost" style={{ fontSize: '0.85rem', color: 'var(--miami-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <ShieldCheck size={16} /> Admin
            </Link>
          )}

          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Link href="/profile" className="btn-primary" style={{ fontSize: '0.85rem', padding: '9px 18px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <User size={16} /> Mon Espace
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className="btn-ghost" style={{ padding: '8px', borderRadius: '10px', color: 'rgba(226,232,240,0.5)' }} title="Déconnexion">
                  <LogOut size={18} />
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="btn-primary" style={{ fontSize: '0.85rem', padding: '9px 18px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Connexion
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="show-mobile" 
          onClick={toggleMenu}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'white', 
            cursor: 'pointer',
            padding: 8,
            display: 'none' // Hidden by CSS query except on mobile
          }}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isOpen ? 'active' : ''}`}>
        <Link href="/ebooks" onClick={toggleMenu} className="mobile-nav-link">
          <BookOpen /> E-books
        </Link>

        {/* Mobile Accordion: Exercices */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <button 
            onClick={() => setIsMobileExercisesOpen(!isMobileExercisesOpen)}
            className="mobile-nav-link"
            style={{ 
              width: '100%', 
              background: 'none', 
              border: 'none', 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Dumbbell /> Exercices</span>
            <ChevronDown size={18} style={{ transform: isMobileExercisesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginRight: 8 }} />
          </button>
          
          {isMobileExercisesOpen && (
            <div style={{ 
              paddingLeft: 28, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2, 
              background: 'rgba(255, 255, 255, 0.02)', 
              borderRadius: 12, 
              margin: '4px 12px 12px 12px',
              border: '1px solid rgba(255,255,255,0.05)',
              paddingTop: 6,
              paddingBottom: 6
            }}>
              {exerciseCategories.map((item) => (
                <Link
                  key={item.name}
                  href={`/?muscle=${item.param}`}
                  onClick={toggleMenu}
                  style={{
                    padding: '10px 16px',
                    fontSize: '0.9rem',
                    color: 'rgba(245, 240, 255, 0.75)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontWeight: 500
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span> {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/programs" onClick={toggleMenu} className="mobile-nav-link">
          <Dumbbell /> Programmes
        </Link>
        
        {isAdmin && (
          <Link href="/admin" onClick={toggleMenu} className="mobile-nav-link" style={{ color: 'var(--miami-cyan)' }}>
            <ShieldCheck /> Admin Panel
          </Link>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {user ? (
            <>
              <Link href="/profile" onClick={toggleMenu} className="btn-primary" style={{ justifyContent: 'center' }}>
                <User size={18} /> Mon Profil
              </Link>
              <form action="/auth/signout" method="post" style={{ width: '100%' }}>
                <button type="submit" className="btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                  <LogOut size={18} /> Déconnexion
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" onClick={toggleMenu} className="btn-primary" style={{ justifyContent: 'center' }}>
                Connexion
              </Link>
              <Link href="/register" onClick={toggleMenu} className="btn-ghost" style={{ justifyContent: 'center' }}>
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
