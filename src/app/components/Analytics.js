'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { GoogleTagManager } from '@next/third-parties/google';

export default function Analytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const storedConsent = localStorage.getItem('cookie_consent');
    if (storedConsent === 'granted') {
      setConsent(true);
    }
  }, []);

  // 1. Studio Guard
  if (pathname?.startsWith('/studio')) return null;

  // 2. Consent Guard (Strict Mode)
  // Only load GTM if consent is explicitly granted
  if (!consent) return null;

  return <GoogleTagManager gtmId='GTM-PCC94D66' />;
}
