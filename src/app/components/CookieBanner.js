'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'granted');
    setIsVisible(false);
    window.location.reload(); // Reload to fire GTM if it was blocked
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'denied');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className='fixed bottom-0 left-0 w-full bg-rose-950 text-white p-4 z-50 animate-in slide-in-from-bottom duration-500 shadow-xl border-t border-rose-800'>
      <div className='max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='text-sm text-rose-100/80 text-center sm:text-left'>
          <p className='font-semibold text-white mb-1'>We value your privacy.</p>
          <p>
            We use cookies to improve your experience and analyze traffic. We do not sell your data.
            Read our{' '}
            <a href='/privacy' className='underline hover:text-white'>
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <button
            onClick={handleDecline}
            className='px-4 py-2 text-sm font-semibold text-rose-200 hover:text-white transition-colors'
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className='px-6 py-2 text-sm font-bold bg-white text-rose-950 rounded-full hover:bg-rose-100 transition-colors shadow-sm'
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
