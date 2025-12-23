'use client';

import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export default function ServicePageReviews() {
  const [reviews, setReviews] = useState([]);
  // Setup Embla Carousel with the Autoplay plugin
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start', skipSnaps: false }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Fetch the 10 most recent 5-star reviews for a curated "wall of love"
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

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className='py-24 bg-rose-50 overflow-hidden'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <span className='text-rose-500 font-bold tracking-widest text-sm uppercase block mb-3'>
            Customer Success Stories
          </span>
          <h2 className='text-4xl md:text-5xl font-bold text-rose-950'>
            Trusted by Your Neighbors
          </h2>
        </div>

        {/* Carousel Viewport */}
        <div className='overflow-hidden cursor-grab active:cursor-grabbing' ref={emblaRef}>
          {/* Carousel Container */}
          <div className='flex gap-6 touch-pan-y ml-[-1rem]'>
            {reviews.map((review) => (
              // Individual Review Card (adjust width for different screens)
              <div
                key={review.id}
                className='flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0 pl-4 relative'
              >
                <div className='h-full bg-white p-8 rounded-[32px] shadow-xl shadow-rose-100/50 border border-rose-100 flex flex-col relative hover:-translate-y-1 transition-transform duration-300'>
                  {/* Decorative Quote Icon */}
                  <Quote className='absolute top-6 right-6 w-12 h-12 text-rose-50 rotate-180 fill-rose-50' />

                  {/* Stars */}
                  <div className='flex gap-1 mb-6 relative z-10'>
                    {[...Array(review.stars)].map((_, i) => (
                      <Star
                        key={i}
                        className='w-5 h-5 text-orange-400 fill-orange-400 drop-shadow-sm'
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <blockquote className='flex-1 relative z-10'>
                    <p className='text-rose-950/80 text-lg leading-relaxed italic'>
                      "{review.text}"
                    </p>
                  </blockquote>

                  {/* Author Info */}
                  <div className='mt-8 pt-6 border-t border-rose-50 relative z-10'>
                    <div className='font-bold text-rose-950 text-lg'>{review.author}</div>
                    <div className='text-rose-400 text-sm font-medium flex items-center gap-2'>
                      <CheckCircle2 className='w-4 h-4' /> Verified Customer
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

// Simple icon component for the author section
function CheckCircle2({ className }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='currentColor'
      className={className}
    >
      <path
        fillRule='evenodd'
        d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z'
        clipRule='evenodd'
      />
    </svg>
  );
}
