'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, User, LogOut, BookOpen, Dumbbell, ShieldCheck, ChevronDown, ShoppingBag, Bell, Trash2 } from 'lucide-react';
import { getClientChatRoom } from '@/app/chat/actions';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification 
} from '@/app/notifications/actions';

interface NavbarProps {
  user: any;
  isAdmin?: boolean;
}

export default function Navbar({ user, isAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileExercisesOpen, setIsMobileExercisesOpen] = useState(false);
  const [isFoodDropdownOpen, setIsFoodDropdownOpen] = useState(false);
  const [isMobileFoodOpen, setIsMobileFoodOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Client notifications states
  const [userNotifications, setUserNotifications] = useState<any[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsMobileExercisesOpen(false);
      setIsMobileFoodOpen(false);
    }
  };

  const fetchUserNotifs = async () => {
    if (!user) return;
    try {
      const list = await getUserNotifications();
      setUserNotifications(list);
      const unreadCount = list.filter((n: any) => !n.is_read).length;
      setUnreadNotifCount(unreadCount);
    } catch (err) {
      console.error("Error fetching client notifications:", err);
    }
  };

  useEffect(() => {
    if (!user) {
      setUserNotifications([]);
      setUnreadNotifCount(0);
      return;
    }
    
    fetchUserNotifs();
    // Poll every 20 seconds for new notifications
    const interval = setInterval(fetchUserNotifs, 20000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) {
      setHasUnread(false);
      return;
    }
    
    const checkUnread = async () => {
      try {
        const room = await getClientChatRoom();
        if (room && room.user_unread_count > 0) {
          setHasUnread(true);
        } else {
          setHasUnread(false);
        }
      } catch (err) {
        console.error("Error checking user unread chat:", err);
      }
    };
    
    checkUnread();
    const interval = setInterval(checkUnread, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const exerciseCategories = [
    { name: 'Pectoraux (Pecs)', param: 'Pectoraux', icon: '💪' },
    { name: 'Dos', param: 'Dos', icon: '🦅' },
    { name: 'Épaules', param: 'Épaules', icon: '🛡️' },
    { name: 'Biceps & Bras', param: 'Bras', icon: '🔥' },
    { name: 'Jambes', param: 'Jambes', icon: '🦵' },
    { name: 'Abdominaux', param: 'Abdominaux', icon: '🍫' }
  ];

  const foodCategories = [
    { name: 'Tous les aliments', param: 'Tous', icon: '🥗' },
    { name: 'Légumes', param: 'Légumes', icon: '🥦' },
    { name: 'Fruits', param: 'Fruits', icon: '🍎' },
    { name: 'Féculents & Grains', param: 'Féculents', icon: '🍠' },
    { name: 'Protéines', param: 'Protéines', icon: '🍗' },
    { name: 'Laitages & Alts', param: 'Laitages', icon: '🥛' }
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
                    href={`/exercises?muscle=${item.param}`}
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

          {/* Desktop Dropdown: Alimentation */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setIsFoodDropdownOpen(true)}
            onMouseLeave={() => setIsFoodDropdownOpen(false)}
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
              Alimentation <ChevronDown size={14} style={{ transform: isFoodDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {isFoodDropdownOpen && (
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
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 245, 255, 0.12)',
                  zIndex: 150,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  marginTop: 6
                }}
              >
                {foodCategories.map((item) => (
                  <Link
                    key={item.name}
                    href={`/alimentation?category=${item.param}`}
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
                      e.currentTarget.style.background = 'rgba(0, 245, 255, 0.08)';
                      e.currentTarget.style.color = 'var(--miami-cyan)';
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
          <Link href="/shop" className="btn-ghost" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Boutique</Link>
          
          {isAdmin && (
            <Link href="/admin" className="btn-ghost" style={{ fontSize: '0.85rem', color: 'var(--miami-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <ShieldCheck size={16} /> Admin
            </Link>
          )}

          <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
              {/* Notification Bell Dropdown */}
              <div ref={notifDropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
                  style={{
                    color: isNotifDropdownOpen ? 'var(--miami-pink)' : 'rgba(226,232,240,0.65)',
                    cursor: 'pointer',
                    padding: 8,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    transition: 'color 0.2s',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                  title="Notifications"
                >
                  <Bell size={18} />
                  {unreadNotifCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'var(--miami-pink)',
                      boxShadow: '0 0 6px var(--miami-pink)'
                    }} />
                  )}
                </button>

                {isNotifDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: 'rgba(7, 6, 26, 0.98)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--miami-border)',
                    borderRadius: 14,
                    padding: '12px 0',
                    width: 320,
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 10, 94, 0.12)',
                    zIndex: 150,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    marginTop: 10
                  }}>
                    <div style={{ padding: '4px 16px 8px', fontSize: '0.75rem', color: 'rgba(226,232,240,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>NOTIFICATIONS</span>
                      {unreadNotifCount > 0 && (
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await markAllNotificationsAsRead();
                              fetchUserNotifs();
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--miami-pink)',
                            cursor: 'pointer',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            padding: 0
                          }}
                        >
                          Tout marquer comme lu
                        </button>
                      )}
                    </div>

                    <div style={{ maxHeight: 280, overflowY: 'auto', display: 'flex', flexDirection: 'column' }} className="scroll-mini">
                      {userNotifications.length === 0 ? (
                        <div style={{ padding: '30px 16px', color: 'rgba(226,232,240,0.4)', fontSize: '0.8rem', textAlign: 'center' }}>
                          Aucune notification
                        </div>
                      ) : (
                        userNotifications.map((notif) => (
                          <div
                            key={notif.id}
                            style={{
                              padding: '10px 16px',
                              borderBottom: '1px solid rgba(255,255,255,0.02)',
                              display: 'flex',
                              gap: 10,
                              alignItems: 'flex-start',
                              background: notif.is_read ? 'transparent' : 'rgba(255, 45, 120, 0.03)',
                              transition: 'background 0.2s',
                              position: 'relative'
                            }}
                          >
                            {!notif.is_read && (
                              <span style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: 'var(--miami-pink)',
                                marginTop: 6,
                                flexShrink: 0
                              }} />
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <Link
                                href={notif.link || '/profile'}
                                onClick={async () => {
                                  setIsNotifDropdownOpen(false);
                                  if (!notif.is_read) {
                                    try {
                                      await markNotificationAsRead(notif.id);
                                      fetchUserNotifs();
                                    } catch (e) {
                                      console.error(e);
                                    }
                                  }
                                }}
                                style={{
                                  textDecoration: 'none',
                                  color: 'white',
                                  display: 'block'
                                }}
                              >
                                <span style={{ fontWeight: 'bold', fontSize: '0.8rem', display: 'block', marginBottom: 2 }}>
                                  {notif.title}
                                </span>
                                <span style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.75rem', display: 'block', lineHeight: 1.3 }}>
                                  {notif.body}
                                </span>
                              </Link>
                              <span style={{ fontSize: '0.65rem', color: 'rgba(226,232,240,0.3)', display: 'block', marginTop: 4 }}>
                                {new Date(notif.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  await deleteNotification(notif.id);
                                  fetchUserNotifs();
                                } catch (e) {
                                  console.error(e);
                                }
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255,255,255,0.2)',
                                cursor: 'pointer',
                                padding: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              onMouseEnter={e => e.currentTarget.style.color = 'var(--miami-pink)'}
                              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
                              title="Supprimer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/profile" className="btn-primary" style={{ fontSize: '0.85rem', padding: '9px 18px', textTransform: 'uppercase', letterSpacing: '0.05em', position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <User size={16} /> Mon Espace
                {hasUnread && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#FF2D78',
                    boxShadow: '0 0 6px #FF2D78',
                    animation: 'pulse 2s infinite'
                  }} />
                )}
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
                  href={`/exercises?muscle=${item.param}`}
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

        {/* Mobile Accordion: Alimentation */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <button 
            onClick={() => setIsMobileFoodOpen(!isMobileFoodOpen)}
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
            <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><BookOpen /> Alimentation</span>
            <ChevronDown size={18} style={{ transform: isMobileFoodOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginRight: 8 }} />
          </button>
          
          {isMobileFoodOpen && (
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
              {foodCategories.map((item) => (
                <Link
                  key={item.name}
                  href={`/alimentation?category=${item.param}`}
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

        <Link href="/shop" onClick={toggleMenu} className="mobile-nav-link">
          <ShoppingBag /> Boutique
        </Link>
        
        {isAdmin && (
          <Link href="/admin" onClick={toggleMenu} className="mobile-nav-link" style={{ color: 'var(--miami-cyan)' }}>
            <ShieldCheck /> Admin Panel
          </Link>
        )}

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {user ? (
            <>
              <Link href="/profile" onClick={toggleMenu} className="btn-primary" style={{ justifyContent: 'center', position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
                <User size={18} /> Mon Profil
                {(hasUnread || unreadNotifCount > 0) && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#FF2D78',
                    boxShadow: '0 0 6px #FF2D78',
                    animation: 'pulse 2s infinite'
                  }} />
                )}
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
