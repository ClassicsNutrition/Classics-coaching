'use client';

import { useEffect } from 'react';

/**
 * AdminSecurityHandler – Aligning with "Xtreme Coaching" technical architecture.
 * This component sets specific tokens/cookies for administrative sessions.
 */
export default function AdminSecurityHandler({ sessionToken }: { sessionToken?: string }) {
  useEffect(() => {
    if (sessionToken) {
      // Set the Xtreme Coaching admin token in localStorage
      localStorage.setItem('xc_admin_auth', 'true');
      
      // Also set a temporary cookie for API route verification if needed by legacy patterns
      // Note: Supabase already handles the main auth cookie, this is for Xtreme-alignment.
      document.cookie = `xc_admin_token=${sessionToken}; path=/; max-age=3600; SameSite=Lax`;
    }
  }, [sessionToken]);

  return null;
}
