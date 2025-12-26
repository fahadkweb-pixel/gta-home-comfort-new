import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { Wrench, Hammer, ArrowRight, HelpCircle } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
// Navbar/Footer handled by global layout
import ServicePageReviews from '../components/ServicePageReviews';

// --- 1. NEW: SEO METADATA GENERATOR ---
export async function generateMetadata({ params }) {
  const { slug } = await params;

  // Fetch only the SEO fields to keep it fast
  const data = await client.fetch(
    `*[_type == "servicePage" && slug.current == $slug][0]{
      seoTitle,
      seoDescription,
      seoImage,
      title
    }`,
    { slug }
  );

  if (!data) return { title: 'GTA Home Comfort' };

  // Fallback logic if you forget to fill in the SEO tab
  const pageTitle = data.seoTitle || `${data.title} | GTA Home Comfort`;
  const pageDesc =
    data.seoDescription || `Professional ${data.title} services in the Greater Toronto Area.`;

  return {
    title: pageTitle,
    description: pageDesc,
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      images: data.seoImage ? [urlFor(data.seoImage).width(1200).height(630).url()] : [],
    },
  };
}

// --- 2. EXISTING DATA FETCHER ---
async function getPage(slug) {
  // Added "seoTitle" etc to query just in case, though usually handled by generateMetadata
  return client.fetch(`*[_type == "servicePage" && slug.current == $slug][0]`, { slug });
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page)
    return (
      <div className='min-h-screen bg-[#FDF8F6] flex items-center justify-center text-rose-950 font-bold text-xl'>
        404 - Page Not Found
      </div>
    );

  return (
    <main className='min-h-screen bg-[#FDF8F6] text-rose-950 selection:bg-rose-200'>
      {/* 1. HERO */}
      <section className='relative h-[55vh] flex items-center justify-center overflow-hidden bg-rose-900'>
        {page.heroImage && (
          <div className='absolute inset-0 z-0 opacity-40'>
            <img
              src={urlFor(page.heroImage).url()}
              alt={page.heroHeading}
              className='w-full h-full object-cover'
            />
            <div className='absolute inset-0 bg-gradient-to-b from-rose-950/50 to-rose-950/80' />
          </div>
        )}
        <div className='relative z-10 text-center max-w-4xl px-6 pt-10'>
          <h1 className='text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg'>
            {page.heroHeading}
          </h1>
          <p className='text-lg md:text-2xl text-rose-50 font-medium max-w-2xl mx-auto opacity-90 drop-shadow-md'>
            {page.heroSubheading}
          </p>
        </div>
      </section>

      {/* 2. REPAIR VS REPLACE */}
      {page.showSplitSection && (
        <section className='relative z-20 -mt-20 max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-6 mb-20'>
          {/* REPAIR CARD */}
          <div className='bg-white p-8 rounded-[32px] shadow-xl shadow-rose-900/10 border border-white/50 hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full'>
            <div className='w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 text-rose-500 shrink-0'>
              <Wrench />
            </div>
            <h3 className='text-2xl font-bold mb-2'>{page.repairTitle}</h3>
            {/* FIX: Removed h-12 to allow text to expand naturally */}
            <p className='text-rose-900/70 mb-6'>{page.repairText}</p>
            {/* FIX: Added mt-auto to push button to bottom */}
            <Link
              href={`/?mode=repair&source=${slug}`}
              className='text-rose-600 font-bold flex items-center gap-2 hover:gap-4 transition-all mt-auto'
            >
              Book Repair <ArrowRight size={20} />
            </Link>
          </div>

          {/* INSTALL CARD */}
          <div className='bg-rose-950 text-white p-8 rounded-[32px] shadow-xl shadow-rose-900/20 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full'>
            <div className='absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none' />
            <div className='w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 text-rose-200 border border-white/10 shrink-0'>
              <Hammer />
            </div>
            <h3 className='text-2xl font-bold mb-2'>{page.installTitle}</h3>
            {/* FIX: Removed h-12 to allow text to expand naturally */}
            <p className='text-rose-200/80 mb-6'>{page.installText}</p>
            {/* FIX: Added mt-auto to push button to bottom */}
            <Link
              href={`/?mode=install&source=${slug}`}
              className='text-white font-bold flex items-center gap-2 hover:gap-4 transition-all relative z-10 mt-auto'
            >
              Get Quote <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      )}

      {/* 3. THE PROCESS */}
      {page.process && page.process.length > 0 && (
        <section className='max-w-5xl mx-auto px-6 mb-24'>
          <div className='text-center mb-12'>
            <span className='text-rose-500 font-bold tracking-widest text-xs uppercase'>
              The Process
            </span>
            <h2 className='text-3xl font-bold text-rose-950 mt-2'>How it works</h2>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            {page.process.map((step, idx) => (
              <div key={idx} className='relative pl-8 border-l-2 border-rose-200 group'>
                <div className='absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-rose-200 group-hover:border-rose-500 transition-colors' />
                <span className='text-xs font-bold text-rose-400 uppercase mb-1 block'>
                  Step 0{idx + 1}
                </span>
                <h3 className='text-xl font-bold text-rose-950 mb-2'>{step.title}</h3>
                <p className='text-rose-900/70 leading-relaxed'>{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. MAIN CONTENT */}
      {page.content && (
        <section className='max-w-3xl mx-auto px-6 mb-24 prose prose-rose prose-lg prose-headings:font-bold prose-a:text-rose-600 hover:prose-a:text-rose-500 prose-img:rounded-[32px] prose-img:shadow-xl'>
          <PortableText value={page.content} />
        </section>
      )}

      {/* 5. REVIEWS */}
      {page.showReviews && <ServicePageReviews />}

      {/* 6. FAQ */}
      {page.faq && page.faq.length > 0 && (
        <section className='max-w-3xl mx-auto px-6 my-24'>
          <h2 className='text-3xl font-bold text-rose-950 mb-8 text-center'>
            Frequently Asked Questions
          </h2>
          <div className='space-y-4'>
            {page.faq.map((item, i) => (
              <div
                key={i}
                className='bg-white p-6 rounded-2xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow'
              >
                <h3 className='font-bold text-rose-950 mb-2 flex gap-3 text-lg'>
                  <HelpCircle className='w-6 h-6 text-rose-400 shrink-0 mt-0.5' />
                  {item.question}
                </h3>
                <p className='text-rose-900/70 ml-9 leading-relaxed'>{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className='bg-rose-950 py-20 text-center text-white relative overflow-hidden'>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className='relative z-10 max-w-2xl mx-auto px-6'>
          <h2 className='text-3xl md:text-4xl font-bold mb-6'>Ready to restore comfort?</h2>
          <p className='text-rose-200/80 mb-10 text-xl leading-relaxed'>
            Use our smart diagnostic tool to get the right help, right away.
          </p>
          <Link
            href={`/?mode=repair&source=${slug}`}
            className='inline-flex items-center gap-2 bg-white hover:bg-rose-50 text-rose-600 font-bold py-4 px-8 rounded-2xl shadow-lg transition-all hover:-translate-y-0.5'
          >
            Launch Diagnostic Tool <ArrowRight className='w-5 h-5' />
          </Link>
        </div>
      </section>
    </main>
  );
}
