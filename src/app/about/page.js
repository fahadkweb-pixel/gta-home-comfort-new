import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { ShieldCheck, Heart, Clock, Users } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';

// Fetch Data
async function getAboutData() {
  return client.fetch(`
  *[_id in ["aboutPage","drafts.aboutPage"]]
  | order(_updatedAt desc)[0]
`);
}

export default async function AboutPage() {
  const data = await getAboutData();

  // Fallback if no data exists yet
  if (!data)
    return <div className='p-20 text-center'>Please configure "About Page" in Sanity Studio</div>;

  return (
    <main className='min-h-screen bg-[#FDF8F6] text-rose-950 selection:bg-rose-200'>
      {/* HERO */}
      <section className='relative py-20 px-6 bg-rose-900 overflow-hidden'>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className='max-w-4xl mx-auto text-center relative z-10'>
          <span className='text-rose-300 font-bold tracking-widest text-sm uppercase mb-4 block'>
            Our Story
          </span>
          <h1 className='text-4xl md:text-6xl font-bold text-white mb-8'>{data.heroHeading}</h1>
          <p className='text-xl text-rose-100/90 leading-relaxed max-w-2xl mx-auto'>
            {data.heroSubheading}
          </p>
        </div>
      </section>

      {/* ORIGIN STORY */}
      <section className='py-20 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center'>
        <div className='relative'>
          <div className='aspect-[4/5] bg-slate-200 rounded-[32px] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500'>
            {data.storyImage ? (
              <img
                src={urlFor(data.storyImage).url()}
                alt='Founder'
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center text-slate-400 bg-slate-100'>
                Upload Photo
              </div>
            )}
          </div>
          {data.storyQuote && (
            <div className='absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-rose-100 max-w-xs hidden md:block'>
              <p className='text-rose-500 font-bold text-lg italic'>"{data.storyQuote}"</p>
            </div>
          )}
        </div>

        <div className='prose prose-lg prose-rose'>
          <h2 className='text-3xl font-bold text-rose-950 mb-6'>{data.storyHeading}</h2>
          <PortableText value={data.storyText} />

          {/* STATS */}
          <div className='grid grid-cols-2 gap-6 mt-8 not-prose'>
            <div className='bg-white p-4 rounded-2xl border border-rose-100 shadow-sm text-center md:text-left'>
              <div className='text-3xl font-bold text-rose-500 mb-1'>{data.stat1Number}</div>
              <div className='text-xs font-bold text-slate-400 uppercase'>{data.stat1Label}</div>
            </div>
            <div className='bg-white p-4 rounded-2xl border border-rose-100 shadow-sm text-center md:text-left'>
              <div className='text-3xl font-bold text-rose-500 mb-1'>{data.stat2Number}</div>
              <div className='text-xs font-bold text-slate-400 uppercase'>{data.stat2Label}</div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      {data.values && (
        <section className='bg-white py-20 px-6 border-y border-rose-100/50'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl font-bold text-rose-950'>The "No-Nonsense" Promise</h2>
            </div>
            <div className='grid md:grid-cols-4 gap-8'>
              {data.values.map((val, i) => {
                // Simple icon mapping based on index (You can make this dynamic later if needed)
                const Icons = [ShieldCheck, Heart, Clock, Users];
                const Icon = Icons[i] || ShieldCheck;
                return (
                  <div key={i} className='text-center'>
                    <div className='w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-500'>
                      <Icon size={32} />
                    </div>
                    <h3 className='font-bold text-rose-950 text-xl mb-2'>{val.title}</h3>
                    <p className='text-slate-500 leading-relaxed'>{val.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className='py-20 text-center px-6'>
        <h2 className='text-3xl font-bold text-rose-950 mb-6'>Ready to meet the team?</h2>
        <Link
          href='/contact'
          className='inline-block bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all hover:-translate-y-1'
        >
          Get in Touch
        </Link>
      </section>
    </main>
  );
}
