'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  ChevronDown,
  Flame,
  Snowflake,
  Droplets,
  Wind,
  Phone,
  Info,
  Mail,
} from 'lucide-react';

const SERVICES = [
  {
    name: 'Heating',
    href: '/heating',
    icon: Flame,
    description: 'Furnace repairs & installs',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
  {
    name: 'Cooling',
    href: '/cooling',
    icon: Snowflake,
    description: 'AC & Heat Pump solutions',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'Water Heating',
    href: '/water',
    icon: Droplets,
    description: 'Tankless & Hot Water Tanks',
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-50',
  },
  {
    name: 'Air Quality',
    href: '/air-quality',
    icon: Wind,
    description: 'Filtration & Humidifiers',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-rose-100'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='flex justify-between items-center h-20'>
          {/* 1. LOGO */}
          <Link href='/' className='flex items-center gap-2 group'>
            <div className='w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform'>
              <Flame size={24} fill='white' />
            </div>
            <div className='flex flex-col'>
              <span className='font-bold text-slate-900 text-lg leading-none tracking-tight'>
                GTA Home
              </span>
              <span className='text-rose-500 font-bold text-sm leading-none tracking-widest uppercase'>
                Comfort
              </span>
            </div>
          </Link>

          {/* 2. DESKTOP NAVIGATION */}
          <div className='hidden md:flex items-center gap-8'>
            <Link
              href='/'
              className='text-sm font-bold text-slate-600 hover:text-rose-500 transition-colors'
            >
              Home
            </Link>

            {/* SERVICES DROPDOWN */}
            <div className='relative group'>
              <button className='flex items-center gap-1 text-sm font-bold text-slate-600 group-hover:text-rose-500 transition-colors py-8'>
                Services
                <ChevronDown
                  size={16}
                  className='group-hover:rotate-180 transition-transform duration-300'
                />
              </button>

              {/* The Dropdown Card */}
              <div className='absolute top-full left-1/2 -translate-x-1/2 w-[340px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-2 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200 ease-out'>
                {SERVICES.map((service) => (
                  <Link
                    key={service.name}
                    href={service.href}
                    className='flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item'
                  >
                    <div
                      className={`w-10 h-10 rounded-lg ${service.bgColor} flex items-center justify-center shrink-0`}
                    >
                      <service.icon size={20} className={service.color} />
                    </div>
                    <div>
                      <div className='font-bold text-slate-900 group-hover/item:text-rose-600 transition-colors'>
                        {service.name}
                      </div>
                      <p className='text-xs text-slate-500 font-medium'>{service.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href='/about'
              className='text-sm font-bold text-slate-600 hover:text-rose-500 transition-colors'
            >
              About
            </Link>

            {/* REMOVED REVIEWS LINK HERE */}

            <Link
              href='/contact'
              className='text-sm font-bold text-slate-600 hover:text-rose-500 transition-colors'
            >
              Contact
            </Link>
          </div>

          {/* 3. CTA BUTTON (Desktop) */}
          <div className='hidden md:flex items-center gap-4'>
            <div className='flex flex-col items-end mr-2'>
              <span className='text-[10px] font-bold text-slate-400 uppercase tracking-wider'>
                24/7 Emergency Support
              </span>
              <span className='text-lg font-bold text-slate-900 font-mono'>416-678-2131</span>
            </div>
            <a
              href='tel:4166782131'
              className='bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-full shadow-lg shadow-rose-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0'
            >
              <Phone size={20} />
            </a>
          </div>

          {/* 4. MOBILE HAMBURGER */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='md:hidden p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors'
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* 5. MOBILE MENU (Slide Down) */}
      {isOpen && (
        <div className='md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 shadow-xl flex flex-col p-4 animate-in slide-in-from-top-5 duration-200 h-[calc(100vh-80px)] overflow-y-auto'>
          {/* Mobile Services List */}
          <div className='mb-6'>
            <div className='text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2'>
              Services
            </div>
            <div className='grid grid-cols-1 gap-2'>
              {SERVICES.map((service) => (
                <Link
                  key={service.name}
                  href={service.href}
                  onClick={() => setIsOpen(false)}
                  className='flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all'
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${service.bgColor} flex items-center justify-center shrink-0`}
                  >
                    <service.icon size={20} className={service.color} />
                  </div>
                  <span className='font-bold text-slate-700 text-lg'>{service.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Company Links */}
          <div className='mb-6 border-t border-slate-100 pt-6'>
            <div className='text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2'>
              Company
            </div>
            <div className='space-y-2'>
              <Link
                href='/about'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-bold'
              >
                <Info size={20} className='text-rose-400' />
                About Us
              </Link>
              <Link
                href='/contact'
                onClick={() => setIsOpen(false)}
                className='flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 font-bold'
              >
                <Mail size={20} className='text-rose-400' />
                Contact
              </Link>
              {/* REMOVED REVIEWS LINK HERE */}
            </div>
          </div>

          {/* Mobile CTA */}
          <div className='mt-auto pb-8'>
            <a
              href='tel:4166782131'
              className='flex items-center justify-center gap-3 w-full bg-rose-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/20 active:scale-95 transition-transform'
            >
              <Phone size={20} />
              Call 416-678-2131
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
