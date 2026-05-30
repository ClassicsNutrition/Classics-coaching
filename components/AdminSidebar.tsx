'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, BookOpen, Dumbbell, TrendingUp, Settings, Menu, X, Home, Bell } from 'lucide-react';
import { getPendingReservations, getPendingReservationsCount } from '@/app/admin/actions';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);

  const fetchNotifs = async () => {
    try {
      const count = await getPendingReservationsCount();
      setPendingCount(count);
      
      if (count > 0) {
        const list = await getPendingReservations();
        setNotifications(list);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifs();
    // Poll every 15 seconds for access requests
    const interval = setInterval(fetchNotifs, 15000);
    return () => clearInterval(interval);
  }, []);

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
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Notification Bell (Mobile) */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: isNotifOpen ? 'var(--miami-pink)' : 'rgba(226,232,240,0.65)',
                cursor: 'pointer',
                padding: 6,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s',
              }}
            >
              <Bell size={20} />
              {pendingCount > 0 && (
                <span className="notif-badge">{pendingCount}</span>
              )}
            </button>
            
            {/* Dropdown Mobile */}
            {isNotifOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: -40,
                background: 'rgba(7, 6, 26, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--miami-border)',
                borderRadius: 14,
                padding: '12px 0',
                minWidth: 260,
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 10, 94, 0.12)',
                zIndex: 1100,
                marginTop: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}>
                <div style={{ padding: '4px 16px 8px', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>DEMANDES EN ATTENTE</span>
                  {pendingCount > 0 && <span style={{ color: 'var(--miami-pink)', fontWeight: 'bold' }}>{pendingCount}</span>}
                </div>
                
                {notifications.length === 0 ? (
                  <div style={{ padding: '20px 16px', color: 'rgba(226,232,240,0.4)', fontSize: '0.85rem', textAlign: 'center' }}>
                    Aucune demande d'accès.
                  </div>
                ) : (
                  <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {notifications.slice(0, 5).map((notif) => (
                      <Link 
                        key={notif.id}
                        href="/admin/users?tab=requests"
                        onClick={() => {
                          setIsNotifOpen(false);
                          setIsOpen(false);
                        }}
                        style={{
                          padding: '10px 16px',
                          textDecoration: 'none',
                          color: 'white',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          borderBottom: '1px solid rgba(255,255,255,0.02)',
                          fontSize: '0.8rem',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ fontWeight: 'bold' }}>{notif.user_name}</span>
                        <span style={{ color: 'rgba(226,232,240,0.6)' }}>Accès: {notif.content_title}</span>
                      </Link>
                    ))}
                  </div>
                )}
                
                <Link 
                  href="/admin/users?tab=requests"
                  onClick={() => {
                    setIsNotifOpen(false);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '8px 16px 4px',
                    fontSize: '0.8rem',
                    color: 'var(--miami-pink)',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    marginTop: 4,
                    display: 'block'
                  }}
                >
                  Voir toutes les demandes
                </Link>
              </div>
            )}
          </div>
          
          <button onClick={toggleMenu} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
        {/* Logo and Notif Bell */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, padding: '0 8px', position: 'relative' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/logo.png" alt="Classics Coaching" style={{ height: 32, width: 'auto' }} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: 'white' }}>
              Admin <span style={{ color: 'var(--miami-pink)' }}>Panel</span>
            </span>
          </Link>
          
          {/* Notification Bell (Desktop) */}
          <div style={{ position: 'relative' }} className="hide-mobile">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: isNotifOpen ? 'var(--miami-pink)' : 'rgba(226,232,240,0.65)',
                cursor: 'pointer',
                padding: 6,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s',
              }}
            >
              <Bell size={18} />
              {pendingCount > 0 && (
                <span className="notif-badge">{pendingCount}</span>
              )}
            </button>
            
            {/* Dropdown Desktop */}
            {isNotifOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'rgba(7, 6, 26, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--miami-border)',
                borderRadius: 14,
                padding: '12px 0',
                minWidth: 280,
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 10, 94, 0.12)',
                zIndex: 1100,
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 4
              }}>
                <div style={{ padding: '4px 16px 8px', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>DEMANDES EN ATTENTE</span>
                  {pendingCount > 0 && <span style={{ color: 'var(--miami-pink)', fontWeight: 'bold' }}>{pendingCount}</span>}
                </div>
                
                {notifications.length === 0 ? (
                  <div style={{ padding: '20px 16px', color: 'rgba(226,232,240,0.4)', fontSize: '0.85rem', textAlign: 'center' }}>
                    Aucune demande d'accès en attente.
                  </div>
                ) : (
                  <div style={{ maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                    {notifications.slice(0, 5).map((notif) => (
                      <Link 
                        key={notif.id}
                        href="/admin/users?tab=requests"
                        onClick={() => {
                          setIsNotifOpen(false);
                          setIsOpen(false);
                        }}
                        style={{
                          padding: '10px 16px',
                          textDecoration: 'none',
                          color: 'white',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          borderBottom: '1px solid rgba(255,255,255,0.02)',
                          fontSize: '0.8rem',
                          textAlign: 'left'
                        }}
                        className="notif-item"
                      >
                        <span style={{ fontWeight: 'bold' }}>{notif.user_name}</span>
                        <span style={{ color: 'rgba(226,232,240,0.6)' }}>a demandé l'accès à <span style={{ color: 'var(--miami-cyan)' }}>{notif.content_title}</span></span>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(226,232,240,0.3)', marginTop: 2 }}>
                          {new Date(notif.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
                
                <Link 
                  href="/admin/users?tab=requests"
                  onClick={() => {
                    setIsNotifOpen(false);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '8px 16px 4px',
                    fontSize: '0.8rem',
                    color: 'var(--miami-pink)',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    marginTop: 4,
                    display: 'block'
                  }}
                >
                  Voir toutes les demandes
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Menu Navigation items */}
        {menuItems.map(item => {
          const isActive = pathname === item.href;
          const isUsers = item.href === '/admin/users';
          
          return (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
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
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {item.icon}
                {item.label}
              </span>
              
              {/* Show glowing badge in sidebar next to Users if there are pending requests */}
              {isUsers && pendingCount > 0 && (
                <span className="notif-badge-inline">{pendingCount}</span>
              )}
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

      {/* Global notifications CSS rules */}
      <style>{`
        .notif-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #FF2D78;
          color: white;
          font-size: 0.65rem;
          font-weight: bold;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justifyContent: center;
          box-shadow: 0 0 8px #FF2D78;
          animation: pulse 2s infinite;
        }

        .notif-badge-inline {
          background: #FF2D78;
          color: white;
          font-size: 0.65rem;
          font-weight: bold;
          border-radius: 10px;
          padding: 2px 6px;
          box-shadow: 0 0 6px #FF2D78;
          animation: pulse 2s infinite;
        }
        
        .notif-item:hover {
          background: rgba(255, 10, 94, 0.06) !important;
          color: var(--miami-pink) !important;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 45, 120, 0.7);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(255, 45, 120, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 45, 120, 0);
          }
        }

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
