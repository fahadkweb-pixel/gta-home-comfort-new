'use client';

import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export default function HomepageReviews() {
  const [reviews, setReviews] = useState([]);

  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: 'center', skipSnaps: false, duration: 25 },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "review" && stars >= 4] | order(date desc)[0...5] {
            "id": _id, author, stars, text
          }`
        );
        setReviews(data.length > 2 ? data : [...data, ...data]);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  if (reviews.length === 0) return null;

  return (
    <div className='h-full w-full bg-white border border-slate-200 rounded-[32px] p-6 relative overflow-hidden group hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/20 transition-all duration-300 flex flex-col justify-center'>
      {/* Background Icon */}
      <Quote className='absolute top-4 right-4 w-16 h-16 text-slate-50 rotate-180 -z-10 group-hover:text-rose-50 transition-colors' />

      {/* Label */}
      <div className='mb-2 shrink-0'>
        <span className='text-[11px] font-bold text-rose-500 uppercase tracking-widest block'>
          Recent Feedback
        </span>
      </div>

      {/* Carousel */}
      <div className='overflow-hidden w-full relative z-10' ref={emblaRef}>
        <div className='flex touch-pan-y items-center'>
          {reviews.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className='flex-[0_0_100%] min-w-0 relative pl-1 pr-2'
            >
              {/* Stars */}
              <div className='flex gap-1 mb-3'>
                {[...Array(review.stars)].map((_, i) => (
                  <Star key={i} className='w-4 h-4 text-orange-400 fill-orange-400' />
                ))}
              </div>

              {/* Text - Slightly tighter line-height and margin */}
              <p className='text-slate-700 font-medium text-lg leading-snug italic line-clamp-3 mb-3'>
                "{review.text}"
              </p>

              {/* Author */}
              <div className='font-bold text-slate-900 text-sm'>— {review.author}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
