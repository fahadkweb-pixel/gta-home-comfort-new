'use client';

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
const SAMPLE_REVIEWS = [
  {
    id: 1,
    author: 'Sarah M.',
    text: "They didn't try to sell me a new furnace. Fixed a $20 part and left. Honest guys.",
    date: '2 days ago',
  },
  {
    id: 2,
    author: 'David K.',
    text: 'Woke up to no heat at 3am. Tech was here by 4:15am. Incredible service.',
    date: '1 week ago',
  },
  {
    id: 3,
    author: 'Priya R.',
    text: 'Love the digital quote system. No surprises. The tech was super polite too.',
    date: '2 weeks ago',
  },
  {
    id: 4,
    author: 'Mark T.',
    text: 'My A/C died during the heatwave. They were the only ones who picked up. Lifesavers.',
    date: 'Last month',
  },
];

// --- INTERNAL COMPONENT: Draggable Review Carousel (FIXED LAYOUT) ---
function ReviewCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);

  const containerRef = useRef(null);

  // --- AUTO PLAY LOGIC ---
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SAMPLE_REVIEWS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isDragging]);

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
      setCurrentIndex((prev) => (prev + 1) % SAMPLE_REVIEWS.length);
    } else if (currentTranslate > threshold) {
      setCurrentIndex((prev) => (prev === 0 ? SAMPLE_REVIEWS.length - 1 : prev - 1));
    }
    setCurrentTranslate(0);
  };

  return (
    <div
      // FIX 1: Reduced padding from p-6 to p-5 to gain vertical space
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
      {/* FIX 2: Reduced mt-8 to mt-6 */}
      <div className='flex-1 relative mt-6 overflow-hidden'>
        <div
          ref={containerRef}
          className='flex h-full w-full transition-transform duration-500 ease-out'
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${currentTranslate}%))`,
          }}
        >
          {SAMPLE_REVIEWS.map((review) => (
            <div
              key={review.id}
              // FIX 3: Changed justify-center to justify-end (or between) and reduced pb-8 to pb-6
              className='min-w-full h-full flex flex-col justify-end px-1 pb-6'
            >
              <div className='mb-auto pt-2'>
                <div className='flex gap-0.5 mb-2'>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className='w-4 h-4 text-orange-400 fill-orange-400 drop-shadow-sm'
                    />
                  ))}
                </div>
                {/* FIX 4: Changed line-clamp-3 to line-clamp-2 to prevent overflow clipping */}
                <p className='text-rose-950/90 italic font-medium leading-relaxed line-clamp-2 select-none pointer-events-none'>
                  "{review.text}"
                </p>
              </div>

              {/* Metadata inside the slide */}
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
          {SAMPLE_REVIEWS.map((_, idx) => (
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

export default function Home() {
  const [currentView, setCurrentView] = useState(VIEW.GRID);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const handleIssueSelect = useCallback((issue) => {
    setSelectedIssue(issue);
    setCurrentView(VIEW.QUOTE);
  }, []);

  const goToGrid = useCallback(() => {
    setSelectedIssue(null);
    setCurrentView(VIEW.GRID);
  }, []);

  return (
    <main className='relative min-h-[calc(100vh-80px)] w-full overflow-x-hidden'>
      {/* Background Ambience */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-400/10 rounded-full blur-[120px] pointer-events-none' />

      <div className='container mx-auto px-4 pb-12 pt-6 md:pt-12 max-w-5xl'>
        {/* VIEW: BENTO GRID DASHBOARD */}
        {currentView === VIEW.GRID && (
          <div className='animate-in fade-in slide-in-from-bottom-8 duration-700'>
            {/* 1. HEADER */}
            <div className='text-center mb-10 md:mb-12 space-y-4'>
              <h1 className='text-4xl md:text-7xl font-bold text-rose-950 tracking-tighter'>
                Servicing your home, <br></br>
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500'>
                  the GTA way.
                </span>
              </h1>

              <p className='text-lg md:text-xl text-rose-900/60 max-w-2xl mx-auto leading-relaxed'>
                Select an issue below to start your service request. We'll diagnose the problem and
                get a technician to your door.
              </p>
            </div>

            {/* 2. THE BENTO GRID */}
            <div className='w-full grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[160px] md:auto-rows-[180px]'>
              {/* PRIMARY: No Heat (2x2) */}
              <div className='col-span-2 row-span-2'>
                <ControlTile
                  variant='primary'
                  icon={<Flame />}
                  label='Emergency: No Heat'
                  sub='Furnace / Boiler / Heat Pump'
                  imageSrc={IMAGES.HEAT}
                  onClick={() => handleIssueSelect(ISSUE.NO_HEAT)}
                />
              </div>

              {/* No Cooling */}
              <div className='col-span-1 row-span-1'>
                <ControlTile
                  icon={<Snowflake />}
                  label='No Cooling'
                  sub='A/C Failure'
                  imageSrc={IMAGES.COOL}
                  onClick={() => handleIssueSelect(ISSUE.NO_COOL)}
                />
              </div>

              {/* Water Leak */}
              <div className='col-span-1 row-span-1'>
                <ControlTile
                  icon={<Droplets />}
                  label='Water Leak'
                  sub='Active Leaks'
                  imageSrc={IMAGES.WATER}
                  onClick={() => handleIssueSelect(ISSUE.LEAK)}
                />
              </div>

              {/* Maintenance (Wide) */}
              <div className='col-span-2 row-span-1'>
                <ControlTile
                  variant='warning'
                  icon={<Wrench />}
                  label='System Maintenance'
                  sub='Schedule Tune-up'
                  imageSrc={IMAGES.TOOLS}
                  onClick={() => handleIssueSelect(ISSUE.MAINTENANCE)}
                />
              </div>

              {/* Noise */}
              <div className='col-span-1 row-span-1'>
                <ControlTile
                  icon={<Volume2 />}
                  label='Noise'
                  sub='Clunking / Whirring'
                  imageSrc={IMAGES.NOISE}
                  onClick={() => handleIssueSelect(ISSUE.NOISE)}
                />
              </div>

              {/* Other */}
              <div className='col-span-1 row-span-1'>
                <ControlTile
                  icon={<AlertTriangle />}
                  label='Other Issue'
                  sub='General Inquiry'
                  imageSrc={IMAGES.OTHER}
                  onClick={() => handleIssueSelect(ISSUE.OTHER)}
                />
              </div>

              {/* REVIEW CAROUSEL */}
              <div className='col-span-2 md:col-span-2 row-span-1'>
                <ReviewCarousel />
              </div>
            </div>

            {/* 3. CONTENT SECTIONS */}
            <div className='mt-12 md:mt-16'>
              <ContentSections />
            </div>
          </div>
        )}

        {/* VIEW: SMART QUOTE WIZARD */}
        {currentView === VIEW.QUOTE && (
          <div className='max-w-2xl mx-auto w-full'>
            <SmartQuote issueType={selectedIssue} onBack={goToGrid} />
          </div>
        )}
      </div>
    </main>
  );
}
