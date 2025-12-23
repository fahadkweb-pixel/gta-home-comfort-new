'use client';

import { useState, useEffect } from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react'; // Added CheckCircle2 import
import { client } from '@/sanity/lib/client';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export default function ServicePageReviews() {
  const [reviews, setReviews] = useState([]);

  // Carousel settings: align 'start' lets us show multiple cards cleanly
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start', skipSnaps: false }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await client.fetch(
          `*[_type == "review" && stars == 5] | order(date desc)[0...10] {
            "id": _id, author, stars, text, date
          }`
        );
        setReviews(data);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className='py-16 bg-rose-50/50 border-y border-rose-100/50 overflow-hidden'>
      <div className='max-w-7xl mx-auto px-6'>
        {/* Header - More compact */}
        <div className='flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4'>
          <div>
            <span className='text-rose-500 font-bold tracking-widest text-xs uppercase block mb-2'>
              Customer Success Stories
            </span>
            <h2 className='text-3xl font-bold text-rose-950'>Trusted by Your Neighbors</h2>
          </div>
          {/* Decorative line or subtext could go here */}
          <div className='hidden md:block h-px flex-1 bg-rose-200/50 ml-8 mb-4'></div>
        </div>

        {/* Carousel Viewport */}
        <div className='overflow-hidden cursor-grab active:cursor-grabbing' ref={emblaRef}>
          <div className='flex gap-4 touch-pan-y ml-[-0.5rem]'>
            {reviews.map((review) => (
              // CARD CONTAINER: Adjusted width breakpoints for better density
              <div
                key={review.id}
                className='flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_32%] min-w-0 pl-4 relative'
              >
                <div className='h-full bg-white p-6 rounded-2xl shadow-sm border border-rose-100 flex flex-col hover:border-rose-300 transition-colors duration-300'>
                  {/* Top Row: Stars & Icon */}
                  <div className='flex justify-between items-start mb-4'>
                    <div className='flex gap-1'>
                      {[...Array(review.stars)].map((_, i) => (
                        <Star key={i} className='w-4 h-4 text-orange-400 fill-orange-400' />
                      ))}
                    </div>
                    <Quote className='w-8 h-8 text-rose-50 rotate-180 fill-rose-50' />
                  </div>

                  {/* Review Text - clamped to 5 lines maximum */}
                  <blockquote className='flex-1 mb-6'>
                    <p className='text-slate-600 text-base leading-relaxed line-clamp-5'>
                      "{review.text}"
                    </p>
                  </blockquote>

                  {/* Author Info - Compact */}
                  <div className='pt-4 border-t border-slate-50 flex items-center justify-between'>
                    <div className='font-bold text-slate-900 text-sm'>{review.author}</div>
                    <div className='flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full'>
                      <CheckCircle2 className='w-3 h-3' /> Verified
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
