'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { Star, ShieldCheck, Phone } from 'lucide-react';

export default function TrustBar() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await client.fetch(`*[_type == "settings"][0]{ phone }`);
        setSettings(data);
      } catch (error) {
        console.error('Failed to fetch trustbar settings:', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className='w-full bg-rose-950 text-rose-50/90 text-[11px] md:text-xs font-medium py-2.5 px-4 border-b border-rose-900/50'>
      <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0'>
        {/* LEFT: Social Proof */}
        <div className='flex items-center gap-2'>
          <div className='flex gap-0.5'>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className='w-3 h-3 text-orange-400 fill-orange-400' />
            ))}
          </div>
          <span className='opacity-90'>
            <span className='font-bold text-white'>5/5</span> on Google (120+ Reviews)
          </span>
        </div>

        {/* CENTER/RIGHT WRAPPER */}
        <div className='flex items-center gap-4 md:gap-6'>
          {/* TSSA Certification */}
          <div className='hidden md:flex items-center gap-1.5 opacity-80'>
            <ShieldCheck className='w-3.5 h-3.5 text-emerald-400' />
            <span>TSSA Certified #76543991</span>
          </div>

          {/* Separator (Desktop only) */}
          <div className='hidden md:block w-px h-3 bg-rose-800' />

          {/* Emergency Number (Dynamic) */}
          <a
            href={`tel:${settings?.phone || '416-678-2131'}`}
            className='flex items-center gap-1.5 hover:text-white transition-colors group'
          >
            <Phone className='w-3.5 h-3.5 text-rose-400 group-hover:text-rose-300' />
            <span className='font-bold tracking-wide'>
              24/7 Emergency: {settings?.phone || '416-678-2131'}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
