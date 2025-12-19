import { Heart, Cpu, Check, X, ArrowRight, BarChart3 } from 'lucide-react';

export default function ContentSections() {
  return (
    <div className='flex flex-col gap-24 md:gap-32 pb-24'>
      {/* --- SECTION 1: WHO WE ARE (Reordered) --- */}
      <section id='who-we-are' className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
        {/* 1. TEXT CONTENT (Now First in DOM = Top on Mobile) */}
        <div className='flex flex-col gap-6 order-1'>
          <div>
            <span className='inline-block px-4 py-1.5 rounded-full bg-rose-100 text-rose-600 text-xs font-bold tracking-widest uppercase mb-4'>
              Rooted in Scarborough
            </span>
            <h2 className='text-4xl md:text-5xl font-serif text-slate-900 leading-tight'>
              The HVAC company <br />
              <span className='font-sans font-bold text-rose-500'>we wanted to hire.</span>
            </h2>
          </div>

          <div className='space-y-4 text-lg text-slate-600 leading-relaxed'>
            <p>
              We are GTA Home Comfort. We're a family-run team of second-generation technicians
              based right here in Scarborough.
            </p>
            <p>
              We grew up seeing the industry's flaws: the 8-hour waiting windows, the
              commission-based sales pitches, and the mystery invoices.
            </p>
            <p>
              So we rebuilt it. We operate on a{' '}
              <span className='font-semibold text-rose-900'>salary-based model</span> (no
              commissions) and use digital diagnostics to prove every repair is necessary.
            </p>
            <p className='font-medium text-slate-900'>
              We aren't just another company looking for a sale. We're your neighbors, and we want
              to help like a neighbor would.
              <span className='text-rose-500 font-bold'> That's the GTA Way.</span>
            </p>
          </div>

          {/* Badges */}
          <div className='flex gap-4 mt-2'>
            <div className='flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-xl text-rose-700 font-bold text-sm'>
              <Heart size={16} className='fill-rose-500 text-rose-500' />
              Family Owned
            </div>
            <div className='flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-xl text-rose-700 font-bold text-sm'>
              <Cpu size={16} />
              Digitally Native
            </div>
          </div>
        </div>

        {/* 2. IMAGE CONTENT (Now Second in DOM = Bottom on Mobile) */}
        <div className='relative h-[500px] w-full bg-rose-950 rounded-[3rem] overflow-hidden shadow-2xl order-2'>
          {/* Background Image Placeholder - Replace 'src' with your actual image */}
          <img
            src='/images/technician-working.jpg'
            alt='Technician working'
            className='absolute inset-0 w-full h-full object-cover opacity-60'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-rose-950 via-transparent to-transparent' />

          {/* Floating Cards (Overlay) */}
          <div className='absolute bottom-8 left-8 right-8 flex flex-col gap-3'>
            {/* 'Bad' Card */}
            <div className='bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white/60 text-sm flex justify-between items-center'>
              <div>
                <div className='text-[10px] uppercase tracking-wider font-bold opacity-70'>
                  The Corporate Way
                </div>
                <div className='font-medium'>"Customer Account #9422"</div>
              </div>
              <X size={16} />
            </div>

            {/* 'Good' Card */}
            <div className='bg-white p-5 rounded-2xl shadow-xl flex justify-between items-center transform scale-105'>
              <div>
                <div className='text-[10px] uppercase tracking-wider font-bold text-green-600 mb-1'>
                  The GTA Way
                </div>
                <div className='font-bold text-slate-900 text-lg'>
                  "Treating you like a neighbor."
                </div>
                <div className='text-xs text-rose-400 font-medium'>Because we actually are.</div>
              </div>
              <div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600'>
                <Heart size={16} className='fill-green-600' />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: COST TRANSPARENCY (The Chart) --- */}
      <section className='bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden'>
        <div className='relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-end'>
          <div>
            <span className='text-rose-400 font-bold tracking-widest text-xs uppercase mb-2 block'>
              Transparency First
            </span>
            <h2 className='text-3xl md:text-4xl font-serif mb-6'>
              Repair or Replace? <br /> <span className='text-white/60'>We help you decide.</span>
            </h2>
            <p className='text-slate-300 leading-relaxed mb-8'>
              Most technicians are paid to sell you a new unit. We are paid to fix your problem. We
              provide a clear cost-benefit analysis for every job, showing you exactly when it makes
              sense to repair and when it pays to replace.
            </p>
            <button className='bg-rose-500 text-white px-6 py-3 rounded-full font-bold hover:bg-rose-600 transition-colors flex items-center gap-2'>
              See our Pricing Guide <ArrowRight size={16} />
            </button>
          </div>

          {/* Abstract Bar Chart Graphic */}
          <div className='h-64 flex items-end justify-center gap-4 pb-4'>
            <div className='w-16 bg-white/10 rounded-t-xl h-[40%] relative group'>
              <div className='absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity'>
                Repair
              </div>
            </div>
            <div className='w-16 bg-white/10 rounded-t-xl h-[60%] relative group'>
              <div className='absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity'>
                Main
              </div>
            </div>
            <div className='w-16 bg-rose-500 rounded-t-xl h-[85%] relative shadow-[0_0_30px_rgba(244,63,94,0.4)]'>
              <div className='absolute top-4 left-1/2 -translate-x-1/2 text-white font-bold text-xs'>
                New
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: PRICING TABLE --- */}
      <section className='text-center max-w-3xl mx-auto'>
        <span className='text-rose-500 font-bold tracking-widest text-xs uppercase mb-4 block'>
          No Secrets
        </span>
        <h2 className='text-3xl md:text-4xl font-serif text-slate-900 mb-4'>
          What does a repair usually cost?
        </h2>
        <p className='text-slate-600 mb-10'>
          We believe in upfront pricing. Here are the average costs for common repairs in Toronto.
        </p>

        <div className='grid grid-cols-3 gap-4 text-left'>
          <div className='p-6 bg-white rounded-3xl border border-slate-100 shadow-sm'>
            <div className='text-slate-400 text-xs font-bold uppercase mb-2'>Ignitor</div>
            <div className='text-2xl font-bold text-slate-900'>$240</div>
          </div>
          <div className='p-6 bg-white rounded-3xl border border-slate-100 shadow-sm'>
            <div className='text-slate-400 text-xs font-bold uppercase mb-2'>Flame Sensor</div>
            <div className='text-2xl font-bold text-slate-900'>$180</div>
          </div>
          <div className='p-6 bg-rose-50 rounded-3xl border border-rose-100 shadow-sm relative overflow-hidden'>
            <div className='relative z-10'>
              <div className='text-rose-400 text-xs font-bold uppercase mb-2'>Control Board</div>
              <div className='text-2xl font-bold text-rose-600'>$450</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
