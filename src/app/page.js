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
} from 'lucide-react';

import SmartQuote from './components/SmartQuote';
import ContentSections from './components/ContentSections';

// SEO Metadata (Optional - you can move this to layout.js if preferred)
export const metadata = {
  title: 'Toronto HVAC, Furnace & AC Repair | GTA Home Comfort',
  description:
    'Expert heating and cooling services in Toronto & the GTA. Fast repairs for furnaces, AC, and water heaters. Start your free Smart Quote online today.',
};

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

                    const getTheme = (variant) => {
                      switch (variant) {
                        case 'orange':
                          return {
                            card: 'bg-[#FFF8F6] border-orange-100 hover:border-orange-300',
                            icon: 'text-orange-500',
                            gradient: 'from-orange-50/80',
                          };
                        case 'blue':
                          return {
                            card: 'bg-blue-50/50 border-blue-100 hover:border-blue-300',
                            icon: 'text-blue-500',
                            gradient: 'from-blue-50/80',
                          };
                        case 'rose':
                          return {
                            card: 'bg-rose-50/50 border-rose-100 hover:border-rose-300',
                            icon: 'text-rose-500',
                            gradient: 'from-rose-50/80',
                          };
                        case 'cyan':
                          return {
                            card: 'bg-cyan-50/50 border-cyan-100 hover:border-cyan-300',
                            icon: 'text-cyan-500',
                            gradient: 'from-cyan-50/80',
                          };
                        case 'purple':
                          return {
                            card: 'bg-purple-50/50 border-purple-100 hover:border-purple-300',
                            icon: 'text-purple-500',
                            gradient: 'from-purple-50/80',
                          };
                        case 'amber':
                          return {
                            card: 'bg-amber-50/50 border-amber-100 hover:border-amber-300',
                            icon: 'text-amber-500',
                            gradient: 'from-amber-50/80',
                          };
                        default:
                          return {
                            card: 'bg-white border-slate-100 hover:border-slate-300',
                            icon: 'text-slate-500',
                            gradient: 'from-white/80',
                          };
                      }
                    };
                    const theme = getTheme(tile.variant);
                    const isTall = tile.layout?.includes('row-span-2');
                    const heightClass = isTall ? 'h-72 md:h-96' : 'h-36 md:h-44';

                    const getTextColor = (colorOption) => {
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
                    const fontWeight = tile.labelBold === false ? 'font-medium' : 'font-semibold';

                    return (
                      <button
                        key={idx}
                        onClick={() => handleIssueSelect(tile.label)}
                        className={`
                          ${tile.layout || 'col-span-1'} 
                          group relative p-5 rounded-[32px] border transition-all duration-300 
                          hover:shadow-lg hover:shadow-rose-100/20 hover:-translate-y-1 active:scale-95
                          flex flex-col justify-between ${heightClass} overflow-hidden
                          ${theme.card}
                        `}
                      >
                        {tile.backgroundImage && (
                          <>
                            <div className='absolute inset-0 z-0'>
                              <img
                                src={urlFor(tile.backgroundImage).width(800).url()}
                                alt={tile.label}
                                className='w-full h-full object-cover opacity-100 transition-transform duration-700 group-hover:scale-105'
                              />
                            </div>
                            <div
                              className={`absolute inset-0 z-0 bg-gradient-to-t ${theme.gradient} via-white/20 to-transparent`}
                            />
                          </>
                        )}

                        <div className='relative z-10 flex justify-between items-start w-full'>
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

                        <div className='relative z-10 text-left'>
                          {/* UPDATED FONT SIZES HERE */}
                          <span
                            className={`block ${fontWeight} text-lg md:text-2xl tracking-tight leading-none transition-colors drop-shadow-sm ${textStyle.main}`}
                          >
                            {tile.label}
                          </span>

                          {tile.subtitle && (
                            <span
                              className={`block mt-1.5 text-[13px] md:text-base font-medium tracking-normal transition-colors ${textStyle.sub}`}
                            >
                              {tile.subtitle}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              <div className='h-48 shrink-0'>
                <ReviewCarousel />
              </div>

              <div className='mt-4 pb-12 border-t border-rose-100/50 pt-8'>
                <ContentSections />
              </div>
            </div>
          </div>
        )}

        {currentView === 'QUOTE' && (
          <div className='flex-1 z-20 bg-white animate-in slide-in-from-right duration-300 rounded-3xl shadow-2xl min-h-[600px]'>
            <div className='p-6'>
              <SmartQuote issueType={selectedIssue} onBack={goToGrid} />
            </div>
          </div>
        )}

        <div className='absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-rose-50/50 to-transparent pointer-events-none' />
      </div>
    </main>
  );
}

// ... ReviewCarousel ...
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
      className='w-full h-full p-5 rounded-[32px] bg-white/40 border border-rose-100/50 backdrop-blur-sm flex flex-col justify-between group hover:bg-white/60 transition-all shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing overflow-hidden relative select-none'
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
    >
      <div className='absolute top-5 left-5 z-10 pointer-events-none'>
        <div className='text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-3'>
          See what our customers are saying
        </div>
      </div>
      <div className='flex-1 relative mt-6 overflow-hidden'>
        <div
          ref={containerRef}
          className='flex h-full w-full transition-transform duration-500 ease-out'
          style={{ transform: `translateX(calc(-${currentIndex * 100}% + ${currentTranslate}%))` }}
        >
          {activeReviews.map((review) => (
            <div key={review.id} className='min-w-full h-full flex flex-col justify-end px-1 pb-6'>
              <div className='mb-auto pt-2'>
                <div className='flex gap-0.5 mb-2'>
                  {[...Array(review.stars || 5)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-4 h-4 text-orange-400 fill-orange-400 drop-shadow-sm'
                    />
                  ))}
                </div>
                <p className='text-rose-950/90 italic font-medium leading-relaxed line-clamp-2 select-none pointer-events-none'>
                  "{review.text}"
                </p>
              </div>
              <div className='mt-2 pointer-events-none'>
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
      <div className='absolute bottom-5 left-5 right-5 flex justify-between items-end pointer-events-none'>
        <div className='text-[10px] font-medium text-rose-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity'>
          Drag to slide
        </div>
        <div className='flex gap-1.5'>
          {activeReviews.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-rose-400' : 'w-1.5 bg-rose-200'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
