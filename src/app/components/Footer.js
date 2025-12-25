'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Flame, MapPin, Phone, Mail, Facebook, Instagram, ArrowRight } from 'lucide-react';

const SERVICES = [
  { name: 'Heating Solutions', href: '/heating' },
  { name: 'Cooling Systems', href: '/cooling' },
  { name: 'Water Heating', href: '/water' },
  { name: 'Indoor Air Quality', href: '/air-quality' },
];

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await client.fetch(`
  *[_id in ["settings","drafts.settings"]]
  | order(_updatedAt desc)[0]
`);

        setSettings(data);
      } catch (error) {
        console.error('Failed to fetch footer settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-slate-900 text-slate-300 border-t border-slate-800'>
      <div className='max-w-7xl mx-auto px-6 pt-16 pb-8'>
        <div className='grid md:grid-cols-4 gap-12 mb-16'>
          {/* COLUMN 1: BRAND & INFO */}
          <div className='col-span-1 md:col-span-1'>
            <Link href='/' className='flex items-center gap-2 mb-6 group'>
              {settings?.logo ? (
                <img
                  src={urlFor(settings.logo).height(60).url()}
                  alt='Logo'
                  className='h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity'
                />
              ) : (
                <>
                  <div className='w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white'>
                    <Flame size={24} fill='white' />
                  </div>
                  <span className='font-bold text-white text-xl'>GTA Home</span>
                </>
              )}
            </Link>
            <p className='text-slate-400 mb-6 leading-relaxed text-sm'>
              Your local experts for furnace repair, AC installation, and home comfort solutions
              across the Greater Toronto Area.
            </p>
            <div className='flex gap-4'>
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all'
                >
                  <Facebook size={18} />
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all'
                >
                  <Instagram size={18} />
                </a>
              )}
            </div>
          </div>

          {/* COLUMN 2: SERVICES */}
          <div>
            <h3 className='text-white font-bold mb-6 tracking-wide text-sm uppercase'>Services</h3>
            <ul className='space-y-3'>
              {SERVICES.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className='text-slate-400 hover:text-rose-400 flex items-center gap-2 transition-colors text-sm'
                  >
                    <ArrowRight size={14} className='opacity-0 -ml-4 hover-trigger' />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: COMPANY */}
          <div>
            <h3 className='text-white font-bold mb-6 tracking-wide text-sm uppercase'>Company</h3>
            <ul className='space-y-3'>
              <li>
                <Link
                  href='/about'
                  className='text-slate-400 hover:text-rose-400 transition-colors text-sm'
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-slate-400 hover:text-rose-400 transition-colors text-sm'
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-slate-400 hover:text-rose-400 transition-colors text-sm'
                >
                  Service Area
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT */}
          <div>
            <h3 className='text-white font-bold mb-6 tracking-wide text-sm uppercase'>Contact</h3>
            <ul className='space-y-4'>
              <li className='flex items-start gap-3'>
                <MapPin size={20} className='text-rose-500 shrink-0' />
                <span className='text-slate-400 text-sm'>
                  {settings?.address || 'Scarborough, ON'}
                </span>
              </li>
              <li className='flex items-center gap-3'>
                <Phone size={20} className='text-rose-500 shrink-0' />
                <a
                  href={`tel:${settings?.phone}`}
                  className='text-slate-400 hover:text-white transition-colors text-sm'
                >
                  {settings?.phone || '416-678-2131'}
                </a>
              </li>
              <li className='flex items-center gap-3'>
                <Mail size={20} className='text-rose-500 shrink-0' />
                <a
                  href={`mailto:${settings?.email}`}
                  className='text-slate-400 hover:text-white transition-colors text-sm'
                >
                  {settings?.email || 'info@gtahomecomfort.com'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className='pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500'>
          <div>
            © {currentYear} {settings?.companyName || 'GTA Home Comfort'}. All rights reserved.
          </div>
          <div className='flex gap-6'>
            <span>TSSA License #00000000</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
