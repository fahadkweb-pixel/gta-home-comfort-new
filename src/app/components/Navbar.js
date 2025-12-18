'use client';

import { Wrench } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='w-full px-4 py-4 md:px-8 flex justify-between items-center max-w-7xl mx-auto'>
      <Link href='/' className='flex items-center gap-3 group'>
        <div
          className='bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-xl shadow-sm group-hover:shadow-md transition-all'
          aria-hidden
        >
          <Wrench className='text-white w-5 h-5' />
        </div>
        <div className='flex flex-col justify-center'>
          <span className='text-rose-950 font-bold tracking-tight text-lg leading-none'>
            GTA Home Comfort
          </span>
          {/* Subtitle removed for cleaner look */}
        </div>
      </Link>

      <div className='flex items-center gap-4'>
        <button
          type='button'
          className='bg-white/80 hover:bg-rose-50 text-rose-900 px-4 py-2 rounded-lg text-sm font-semibold border border-rose-200 shadow-sm transition-all hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400'
        >
          Menu
        </button>
      </div>
    </nav>
  );
}
