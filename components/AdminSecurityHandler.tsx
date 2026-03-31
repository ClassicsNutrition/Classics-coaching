'use client';

import { useEffect } from 'react';

/**
 * AdminSecurityHandler – Aligning with "Xtreme Coaching" technical architecture.
 * This component sets specific tokens/cookies for administrative sessions.
 */
export default function AdminSecurityHandler({ sessionToken }: { sessionToken?: string }) {
  useEffect(() => {
    if (sessionToken) {
      // Set the Classics Coaching admin token in localStorage
      localStorage.setItem('cc_admin_auth', 'true');
      
      // Also set a temporary cookie for API route verification
      // Note: Supabase already handles the main auth cookie, this is for brand-alignment.
      document.cookie = `cc_admin_token=${sessionToken}; path=/; max-age=3600; SameSite=Lax`;
    }
  }, [sessionToken]);

  return null;
}
