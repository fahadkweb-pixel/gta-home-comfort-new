'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { client } from '@/sanity/lib/client';
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

// --- IMPORTS FOR YOUR OTHER COMPONENTS ---
// Ensure these files exist in your components folder!
import SmartQuote from './components/SmartQuote';
import ContentSections from './components/ContentSections';

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

// --- MAIN PAGE COMPONENT ---
export default function Home() {
  // Data State
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // View State
  const [currentView, setCurrentView] = useState('GRID'); // 'GRID' or 'QUOTE'
  const [selectedIssue, setSelectedIssue] = useState(null);

  // --- ACTIONS ---
  const handleIssueSelect = useCallback((tileLabel) => {
    setSelectedIssue(tileLabel);
    setCurrentView('QUOTE');
  }, []);

  const goToGrid = useCallback(() => {
    setSelectedIssue(null);
    setCurrentView('GRID');
  }, []);

  // --- FETCH TILES ---
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

  return (
    <main className='min-h-screen bg-[#FDF8F6] text-rose-950 selection:bg-rose-200'>
      <div className='max-w-md mx-auto min-h-screen flex flex-col relative bg-white sm:shadow-2xl sm:shadow-rose-100/50 overflow-hidden'>
        {/* --- VIEW 1: DASHBOARD --- */}
        {currentView === 'GRID' && (
          <div className='flex-1 flex flex-col animate-in fade-in duration-500'>
            {/* Header */}
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
              <button className='p-3 rounded-full hover:bg-rose-50 transition-colors group'>
                <div className='w-6 h-4 flex flex-col justify-between items-end'>
                  <span className='w-full h-0.5 bg-rose-950 rounded-full group-hover:w-full transition-all' />
                  <span className='w-2/3 h-0.5 bg-rose-950 rounded-full group-hover:w-full transition-all' />
                  <span className='w-1/3 h-0.5 bg-rose-950 rounded-full group-hover:w-full transition-all' />
                </div>
              </button>
            </header>

            {/* Dynamic Content */}
            <div className='flex-1 px-6 pb-6 z-10 flex flex-col gap-6'>
              {/* Control Grid */}
              <div className='grid grid-cols-2 gap-3'>
                {loading ? (
                  <div className='col-span-2 text-center text-sm text-rose-300 py-10 animate-pulse'>
                    Loading controls...
                  </div>
                ) : (
                  tiles.map((tile, idx) => {
                    const IconComponent = ICON_MAP[tile.icon] || ICON_MAP['Default'];

                    // Theme Logic
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
                        onClick={() => handleIssueSelect(tile.label)}
                        className={`
                          ${tile.layout || 'col-span-1'} 
                          group relative p-5 rounded-[32px] border transition-all duration-300 
                          hover:shadow-lg hover:shadow-rose-100/20 hover:-translate-y-1 active:scale-95
                          flex flex-col justify-between h-36
                          ${theme.card}
                        `}
                      >
                        <div className='flex justify-between items-start w-full'>
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

              {/* Dynamic Review Carousel */}
              <div className='h-48 shrink-0'>
                <ReviewCarousel />
              </div>

              {/* Old Content Sections */}
              <div className='mt-4 pb-12 border-t border-rose-100/50 pt-8'>
                <ContentSections />
              </div>
            </div>
          </div>
        )}

        {/* --- VIEW 2: SMART QUOTE --- */}
        {currentView === 'QUOTE' && (
          <div className='flex-1 z-20 bg-white animate-in slide-in-from-right duration-300'>
            <div className='p-6'>
              {/* Note: We pass the Tile Label (e.g. "No Heat") as the issueType */}
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

// --- DYNAMIC CAROUSEL COMPONENT (Lives here now) ---
function ReviewCarousel() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);

  const containerRef = useRef(null);

  // Fetch real reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await client.fetch(`*[_type == "review"]{
          "id": _id,
          author,
          stars,
          text,
          date
        }`);
        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  // Use real reviews or loading state
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

  // Auto-play
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeReviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isDragging, activeReviews.length]);

  // Drag Logic
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
    const movePercent = (diff / containerWidth) * 100;
    setCurrentTranslate(movePercent);
  };

  const onPointerUp = () => {
    setIsDragging(false);
    if (containerRef.current) containerRef.current.style.transition = 'transform 0.5s ease-out';
    const threshold = 20;
    if (currentTranslate < -threshold) {
      setCurrentIndex((prev) => (prev + 1) % activeReviews.length);
    } else if (currentTranslate > threshold) {
      setCurrentIndex((prev) => (prev === 0 ? activeReviews.length - 1 : prev - 1));
    }
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
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${currentTranslate}%))`,
          }}
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
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-4 bg-rose-400' : 'w-1.5 bg-rose-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
