'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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

export default function Home() {
  const [pageData, setPageData] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('GRID');
  const [selectedIssue, setSelectedIssue] = useState(null);

  const handleIssueSelect = useCallback((tileLabel) => {
    setSelectedIssue(tileLabel);
    setCurrentView('QUOTE');
  }, []);

  const goToGrid = useCallback(() => {
    setSelectedIssue(null);
    setCurrentView('GRID');
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.fetch(`*[_type == "homepage"][0]{
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
          }
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
    <main className='min-h-screen bg-[#FDF8F6] text-rose-950 selection:bg-rose-200'>
      <div className='max-w-5xl mx-auto min-h-screen flex flex-col relative bg-transparent overflow-x-hidden'>
        {currentView === 'GRID' && (
          <div className='flex-1 flex flex-col animate-in fade-in duration-500'>
            {/* --- HEADER --- */}
            <header
              className={`px-6 pt-16 pb-8 flex flex-col justify-center z-10 relative ${pageData?.headerAlignment || 'text-left'}`}
            >
              <h1 className='text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]'>
                {pageData?.heading || 'Good Morning,'} <br />
                <span className='text-rose-500'>{pageData?.subheading || 'Toronto.'}</span>
              </h1>
              {pageData?.description && (
                <p className='text-xl md:text-2xl text-slate-600 max-w-2xl leading-relaxed font-medium opacity-90'>
                  {pageData.description}
                </p>
              )}
            </header>

            {/* --- CONTROL GRID --- */}
            <div className='flex-1 px-6 pb-6 z-10 flex flex-col gap-6'>
              <div
                className={`grid grid-cols-2 ${pageData?.desktopGridCols || 'md:grid-cols-4'} gap-3 md:gap-4 auto-rows-min`}
              >
                {loading ? (
                  <div className='col-span-2 text-center text-sm text-rose-300 py-10 animate-pulse'>
                    Loading controls...
                  </div>
                ) : (
                  tiles.map((tile, idx) => {
                    const IconComponent = ICON_MAP[tile.icon] || ICON_MAP['Default'];

                    // --- THEME LOGIC: Icons get the color, Cards stay neutral ---
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

                    // --- HEIGHT LOGIC (Tightened for Mobile/Desktop balance) ---
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
                        {/* --- SCENARIO A: SPLIT CARD (Has Image) --- */}
                        {tile.backgroundImage ? (
                          <>
                            {/* TOP IMAGE AREA (60% Height - Object Cover) */}
                            <div className='relative h-[60%] w-full overflow-hidden bg-white'>
                              <img
                                src={urlFor(tile.backgroundImage).width(600).url()}
                                alt={tile.label}
                                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                              />
                              <div className='absolute top-4 left-4 z-10'>
                                {/* Image Overlay Icon: Keep white bg for contrast, apply colored text */}
                                <div className='w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-sm shadow-sm flex items-center justify-center border border-slate-100'>
                                  <IconComponent
                                    size={20}
                                    strokeWidth={2.5}
                                    className={theme.iconText}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* BOTTOM TEXT AREA (40% Height - Balanced) */}
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
                          /* --- SCENARIO B: STANDARD CARD --- */
                          <div className='w-full h-full p-6 flex flex-col justify-between'>
                            <div className='flex justify-between items-start w-full'>
                              {/* Standard Icon: Apply the colored box style here */}
                              <div
                                className={`
                                w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center
                                transition-transform group-hover:scale-110 duration-300
                                ${theme.iconBox}
                              `}
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
                  })
                )}
              </div>

              <div className='h-64 md:h-56 shrink-0'>
                <ReviewCarousel />
              </div>
              <div className='mt-4 pb-12 border-t border-rose-100/50 pt-8'>
                <ContentSections />
              </div>
            </div>
          </div>
        )}

        {/* FIX APPLIED: Removed bg-white, rounded-3xl, shadow-2xl to fix double-box issue */}
        {currentView === 'QUOTE' && (
          <div className='flex-1 z-20 animate-in slide-in-from-right duration-300 min-h-[600px] flex items-center'>
            <div className='w-full'>
              <SmartQuote issueType={selectedIssue} onBack={goToGrid} />
            </div>
          </div>
        )}

        <div className='absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-rose-50/50 to-transparent pointer-events-none' />
      </div>
    </main>
  );
}

// --- REVIEW CAROUSEL COMPONENT ---

function ReviewCarousel() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "review"]{ "id": _id, author, stars, text, date }`
        );
        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  const activeReviews =
    reviews.length > 0
      ? reviews
      : [
          {
            id: 'loading',
            text: 'Loading latest reviews...',
            author: 'GTA Home Comfort',
            stars: 5,
            date: '...',
          },
        ];

  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeReviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isDragging, activeReviews.length]);

  const onPointerDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || e.touches[0].clientX);
    if (containerRef.current) containerRef.current.style.transition = 'none';
  };
  const onPointerMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX || e.touches[0].clientX;
    const diff = currentX - startX;
    const containerWidth = containerRef.current?.offsetWidth || 1;
    setCurrentTranslate((diff / containerWidth) * 100);
  };
  const onPointerUp = () => {
    setIsDragging(false);
    if (containerRef.current) containerRef.current.style.transition = 'transform 0.5s ease-out';
    if (currentTranslate < -20) setCurrentIndex((prev) => (prev + 1) % activeReviews.length);
    else if (currentTranslate > 20)
      setCurrentIndex((prev) => (prev === 0 ? activeReviews.length - 1 : prev - 1));
    setCurrentTranslate(0);
  };

  return (
    <div
      className='w-full h-full p-5 rounded-[32px] bg-white/40 border border-rose-100/50 backdrop-blur-sm relative group hover:bg-white/60 transition-all shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing overflow-hidden select-none'
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
    >
      {/* HEADER: Absolute Top Left */}
      <div className='absolute top-5 left-5 z-20 pointer-events-none'>
        <div className='text-[10px] font-bold text-rose-400 uppercase tracking-widest'>
          See what our customers are saying
        </div>
      </div>

      {/* CAROUSEL CONTAINER */}
      <div className='h-full w-full overflow-hidden'>
        <div
          ref={containerRef}
          className='flex h-full w-full transition-transform duration-500 ease-out'
          style={{ transform: `translateX(calc(-${currentIndex * 100}% + ${currentTranslate}%))` }}
        >
          {activeReviews.map((review) => (
            <div key={review.id} className='min-w-full h-full flex flex-col px-1 relative'>
              {/* CONTENT: Padded from top (pt-12) to clear header, and NO justify-end */}
              <div className='flex-1 flex flex-col justify-center pt-8 pb-4'>
                <div className='flex gap-0.5 mb-3'>
                  {[...Array(review.stars || 5)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-4 h-4 text-orange-400 fill-orange-400 drop-shadow-sm'
                    />
                  ))}
                </div>
                <p className='text-rose-950/90 italic font-medium leading-relaxed line-clamp-3 select-none pointer-events-none text-lg md:text-base'>
                  "{review.text}"
                </p>
              </div>

              {/* AUTHOR: Pinned to bottom */}
              <div className='mt-auto pointer-events-none pb-4'>
                <div className='text-xs font-bold text-rose-400 uppercase tracking-wider truncate'>
                  {review.author}
                </div>
                <div className='text-xs text-rose-300 truncate'>
                  Verified Customer • {review.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SLIDE INDICATORS */}
      <div className='absolute bottom-5 right-5 flex gap-1.5 pointer-events-none z-20'>
        {activeReviews.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-rose-400' : 'w-1.5 bg-rose-200'}`}
          />
        ))}
      </div>
    </div>
  );
}
