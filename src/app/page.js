'use client';
import { client } from '@/sanity/lib/client'; // (Check path matches your file)
import { useCallback, useState, useEffect, useRef } from 'react';
import { Flame, Snowflake, Volume2, Droplets, Wrench, AlertTriangle, Star } from 'lucide-react';

// COMPONENTS
import ControlTile from './components/ControlTile';
import SmartQuote from './components/SmartQuote';
import ContentSections from './components/ContentSections';

// VIEW STATES
const VIEW = { GRID: 'GRID', QUOTE: 'QUOTE' };

// ISSUE TYPES
const ISSUE = {
  NO_HEAT: 'NO_HEAT',
  NO_COOL: 'NO_COOL',
  NOISE: 'NOISE',
  LEAK: 'LEAK',
  MAINTENANCE: 'MAINTENANCE',
  OTHER: 'OTHER',
};

// IMAGES
const IMAGES = {
  HEAT: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600',
  COOL: 'https://images.unsplash.com/photo-1482686115713-0fbcaced6e28?auto=format&fit=crop&q=80&w=600',
  WATER:
    'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&q=80&w=600',
  TOOLS:
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=600',
  NOISE:
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600',
  OTHER:
    'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=600',
};

// SAMPLE REVIEWS DATA
const SAMPLE_REVIEWS = [];

// --- INTERNAL COMPONENT: Draggable Review Carousel (FIXED LAYOUT) ---
function ReviewCarousel() {
  // --- STATE ---
  const [reviews, setReviews] = useState([]); // Stores the real data from Sanity
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);

  const containerRef = useRef(null);

  // --- FETCH REVIEWS FROM SANITY ---
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

  // Use real reviews if we have them, otherwise show a "Loading" placeholder
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

  // --- AUTO PLAY LOGIC ---
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeReviews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isDragging, activeReviews.length]);

  // --- DRAG HANDLERS ---
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
      {/* HEADER: Static */}
      <div className='absolute top-5 left-5 z-10 pointer-events-none'>
        <div className='text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-3'>
          See what our customers are saying
        </div>
      </div>

      {/* TRACK CONTAINER */}
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

              {/* Metadata */}
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

      {/* FOOTER: Controls */}
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
// Map Sanity strings to your Lucide components
const ICON_MAP = {
  Flame: Flame,
  Snowflake: Snowflake,
  Volume2: Volume2, // Matches "No Heat/Noise" usually
  Droplets: Droplets,
  Wrench: Wrench, // Matches "Maintenance"
  AlertTriangle: AlertTriangle, // Matches "Emergency"
  Star: Star,
  Default: ArrowRight,
};

export default function Home() {
  const [tiles, setTiles] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <button className='p-3 rounded-full hover:bg-rose-50 transition-colors group'>
            <div className='w-6 h-4 flex flex-col justify-between items-end'>
              <span className='w-full h-0.5 bg-rose-950 rounded-full group-hover:w-full transition-all' />
              <span className='w-2/3 h-0.5 bg-rose-950 rounded-full group-hover:w-full transition-all' />
              <span className='w-1/3 h-0.5 bg-rose-950 rounded-full group-hover:w-full transition-all' />
            </div>
          </button>
        </header>

        {/* DYNAMIC GRID */}
        <div className='flex-1 px-6 pb-6 z-10 flex flex-col gap-6'>
          <div className='grid grid-cols-2 gap-3'>
            {loading ? (
              <div className='col-span-2 text-center text-sm text-rose-300 py-10 animate-pulse'>
                Loading controls...
              </div>
            ) : (
              tiles.map((tile, idx) => {
                const IconComponent = ICON_MAP[tile.icon] || ICON_MAP['Default'];

                const getColorStyles = (variant) => {
                  switch (variant) {
                    case 'orange':
                      return 'bg-orange-50 text-orange-600 border-orange-100 hover:border-orange-300';
                    case 'blue':
                      return 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300';
                    case 'rose':
                      return 'bg-rose-50 text-rose-600 border-rose-100 hover:border-rose-300';
                    default:
                      return 'bg-slate-50 text-slate-600 border-slate-100 hover:border-slate-300';
                  }
                };

                return (
                  <button
                    key={idx}
                    className={`${tile.layout || 'col-span-1'} group relative p-5 rounded-[28px] border transition-all duration-300 hover:shadow-lg hover:shadow-rose-100/50 hover:-translate-y-1 active:scale-95 flex flex-col justify-between h-32 ${getColorStyles(tile.variant)}`}
                  >
                    <div className='flex justify-between items-start w-full'>
                      <div
                        className={`p-2.5 rounded-2xl bg-white shadow-sm transition-colors ${getColorStyles(tile.variant)}`}
                      >
                        <IconComponent size={20} strokeWidth={2.5} />
                      </div>
                      <ArrowRight
                        size={16}
                        className='opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300'
                      />
                    </div>
                    <span className='font-semibold text-left text-lg leading-tight'>
                      {tile.label}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div className='h-48'>
            <ReviewCarousel />
          </div>
        </div>

        <div className='absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-rose-50/50 to-transparent pointer-events-none' />
      </div>
    </main>
  );
}
