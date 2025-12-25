import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image'; // <--- 1. Import urlFor
import Link from 'next/link';
import { Phone, Mail, MapPin, Calculator, ArrowRight } from 'lucide-react';

async function getContactData() {
  return client.fetch(`*[_type == "contactPage" && _id == "contactPage"][0]`);
}

export default async function ContactPage() {
  const data = await getContactData();

  if (!data)
    return <div className='p-20 text-center'>Please configure "Contact Page" in Sanity Studio</div>;

  return (
    <main className='min-h-screen bg-[#FDF8F6] text-rose-950 selection:bg-rose-200'>
      <div className='max-w-6xl mx-auto px-6 py-12 md:py-20'>
        {/* HEADER */}
        <div className='text-center max-w-2xl mx-auto mb-16'>
          <h1 className='text-4xl md:text-5xl font-bold text-rose-950 mb-6'>{data.heading}</h1>
          <p className='text-xl text-slate-600 leading-relaxed'>{data.introText}</p>
        </div>

        {/* TRIAGE GRID */}
        <div className='grid md:grid-cols-3 gap-6 mb-20'>
          {/* 1. EMERGENCY */}
          <div className='bg-white p-8 rounded-[32px] shadow-xl border-2 border-rose-100 hover:border-rose-500 transition-all group flex flex-col'>
            <div className='w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-6 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors'>
              <Phone size={28} />
            </div>
            <h2 className='text-2xl font-bold text-rose-950 mb-2'>Emergency?</h2>
            <p className='text-slate-500 mb-8 flex-1'>{data.emergencyCardText}</p>
            <a
              href={`tel:${data.phoneNumber}`}
              className='flex items-center gap-2 text-rose-600 font-bold text-lg group-hover:gap-4 transition-all'
            >
              {data.phoneNumber} <ArrowRight size={20} />
            </a>
          </div>

          {/* 2. QUOTE */}
          <div className='bg-rose-950 p-8 rounded-[32px] shadow-xl text-white relative overflow-hidden group flex flex-col'>
            <div className='absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2'></div>
            <div className='relative z-10 flex flex-col h-full'>
              <div className='w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white border border-white/20'>
                <Calculator size={28} />
              </div>
              <h2 className='text-2xl font-bold mb-2'>Need a Price?</h2>
              <p className='text-rose-200/80 mb-8 flex-1'>{data.quoteCardText}</p>
              <Link
                href='/'
                className='flex items-center gap-2 text-white font-bold text-lg group-hover:gap-4 transition-all'
              >
                Launch Smart Quoter <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* 3. GENERAL */}
          <div className='bg-white p-8 rounded-[32px] shadow-xl border-2 border-rose-100 hover:border-slate-400 transition-all group flex flex-col'>
            <div className='w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors'>
              <Mail size={28} />
            </div>
            <h2 className='text-2xl font-bold text-rose-950 mb-2'>General Question?</h2>
            <p className='text-slate-500 mb-8 flex-1'>{data.generalCardText}</p>
            <a
              href={`mailto:${data.email}`}
              className='flex items-center gap-2 text-slate-600 font-bold text-lg group-hover:gap-4 transition-all'
            >
              Email Us <ArrowRight size={20} />
            </a>
          </div>
        </div>

        {/* MAP / SERVICE AREA */}
        <div className='bg-rose-50 rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center'>
          <div className='flex-1'>
            <h3 className='text-2xl font-bold text-rose-950 mb-6'>{data.serviceAreaTitle}</h3>
            <p className='text-slate-600 mb-6 leading-relaxed text-lg whitespace-pre-line'>
              {data.serviceAreaText}
            </p>
            <div className='flex items-center gap-3 text-slate-600 font-medium'>
              <MapPin className='text-rose-500' />
              <span>Serving the Entire GTA</span>
            </div>
          </div>

          {/* 2. DYNAMIC MAP IMAGE LOGIC */}
          <div className='flex-1 w-full h-64 bg-rose-200/50 rounded-2xl flex items-center justify-center overflow-hidden relative shadow-inner'>
            {data.serviceAreaImage ? (
              <img
                src={urlFor(data.serviceAreaImage).url()}
                alt='Service Area Map'
                className='w-full h-full object-cover'
              />
            ) : (
              <>
                <div className='absolute inset-0 bg-rose-500/10'></div>
                <span className='text-rose-400 font-bold text-xl uppercase tracking-widest'>
                  (Map Placeholder)
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
