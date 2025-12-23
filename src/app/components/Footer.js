'use client';

import { Wrench, Star, ShieldCheck, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='w-full bg-rose-950 text-rose-100/80 pt-16 pb-8 border-t border-rose-900 mt-auto'>
      <div className='max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-16'>
        {/* BRAND COLUMN */}
        <div className='col-span-1 md:col-span-2 space-y-6'>
          <Link
            href='/'
            className='flex items-center gap-2 text-white font-bold text-xl group w-fit'
          >
            <div className='bg-rose-900 p-1.5 rounded-lg border border-rose-800 group-hover:bg-rose-800 transition-colors'>
              <Wrench className='w-5 h-5 text-rose-500' />
            </div>
            GTA Home Comfort
          </Link>
          <p className='text-sm leading-relaxed max-w-sm opacity-80'>
            Advanced diagnostics and rapid repair for residential thermal systems. Operating
            strictly within the Scarborough, ON region.
          </p>

          <div className='flex flex-col sm:flex-row gap-4 sm:items-center'>
            {/* TRUST BADGE (5/5) */}
            <div className='flex items-center gap-3 text-xs font-medium bg-rose-900/30 w-fit px-4 py-2 rounded-xl border border-rose-800/50 backdrop-blur-sm'>
              <div className='flex gap-0.5'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className='w-3.5 h-3.5 text-orange-400 fill-orange-400' />
                ))}
              </div>
              <span className='text-white font-bold ml-1'>5.0/5.0</span>
              <span className='text-rose-400 pl-2 border-l border-rose-800 ml-1'>
                Verified on Google
              </span>
            </div>

            {/* SOCIAL ICONS */}
            <div className='flex gap-4 items-center pl-2'>
              <SocialLink href='#' icon={<Instagram className='w-5 h-5' />} label='Instagram' />
              <SocialLink href='#' icon={<Facebook className='w-5 h-5' />} label='Facebook' />
              <SocialLink href='#' icon={<Twitter className='w-5 h-5' />} label='Twitter' />
            </div>
          </div>
        </div>

        {/* EMERGENCY ACTION COLUMN */}
        <div className='flex flex-col justify-start md:items-end'>
          <h3 className='text-white font-bold mb-6 text-xs tracking-widest uppercase opacity-50'>
            Emergency Dispatch
          </h3>
          <ul className='space-y-4 text-sm md:text-right'>
            <li>
              <a
                href='tel:4166782131'
                className='text-3xl font-bold text-white hover:text-rose-400 transition-colors block tracking-tight'
              >
                416-678-2131
              </a>
              <span className='text-xs text-rose-400 block mt-1'>24/7 Direct Line</span>
            </li>
            <li className='pt-2'>
              <a
                href='mailto:help@gtahomecomfort.com'
                className='text-rose-200 hover:text-white transition-colors'
              >
                help@gtahomecomfort.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className='max-w-5xl mx-auto px-4 pt-8 border-t border-rose-900/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50 font-medium'>
        <div className='flex flex-col md:flex-row items-center gap-4 md:gap-8'>
          <span>&copy; {new Date().getFullYear()} GTA Home Comfort Inc.</span>
          <span className='flex items-center gap-1.5'>
            <ShieldCheck className='w-3 h-3' /> TSSA #76543991
          </span>
          <span className='flex items-center gap-1.5'>
            <MapPin className='w-3 h-3' /> Scarborough, ON
          </span>
        </div>
        <div className='flex gap-6'>
          <Link href='/' className='hover:text-white transition-colors'>
            Privacy
          </Link>
          <Link href='/' className='hover:text-white transition-colors'>
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <a
      href={href}
      className='text-rose-300 hover:text-white hover:scale-110 transition-all duration-200'
      aria-label={label}
    >
      {icon}
    </a>
  );
}
