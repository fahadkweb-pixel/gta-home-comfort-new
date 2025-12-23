'use client';

import Link from 'next/link';
import { Wrench, Phone } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className='sticky top-0 z-50 w-full border-b border-rose-100/50 bg-white/80 backdrop-blur-md'>
      <div className='max-w-5xl mx-auto px-6 h-16 flex items-center justify-between'>
        {/* LOGO */}
        <Link
          href='/'
          className='flex items-center gap-2 text-rose-950 font-bold text-lg tracking-tight group'
        >
          <div className='bg-rose-500 p-1.5 rounded-lg text-white group-hover:scale-105 transition-transform'>
            <Wrench className='w-4 h-4' />
          </div>
          GTA Home Comfort
        </Link>

        {/* CTA BUTTON */}
        <a
          href='tel:4166782131'
          className='flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-sm px-4 py-2 rounded-full transition-colors border border-rose-100'
        >
          <Phone className='w-3.5 h-3.5' />
          <span className='hidden sm:inline'>24/7 Support:</span> 416-678-2131
        </a>
      </div>
    </nav>
  );
}
