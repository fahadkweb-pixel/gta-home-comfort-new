'use client';

import { useState, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import { client } from '@/sanity/lib/client';

export default function ReviewCarousel() {
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
            text: 'Loading reviews...',
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
      className='w-full h-full min-h-[250px] p-8 rounded-[32px] bg-white border border-rose-100 shadow-lg hover:shadow-xl transition-all cursor-grab active:cursor-grabbing overflow-hidden select-none relative'
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
    >
      <div className='absolute top-6 left-8 z-20 pointer-events-none'>
        <div className='text-[10px] font-bold text-rose-400 uppercase tracking-widest'>
          Recent Feedback
        </div>
      </div>

      <div className='h-full w-full overflow-hidden flex flex-col justify-center'>
        <div
          ref={containerRef}
          className='flex h-full w-full transition-transform duration-500 ease-out items-center'
          style={{ transform: `translateX(calc(-${currentIndex * 100}% + ${currentTranslate}%))` }}
        >
          {activeReviews.map((review) => (
            <div key={review.id} className='min-w-full flex flex-col px-1'>
              <div className='flex gap-1 mb-4'>
                {[...Array(review.stars || 5)].map((_, i) => (
                  <Star key={i} className='w-5 h-5 text-orange-400 fill-orange-400' />
                ))}
              </div>
              <p className='text-rose-950/90 italic font-medium text-xl md:text-2xl leading-relaxed line-clamp-4'>
                "{review.text}"
              </p>
              <div className='mt-6'>
                <div className='text-sm font-bold text-rose-500 uppercase'>{review.author}</div>
                <div className='text-xs text-rose-300'>{review.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
