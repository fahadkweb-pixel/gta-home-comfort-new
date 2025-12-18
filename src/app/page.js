'use client';

import { useState, useEffect, useCallback } from 'react';
import { client } from '@/sanity/lib/client'; // Check this path matches yours
import {
  Flame,
  Snowflake,
  Volume2,
  Droplets,
  Wrench,
  AlertTriangle,
  Star,
  ArrowRight,
} from 'lucide-react';

// --- COMPONENTS ---
// Make sure these import paths are correct for your project!
import ReviewCarousel from './components/ReviewCarousel'; // (Example path)
import SmartQuote from './components/SmartQuote'; // (Example path)
import ContentSections from './components/ContentSections'; // (Example path)

// --- ICON MAP ---
const ICON_MAP = {
  Flame: Flame,
  Snowflake: Snowflake,
  Volume2: Volume2,
  Droplets: Droplets,
  Wrench: Wrench,
  AlertTriangle: AlertTriangle,
  Star: Star,
  Default: ArrowRight,
};

export default function Home() {
  // --- STATE: DATA ---
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- STATE: VIEW & NAVIGATION ---
  const [currentView, setCurrentView] = useState('GRID'); // 'GRID' or 'QUOTE'
  const [selectedIssue, setSelectedIssue] = useState(null);

  // --- HANDLERS ---
  const handleIssueSelect = useCallback((tileLabel) => {
    setSelectedIssue(tileLabel); // We pass the label (e.g. "No Heat") to the wizard
    setCurrentView('QUOTE');
  }, []);

  const goToGrid = useCallback(() => {
    setSelectedIssue(null);
    setCurrentView('GRID');
  }, []);

  // --- FETCH SANITY DATA ---
  useEffect(() => {
    const fetchTiles = async () => {
      try {
        const data = await client.fetch(`*[_type == "homepage"][0]{ heroTiles }`);
        if (data?.heroTiles) setTiles(data.heroTiles);
      } catch (error) {
        console.error('Failed to fetch tiles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTiles();
  }, []);

  // --- RENDER ---
  return (
    <main className='min-h-screen bg-[#FDF8F6] text-rose-950 selection:bg-rose-200'>
      <div className='max-w-md mx-auto min-h-screen flex flex-col relative bg-white sm:shadow-2xl sm:shadow-rose-100/50 overflow-hidden'>
        {/* --- VIEW 1: BENTO DASHBOARD --- */}
        {currentView === 'GRID' && (
          <div className='flex-1 flex flex-col animate-in fade-in duration-500'>
            {/* HEADER */}
            <header className='px-6 pt-12 pb-6 flex justify-between items-start z-10 relative'>
              <div>
                <div className='flex items-center gap-2 mb-2'>
                  <div className='w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-rose-200'>
                    <Flame size={16} fill='white' />
                  </div>
                  <span className='text-xs font-bold tracking-widest text-rose-400 uppercase'>
                    GTA Home Comfort
                  </span>
                </div>
                <h1 className='text-3xl font-light tracking-tight text-slate-800'>
                  Good Morning, <br />
                  <span className='font-semibold text-rose-500'>Toronto.</span>
                </h1>
              </div>

              {/* Menu Button */}
              <button className='p-3 rounded-full hover:bg-rose-50 transition-colors group'>
                <div className='w-6 h-4 flex flex-col justify-between items-end'>
                  <span className='w-full h-0.5 bg-rose-950 rounded-full group-hover:w-full transition-all' />
                  <span className='w-2/3 h-0.5 bg-rose-950 rounded-full group-hover:w-full transition-all' />
                  <span className='w-1/3 h-0.5 bg-rose-950 rounded-full group-hover:w-full transition-all' />
                </div>
              </button>
            </header>

            {/* DYNAMIC GRID CONTENT */}
            <div className='flex-1 px-6 pb-6 z-10 flex flex-col gap-6'>
              {/* 1. Control Tiles */}
              <div className='grid grid-cols-2 gap-3'>
                {loading ? (
                  <div className='col-span-2 text-center text-sm text-rose-300 py-10 animate-pulse'>
                    Loading controls...
                  </div>
                ) : (
                  tiles.map((tile, idx) => {
                    const IconComponent = ICON_MAP[tile.icon] || ICON_MAP['Default'];

                    // --- STYLING LOGIC (White Icon Box) ---
                    const getTheme = (variant) => {
                      switch (variant) {
                        case 'orange':
                          return {
                            card: 'bg-[#FFF8F6] border-orange-100 hover:border-orange-300 text-orange-600',
                            icon: 'text-orange-500',
                          };
                        case 'blue':
                          return {
                            card: 'bg-blue-50/50 border-blue-100 hover:border-blue-300 text-blue-600',
                            icon: 'text-blue-500',
                          };
                        case 'rose':
                          return {
                            card: 'bg-rose-50/50 border-rose-100 hover:border-rose-300 text-rose-600',
                            icon: 'text-rose-500',
                          };
                        default:
                          return {
                            card: 'bg-white border-slate-100 hover:border-slate-300 text-slate-600',
                            icon: 'text-slate-500',
                          };
                      }
                    };
                    const theme = getTheme(tile.variant);

                    return (
                      <button
                        key={idx}
                        onClick={() => handleIssueSelect(tile.label)} // ACTIVATE WIZARD
                        className={`
                          ${tile.layout || 'col-span-1'} 
                          group relative p-5 rounded-[32px] border transition-all duration-300 
                          hover:shadow-lg hover:shadow-rose-100/20 hover:-translate-y-1 active:scale-95
                          flex flex-col justify-between h-36
                          ${theme.card}
                        `}
                      >
                        <div className='flex justify-between items-start w-full'>
                          {/* Icon Box: Always White */}
                          <div
                            className={`
                            w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center
                            transition-transform group-hover:scale-110 duration-300
                          `}
                          >
                            <IconComponent size={20} strokeWidth={2.5} className={theme.icon} />
                          </div>

                          <ArrowRight
                            size={18}
                            className={`opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${theme.icon}`}
                          />
                        </div>
                        <span className='font-bold text-left text-lg tracking-tight leading-none'>
                          {tile.label}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* 2. Review Carousel */}
              <div className='h-48 shrink-0'>
                <ReviewCarousel />
              </div>

              {/* 3. RESTORED CONTENT SECTIONS */}
              {/* We wrap this in a div to ensure it fits the mobile width properly */}
              <div className='mt-4 pb-12 border-t border-rose-100/50 pt-8'>
                <ContentSections />
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW 2: SMART QUOTE WIZARD --- */}
        {currentView === 'QUOTE' && (
          <div className='flex-1 z-20 bg-white animate-in slide-in-from-right duration-300'>
            {/* Simple Back Button Wrapper */}
            <div className='p-6'>
              <SmartQuote issueType={selectedIssue} onBack={goToGrid} />
            </div>
          </div>
        )}

        {/* Background Gradient */}
        <div className='absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-rose-50/50 to-transparent pointer-events-none' />
      </div>
    </main>
  );
}
