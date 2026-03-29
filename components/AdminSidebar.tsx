'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BookOpen, Dumbbell, Clock, TrendingUp, Settings, Menu, X, Home } from 'lucide-react';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: <TrendingUp size={18} /> },
    { href: '/admin/users', label: 'Utilisateurs', icon: <Users size={18} /> },
    { href: '/admin/ebooks', label: 'E-books', icon: <BookOpen size={18} /> },
    { href: '/admin/programs', label: 'Programmes', icon: <Dumbbell size={18} /> },
    { href: '/admin/exercises', label: 'Exercices', icon: <Settings size={18} /> },
  ];

  return (
    <>
      {/* Mobile Header (Admin) */}
      <div className="show-mobile" style={{
        background: 'rgba(6, 6, 15, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 45, 120, 0.1)',
        padding: '12px 20px',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1001,
        height: 60
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <img src="/logo.png" alt="Logo" style={{ height: 28, width: 'auto' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.85rem', color: 'white' }}>Admin</span>
        </Link>
        <button onClick={toggleMenu} style={{ background: 'none', border: 'none', color: 'white' }}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile (Overlay) */}
      <aside className={`admin-sidebar ${isOpen ? 'active' : ''}`} style={{
        width: 240,
        borderRight: '1px solid rgba(255,45,120,0.1)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        background: 'rgba(6,6,15,0.95)',
        zIndex: 1000,
        transition: 'transform 0.3s ease'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 32, padding: '0 8px' }}>
          <img src="/logo.png" alt="Classics Coaching" style={{ height: 32, width: 'auto' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: 'white' }}>
            Admin <span style={{ color: 'var(--miami-pink)' }}>Panel</span>
          </span>
        </Link>

        {menuItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 10,
              textDecoration: 'none',
              color: isActive ? 'white' : 'rgba(226,232,240,0.65)',
              background: isActive ? 'rgba(255, 45, 120, 0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(255, 45, 120, 0.2)' : '1px solid transparent',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}>
              {item.icon}
              {item.label}
            </Link>
          );
        })}

        <div style={{ marginTop: 'auto', paddingTop: 20 }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', color: 'rgba(226,232,240,0.45)',
            textDecoration: 'none', fontSize: '0.85rem'
          }}>
            <Home size={18} /> Retour au site
          </Link>
        </div>
      </aside>

      <style jsx>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed !important;
            left: 0;
            top: 60px;
            height: calc(100vh - 60px) !important;
            transform: translateX(-100%);
            width: 100% !important;
            border-right: none !important;
          }
          .admin-sidebar.active {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
