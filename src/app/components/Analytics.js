'use client';

import { usePathname } from 'next/navigation';
import { GoogleTagManager } from '@next/third-parties/google';

export default function Analytics() {
  const pathname = usePathname();

  // If we are in the Studio, return nothing
  if (pathname?.startsWith('/studio')) {
    return null;
  }

  // Otherwise, load GTM
  return <GoogleTagManager gtmId='GTM-PCC94D66' />;
}
