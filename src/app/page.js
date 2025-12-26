'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import {
  Flame,
  Snowflake,
  Volume2,
  Droplets,
  Wrench,
  AlertTriangle,
  Star,
  ArrowRight,
  Fan,
  Wind,
} from 'lucide-react';

import SmartQuote from './components/SmartQuote';
import ContentSections from './components/ContentSections';
import HomepageReviews from './components/HomepageReviews';

const ICON_MAP = {
  Flame: Flame,
  Snowflake: Snowflake,
  Volume2: Volume2,
  Droplets: Droplets,
  Wrench: Wrench,
  AlertTriangle: AlertTriangle,
  Star: Star,
  Fan: Fan,
  Wind: Wind,
  Default: ArrowRight,
};

function HomeContent() {
  const [pageData, setPageData] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('GRID');
  const [selectedIssue, setSelectedIssue] = useState(null);

  const quoteRef = useRef(null);
  // Ref to track if we've processed the initial load deep link
  const deepLinkProcessed = useRef(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  // --- CHECK URL ON LOAD & NAVIGATION ---
  useEffect(() => {
    const mode = searchParams.get('mode');
    const source = searchParams.get('source');
    const view = searchParams.get('view');

    // 1. Handle Legacy Deep Links (mode=...) - typically only on first load or external link
    if (mode) {
      if (mode === 'install') {
        setSelectedIssue('New Installation');
        setCurrentView('QUOTE');
      } else if (mode === 'repair') {
        const labelMap = {
          heating: 'Heating System',
          cooling: 'Cooling System',
          water: 'Hot Water',
          'air-quality': 'Air Quality',
        };
        setSelectedIssue(labelMap[source] || 'General Repair');
        setCurrentView('QUOTE');
      }
      deepLinkProcessed.current = true;
    }
    // 2. Handle View State via URL (e.g. ?view=quote)
    else if (view === 'quote') {
      setCurrentView('QUOTE');
    }
    // 3. Default: Reset to GRID if no known params
    else {
      // Only reset if we aren't already in GRID to avoid unnecessary renders
      if (currentView !== 'GRID') {
        setSelectedIssue(null);
        setCurrentView('GRID');
      }
    }
  }, [searchParams, currentView]);

  // --- SCROLL LOGIC ---
  useEffect(() => {
    if (currentView === 'QUOTE' && quoteRef.current) {
      setTimeout(() => {
        quoteRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }, 100);
    } else if (currentView === 'GRID') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentView]);

  const handleIssueSelect = useCallback(
    (tileLabel) => {
      // 1. Set the specific issue data
      setSelectedIssue(tileLabel);
      // 2. Push URL state. The useEffect above will detect this change and switch currentView to 'QUOTE'.
      router.push('/?view=quote', { scroll: false });
    },
    [router]
  );

  const goToGrid = useCallback(() => {
    // Navigate back to root. The useEffect will detect missing params and switch currentView to 'GRID'.
    router.replace('/', { scroll: false });
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`*[_type == "homepage" && _id == "homepage"][0]{
          heading,
          subheading,
          description,  
          headerAlignment,
          desktopGridCols, 
          heroTiles[]{
            ...,
            backgroundImage,
            textColor,
            labelBold 
          },
          aboutSection{ image, imageAlt }
        }`);
        if (data) {
          setPageData(data);
          setTiles(data.heroTiles || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='max-w-5xl mx-auto min-h-screen flex flex-col relative bg-transparent overflow-x-hidden'>
      {currentView === 'GRID' && (
        <div className='flex-1 flex flex-col animate-in fade-in duration-500'>
          {/* --- HEADER --- */}
          <header
            className={`px-6 pt-16 pb-8 flex flex-col justify-center z-10 relative ${pageData?.headerAlignment || 'text-left'}`}
          >
            {loading ? (
              // LOADING SKELETON: Prevents text flash
              <div className='space-y-4 max-w-2xl'>
                <div className='h-12 w-3/4 bg-slate-200 animate-pulse rounded-lg' />
                <div className='h-12 w-1/2 bg-slate-200 animate-pulse rounded-lg' />
                <div className='h-6 w-full bg-slate-100 animate-pulse rounded-lg mt-4' />
              </div>
            ) : (
              <>
                <h1 className='text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]'>
                  {pageData?.heading || 'Good Morning,'} <br />
                  <span className='text-rose-500'>{pageData?.subheading || 'Toronto.'}</span>
                </h1>
                {pageData?.description && (
                  <p className='text-xl md:text-2xl text-slate-600 max-w-2xl leading-relaxed font-medium opacity-90'>
                    {pageData.description}
                  </p>
                )}
              </>
            )}
          </header>

          {/* --- CONTROL GRID --- */}
          <div className='flex-1 px-6 pb-6 z-10 flex flex-col gap-6'>
            <div
              className={`grid grid-cols-2 ${pageData?.desktopGridCols || 'md:grid-cols-4'} gap-3 md:gap-4 auto-rows-min`}
            >
              {loading
                ? // SKELETON LOADER: Prevents layout shift
                  Array(8)
                    .fill(null)
                    .map((_, i) => (
                      <div
                        key={i}
                        className='h-60 md:h-72 rounded-[32px] bg-slate-100 animate-pulse border border-slate-200'
                      />
                    ))
                : tiles.map((tile, idx) => {
                    const IconComponent = ICON_MAP[tile.icon] || ICON_MAP['Default'];
                    const getTheme = (variant) => {
                      const baseCard = 'bg-white border-slate-200 hover:border-slate-300';
                      switch (variant) {
                        case 'orange':
                          return {
                            card: baseCard,
                            iconBox: 'bg-orange-100 text-orange-600',
                            iconText: 'text-orange-600',
                          };
                        case 'blue':
                          return {
                            card: baseCard,
                            iconBox: 'bg-blue-100 text-blue-600',
                            iconText: 'text-blue-600',
                          };
                        case 'rose':
                          return {
                            card: baseCard,
                            iconBox: 'bg-rose-100 text-rose-600',
                            iconText: 'text-rose-600',
                          };
                        case 'cyan':
                          return {
                            card: baseCard,
                            iconBox: 'bg-cyan-100 text-cyan-600',
                            iconText: 'text-cyan-600',
                          };
                        case 'purple':
                          return {
                            card: baseCard,
                            iconBox: 'bg-purple-100 text-purple-600',
                            iconText: 'text-purple-600',
                          };
                        case 'amber':
                          return {
                            card: baseCard,
                            iconBox: 'bg-amber-100 text-amber-600',
                            iconText: 'text-amber-600',
                          };
                        default:
                          return {
                            card: baseCard,
                            iconBox: 'bg-slate-100 text-slate-600',
                            iconText: 'text-slate-600',
                          };
                      }
                    };
                    const theme = getTheme(tile.variant);
                    const isTall = tile.layout?.includes('row-span-2');
                    const heightClass = isTall ? 'h-80 md:h-96' : 'h-60 md:h-72';
                    const fontWeight = tile.labelBold === false ? 'font-medium' : 'font-semibold';
                    const forceDarkText = !!tile.backgroundImage;
                    const getTextColor = (colorOption) => {
                      if (forceDarkText) return { main: 'text-slate-900', sub: 'text-slate-500' };
                      switch (colorOption) {
                        case 'light':
                          return { main: 'text-white', sub: 'text-slate-100/90' };
                        case 'rose':
                          return { main: 'text-rose-600', sub: 'text-rose-400' };
                        case 'blue':
                          return { main: 'text-blue-600', sub: 'text-blue-400' };
                        default:
                          return { main: 'text-slate-900', sub: 'text-slate-500' };
                      }
                    };
                    const textStyle = getTextColor(tile.textColor);

                    return (
                      <button
                        key={idx}
                        onClick={() => handleIssueSelect(tile.label)}
                        className={`
                          ${tile.layout || 'col-span-1'} 
                          group relative rounded-[32px] border transition-all duration-300 
                          hover:shadow-lg hover:shadow-rose-100/20 hover:-translate-y-1 active:scale-95
                          overflow-hidden flex flex-col text-left
                          ${theme.card} ${heightClass}
                        `}
                      >
                        {tile.backgroundImage ? (
                          <>
                            <div className='relative h-[60%] w-full overflow-hidden bg-white'>
                              <Image
                                src={urlFor(tile.backgroundImage).width(1200).url()}
                                alt={tile.label}
                                fill
                                priority={idx === 0}
                                sizes='(max-width: 768px) 50vw, 25vw'
                                className='object-cover transition-transform duration-700 group-hover:scale-105'
                              />
                              <div className='absolute top-4 left-4 z-10'>
                                <div className='w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-sm shadow-sm flex items-center justify-center border border-slate-100'>
                                  <IconComponent
                                    size={20}
                                    strokeWidth={2.5}
                                    className={theme.iconText}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className='relative h-[40%] w-full px-5 flex flex-col justify-center bg-inherit border-t border-slate-50'>
                              <span
                                className={`block ${fontWeight} text-lg md:text-xl tracking-tight leading-none ${textStyle.main}`}
                              >
                                {tile.label}
                              </span>
                              {tile.subtitle && (
                                <span
                                  className={`block mt-1.5 text-[13px] font-medium opacity-90 ${textStyle.sub}`}
                                >
                                  {tile.subtitle}
                                </span>
                              )}
                              <div className='absolute bottom-4 right-4'>
                                <ArrowRight
                                  size={16}
                                  className='text-slate-300 group-hover:text-slate-900 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300'
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className='w-full h-full p-6 flex flex-col justify-between'>
                            <div className='flex justify-between items-start w-full'>
                              <div
                                className={`w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${theme.iconBox}`}
                              >
                                <IconComponent
                                  size={24}
                                  strokeWidth={2.5}
                                  className='currentColor'
                                />
                              </div>
                              <ArrowRight
                                size={20}
                                className={`opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${theme.iconText}`}
                              />
                            </div>
                            <div>
                              <span
                                className={`block ${fontWeight} text-xl md:text-2xl tracking-tight leading-none ${textStyle.main}`}
                              >
                                {tile.label}
                              </span>
                              {tile.subtitle && (
                                <span
                                  className={`block mt-2 text-sm md:text-base font-medium ${textStyle.sub}`}
                                >
                                  {tile.subtitle}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
            </div>

            <div className='h-64 md:h-72 shrink-0 mt-2'>
              <HomepageReviews />
            </div>

            <div className='pb-12 border-t border-rose-100/50 pt-8'>
              {/* UPDATED COMPONENT: Passing data prop */}
              <ContentSections data={pageData} />
            </div>
          </div>
        </div>
      )}

      {currentView === 'QUOTE' && (
        <div
          ref={quoteRef}
          className='flex-1 z-20 animate-in slide-in-from-right duration-300 min-h-[600px] flex items-center py-10'
        >
          <div className='w-full'>
            <SmartQuote issueType={selectedIssue} onBack={goToGrid} />
          </div>
        </div>
      )}

      <div className='absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-rose-50/50 to-transparent pointer-events-none' />
    </div>
  );
}

export default function Home() {
  return (
    <main className='min-h-screen bg-[#FDF8F6] text-rose-950 selection:bg-rose-200'>
      <Suspense fallback={<div className='min-h-screen bg-[#FDF8F6]' />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
