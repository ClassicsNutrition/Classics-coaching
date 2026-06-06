'use client';

import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { savePushSubscription } from '@/app/notifications/actions';

const MOTIVATIONAL_QUOTES = [
  "L'entraînement du jour vous attend. Pas d'excuses ! 💪",
  "Atteignez vos objectifs ! Rappelez-vous pourquoi vous avez commencé. 🔥",
  "Une séance ratée est la seule séance que l'on regrette. 🏋️‍♂️",
  "Mangez sainement, restez hydraté, et explosez vos limites ! 🥗",
  "La constance bat le talent. Donnez tout aujourd'hui ! ⚡",
  "Chaque entraînement vous rapproche de votre meilleure version. 🏆",
  "Le succès n'est pas donné, il s'achète à chaque entraînement ! 👊",
  "Hydratez-vous, préparez vos compléments, et direction la salle ! 🥛"
];

const INTERVAL_HOURS = 4; // Check interval for motivation reminders (4 hours)

export default function PushNotificationManager() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if notifications are supported in browser
    if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
      return;
    }

    // Register service worker if not already done
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('Service Worker registered for notifications', reg.scope))
      .catch((err) => console.error('Service Worker registration failed:', err));

    // Check if permission is default and user hasn't dismissed the prompt yet
    const permission = Notification.permission;
    const dismissed = localStorage.getItem('notifications_prompt_dismissed');

    if (permission === 'default' && dismissed !== 'true') {
      // Show the slide-in consent banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 4000);
      return () => clearTimeout(timer);
    }

    // If already granted, run the scheduler check loop
    if (permission === 'granted') {
      checkAndTriggerMotivation();
      
      // Check every 10 minutes (600,000 ms)
      const interval = setInterval(checkAndTriggerMotivation, 600000);
      return () => clearInterval(interval);
    }
  }, []);

  // Check storage and show motivation reminder if needed
  async function checkAndTriggerMotivation() {
    if (Notification.permission !== 'granted') return;

    const lastNotif = localStorage.getItem('last_motivation_notif_time');
    const now = Date.now();
    const intervalMs = INTERVAL_HOURS * 60 * 60 * 1000;

    if (!lastNotif || now - parseInt(lastNotif) >= intervalMs) {
      // Choose random quote
      const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      const quote = MOTIVATIONAL_QUOTES[randomIndex];

      // Send the notification
      try {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification("Classics Coaching ⚡", {
          body: quote,
          icon: '/icon.png',
          badge: '/icon.png',
          data: { url: '/profile' }
        });
        
        // Save last triggered time
        localStorage.setItem('last_motivation_notif_time', now.toString());
      } catch (err) {
        console.error("Failed to show notification via service worker", err);
      }
    }
  }

  // Convert VAPID public key from base64 to Uint8Array
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Request system notification permission and subscribe to Web Push
  async function handleEnableNotifications() {
    setShowBanner(false);
    
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready;
          
          // Subscribe to Web Push
          const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
          if (vapidPublicKey) {
            try {
              const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
              const subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
              });
              
              try {
                await savePushSubscription(subscription.toJSON());
                console.log("Device subscribed to Web Push successfully via banner.");
              } catch (saveErr: any) {
                if (saveErr?.message === "Non connecté.") {
                  console.log("Push permission granted, subscription will be synced once the user logs in.");
                } else {
                  console.error("Error saving push subscription via banner:", saveErr);
                }
              }
            } catch (pushErr) {
              console.error("Failed to subscribe to Web Push service via banner:", pushErr);
            }
          } else {
            console.warn("VAPID public key not found in environment for banner subscription.");
          }

          reg.showNotification("Classics Coaching ⚡", {
            body: "Notifications activées ! Vous recevrez nos alertes et rappels d'entraînement. 💪",
            icon: '/icon.png',
            badge: '/icon.png',
            data: { url: '/' }
          });
        }
        
        // Start the check right away
        localStorage.setItem('last_motivation_notif_time', Date.now().toString());
      }
    } catch (err) {
      console.error("Error requesting notification permission:", err);
    }
  }

  // Dismiss banner for later
  function handleDismiss() {
    setShowBanner(false);
    // Remember dismissal for 7 days
    localStorage.setItem('notifications_prompt_dismissed', 'true');
  }

  if (!showBanner) return null;

  return (
    <div 
      className="card-glass" 
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        right: 24,
        maxWidth: 380,
        margin: '0 auto',
        padding: '16px 20px',
        border: '1px solid rgba(255, 45, 120, 0.35)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 45, 120, 0.15)',
        borderRadius: 16,
        zIndex: 9999,
        background: 'rgba(7, 6, 26, 0.96)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div style={{
          background: 'rgba(255, 45, 120, 0.12)',
          color: 'var(--miami-pink)',
          width: 36,
          height: 36,
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Bell size={20} className="animate-pulse" />
        </div>
        
        <div style={{ flex: 1 }}>
          <h4 style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', margin: '0 0 4px 0' }}>Rappels & Motivation</h4>
          <p style={{ color: 'rgba(226,232,240,0.65)', fontSize: '0.78rem', margin: 0, lineHeight: 1.4 }}>
            Activez les notifications pour recevoir des rappels d&#39;entraînement et des citations motivantes toutes les 4 heures !
          </p>
        </div>

        <button 
          onClick={handleDismiss} 
          style={{ background: 'none', border: 'none', color: 'rgba(226,232,240,0.4)', cursor: 'pointer', padding: 2 }}
        >
          <X size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-end', width: '100%', justifyContent: 'flex-end' }}>
        <button 
          onClick={handleDismiss}
          className="btn-ghost"
          style={{ fontSize: '0.8rem', padding: '6px 12px', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          Plus tard
        </button>
        <button 
          onClick={handleEnableNotifications}
          className="btn-primary"
          style={{ fontSize: '0.8rem', padding: '6px 16px', background: 'var(--miami-pink)' }}
        >
          Activer
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
