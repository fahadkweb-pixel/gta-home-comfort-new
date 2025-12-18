'use client';

import {
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Activity,
  Battery,
  ToggleLeft,
  Wind,
  Users,
  Cpu,
  Heart,
  Handshake,
  FileX,
  Wallet,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';

export default function ContentSections() {
  return (
    <div className='w-full max-w-5xl mx-auto space-y-24 py-12 md:py-24'>
      {/* SECTION 1: THE MANIFESTO */}
      <section className='grid md:grid-cols-2 gap-12 items-center'>
        <div className='order-2 md:order-1'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/50 border border-rose-200 text-rose-800 text-xs font-medium mb-6'>
            <Users className='w-3 h-3' />
            ROOTED IN SCARBOROUGH
          </div>
          <h2 className='text-3xl md:text-5xl font-bold text-rose-950 tracking-tight mb-6'>
            The HVAC company <br />
            <span className='text-rose-500'>we wanted to hire.</span>
          </h2>
          <p className='text-xl text-rose-900/60 leading-relaxed mb-6'>
            We are GTA Home Comfort. We're a family-run team of second-generation technicians based
            right here in Scarborough.
          </p>
          <p className='text-rose-900/60 leading-relaxed mb-8'>
            We grew up seeing the industry's flaws: the 8-hour waiting windows, the commission-based
            sales pitches, and the mystery invoices.
            <br />
            <br />
            So we rebuilt it. We operate on a salary-based model (no commissions) and use digital
            diagnostics to prove every repair is necessary.
            <br />
            <br />
            We aren't just another company looking for a sale. We're your neighbors, and we want to
            help like a neighbor would. <strong>That's the GTA Way.</strong>
          </p>

          <div className='flex gap-6 text-sm font-semibold text-rose-950'>
            <div className='flex items-center gap-2'>
              <div className='bg-rose-100 p-1.5 rounded-full'>
                <Heart className='w-3.5 h-3.5 text-rose-600' />
              </div>
              Family Owned
            </div>
            <div className='flex items-center gap-2'>
              <div className='bg-rose-100 p-1.5 rounded-full'>
                <Cpu className='w-3.5 h-3.5 text-rose-600' />
              </div>
              Digitally Native
            </div>
          </div>
        </div>

        {/* VISUAL: Transaction vs Relationship */}
        <div className='order-1 md:order-2 relative h-[500px] rounded-[32px] overflow-hidden shadow-2xl shadow-rose-900/10 group'>
          <div
            className='absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105'
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800")',
            }}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-rose-950/90 via-rose-950/40 to-transparent' />
          <div className='absolute bottom-0 left-0 w-full p-8 space-y-4'>
            <div className='p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-between opacity-70'>
              <div>
                <div className='text-[10px] font-bold text-rose-200 uppercase tracking-widest mb-1'>
                  The Corporate Way
                </div>
                <div className='text-white/80 font-medium text-sm line-through decoration-rose-400/50'>
                  "Customer Account #9422."
                </div>
              </div>
              <FileX className='text-rose-400 w-5 h-5' />
            </div>
            <div className='p-5 bg-white rounded-xl border border-emerald-100 shadow-xl flex items-center justify-between transform translate-y-2 group-hover:translate-y-0 transition-transform'>
              <div>
                <div className='text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1'>
                  The GTA Way
                </div>
                <div className='text-rose-950 font-bold text-sm'>
                  "Treating you like a neighbor."
                </div>
                <div className='text-xs text-rose-400 mt-1'>Because we actually are.</div>
              </div>
              <div className='bg-emerald-100 p-2 rounded-full'>
                <Handshake className='text-emerald-600 w-5 h-5' />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE "JUST HERE TO HELP" PROMISE (Refactored to Left-Aligned Split) */}
      <section className='bg-rose-50/50 rounded-[40px] border border-rose-100 p-8 md:p-12'>
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          {/* Left Column: The "Why" */}
          <div>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-rose-200 text-rose-800 text-xs font-medium shadow-sm mb-6'>
              <Handshake className='w-3 h-3' />
              OUR COMMITMENT
            </div>

            <h2 className='text-3xl md:text-4xl font-bold text-rose-950 tracking-tight mb-6'>
              We know life is <br /> expensive enough.
            </h2>

            <p className='text-lg text-rose-900/70 leading-relaxed mb-8'>
              A broken furnace is stressful. The cost of living in the GTA is already high. The last
              thing you need is a sales pitch when your house is freezing.
            </p>

            <p className='text-base font-medium text-rose-950/80 italic border-l-4 border-rose-300 pl-4 py-1'>
              "We want to save you money so much, we'd prefer if you fixed it yourself for free..."
            </p>
          </div>

          {/* Right Column: The 3 Pillars (Vertical Stack) */}
          <div className='space-y-6'>
            {/* Pillar 1 */}
            <div className='flex gap-4 p-4 rounded-2xl bg-white/60 border border-rose-100 hover:bg-white transition-colors'>
              <div className='w-10 h-10 min-w-[40px] bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600 border border-rose-50'>
                <Wallet className='w-5 h-5' />
              </div>
              <div>
                <h3 className='font-bold text-rose-950 text-sm mb-1'>Respecting Your Budget</h3>
                <p className='text-sm text-rose-900/60 leading-relaxed'>
                  We always offer a repair option first. We fight to save your system, not replace
                  it.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className='flex gap-4 p-4 rounded-2xl bg-white/60 border border-rose-100 hover:bg-white transition-colors'>
              <div className='w-10 h-10 min-w-[40px] bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 border border-rose-50'>
                <Lightbulb className='w-5 h-5' />
              </div>
              <div>
                <h3 className='font-bold text-rose-950 text-sm mb-1'>Empowering You</h3>
                <p className='text-sm text-rose-900/60 leading-relaxed'>
                  We explain the "Why" behind every fix. No jargon. No secrets. Just honest advice.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className='flex gap-4 p-4 rounded-2xl bg-white/60 border border-rose-100 hover:bg-white transition-colors'>
              <div className='w-10 h-10 min-w-[40px] bg-white rounded-full flex items-center justify-center shadow-sm text-rose-600 border border-rose-50'>
                <ShieldCheck className='w-5 h-5' />
              </div>
              <div>
                <h3 className='font-bold text-rose-950 text-sm mb-1'>Zero Sales Pressure</h3>
                <p className='text-sm text-rose-900/60 leading-relaxed'>
                  Our technicians are forbidden from up-selling. Their only job is to get your heat
                  back on.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: DIY TRIAGE */}
      <section>
        <div className='flex flex-col md:flex-row gap-8 items-start mb-12'>
          <div className='flex-1'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-800 text-xs font-medium mb-6'>
              <CheckCircle2 className='w-3 h-3' />
              FREE DIAGNOSTICS
            </div>
            <h2 className='text-3xl md:text-5xl font-bold text-rose-950 tracking-tight mb-4'>
              Don't pay us yet.
            </h2>
            <p className='text-xl text-rose-900/60 leading-relaxed'>
              We weren't kidding. 30% of "No Heat" calls are simple fixes you can do in 5 minutes.
              Check these three things before you book a dispatch.
            </p>
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-6'>
          <DIYCard
            icon={<ToggleLeft />}
            title="The 'Furnace Switch'"
            desc='It looks like a light switch, usually on the ceiling or wall near the furnace. Someone might have bumped it off.'
            action='Check: Is it ON?'
          />
          <DIYCard
            icon={<Wind />}
            title='The Air Filter'
            desc='If your filter is clogged, the furnace will overheat and shut itself down as a safety precaution.'
            action='Check: Is it grey/clogged?'
          />
          <DIYCard
            icon={<Battery />}
            title='Thermostat Batteries'
            desc="If the screen is blank or fading, your furnace won't get the signal to turn on."
            action='Check: Swap for AAs.'
          />
        </div>
      </section>

      {/* SECTION 4: THE "REPAIR VS REPLACE" MATRIX */}
      <section className='bg-rose-950 text-white rounded-[40px] p-8 md:p-16 relative overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20' />

        <div className='relative z-10 grid lg:grid-cols-2 gap-12 items-center'>
          <div>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-rose-200 text-xs font-medium mb-6'>
              <HelpCircle className='w-3 h-3' />
              DECISION SUPPORT
            </div>
            <h2 className='text-3xl md:text-5xl font-bold mb-6 tracking-tight'>
              Repair or Replace?
            </h2>
            <p className='text-rose-200/80 text-lg leading-relaxed mb-8'>
              The most stressful decision for a homeowner. We simplify it with honesty.
              <br />
              <br />
              We map your system's age against its repair cost. If a repair costs more than 50% of
              the unit's remaining value, we advise replacement. If less, we fix it.
            </p>

            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='flex-1 bg-white/10 rounded-2xl p-6 border border-white/10 backdrop-blur-sm'>
                <div className='text-3xl font-bold text-emerald-400 mb-1'>&lt; 12 yrs</div>
                <div className='text-sm text-rose-200/60 font-medium'>System Age</div>
                <div className='mt-4 text-sm font-semibold text-white border-t border-white/10 pt-3'>
                  Verdict: <span className='text-emerald-400'>REPAIR.</span>
                  <br />
                  <span className='font-normal opacity-70 text-xs'>
                    Usually worth the investment.
                  </span>
                </div>
              </div>
              <div className='flex-1 bg-white/10 rounded-2xl p-6 border border-white/10 backdrop-blur-sm'>
                <div className='text-3xl font-bold text-orange-400 mb-1'>15+ yrs</div>
                <div className='text-sm text-rose-200/60 font-medium'>System Age</div>
                <div className='mt-4 text-sm font-semibold text-white border-t border-white/10 pt-3'>
                  Verdict: <span className='text-orange-400'>REPLACE.</span>
                  <br />
                  <span className='font-normal opacity-70 text-xs'>Diminishing returns.</span>
                </div>
              </div>
            </div>
          </div>

          {/* THE EFFICIENCY CURVE CHART */}
          <div className='bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl h-full flex flex-col relative min-h-[300px]'>
            <div className='flex justify-between items-start mb-8'>
              <div>
                <div className='text-xs font-bold text-rose-300 uppercase tracking-widest mb-1'>
                  Reliability Curve
                </div>
                <div className='text-2xl font-bold text-white'>System Lifespan</div>
              </div>
              <Activity className='text-rose-400 w-6 h-6' />
            </div>

            {/* SVG LINE GRAPH */}
            <div className='flex-1 w-full h-full relative'>
              <svg
                viewBox='0 0 100 50'
                className='w-full h-full overflow-visible'
                preserveAspectRatio='none'
              >
                <line
                  x1='0'
                  y1='0'
                  x2='100'
                  y2='0'
                  stroke='rgba(255,255,255,0.1)'
                  strokeWidth='0.5'
                  strokeDasharray='2 2'
                />
                <line
                  x1='0'
                  y1='25'
                  x2='100'
                  y2='25'
                  stroke='rgba(255,255,255,0.1)'
                  strokeWidth='0.5'
                  strokeDasharray='2 2'
                />
                <line
                  x1='0'
                  y1='50'
                  x2='100'
                  y2='50'
                  stroke='rgba(255,255,255,0.1)'
                  strokeWidth='0.5'
                  strokeDasharray='2 2'
                />
                <defs>
                  <linearGradient id='curveGradient' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='#f43f5e' stopOpacity='0.5' />
                    <stop offset='100%' stopColor='#f43f5e' stopOpacity='0' />
                  </linearGradient>
                </defs>
                <path
                  d='M0,5 C20,5 40,5 50,15 C60,25 70,45 100,48 L100,50 L0,50 Z'
                  fill='url(#curveGradient)'
                />
                <path
                  d='M0,5 C20,5 40,5 50,15 C60,25 70,45 100,48'
                  fill='none'
                  stroke='#fb7185'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
                <circle cx='0' cy='5' r='2' fill='white' />
                <circle cx='50' cy='15' r='2' fill='white' />
                <circle cx='100' cy='48' r='2' fill='#fb7185' />
                <text x='2' y='12' className='text-[3px] fill-emerald-300 font-bold'>
                  PEAK EFFICIENCY
                </text>
                <text x='52' y='14' className='text-[3px] fill-white font-medium'>
                  10 YEARS (TIPPING POINT)
                </text>
                <text x='80' y='42' className='text-[3px] fill-orange-300 font-bold'>
                  MONEY PIT
                </text>
              </svg>
              <div className='absolute bottom-0 left-0 w-full flex justify-between text-xs text-rose-300/50 font-mono pt-2'>
                <span>Year 0</span>
                <span>Year 5</span>
                <span>Year 10</span>
                <span>Year 15</span>
                <span>Year 20</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: THE COST ANATOMY */}
      <section>
        <div className='text-center max-w-2xl mx-auto mb-16'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/50 border border-rose-200 text-rose-800 text-xs font-medium mb-6'>
            <Activity className='w-3 h-3' />
            MARKET DATA
          </div>
          <h2 className='text-3xl md:text-5xl font-bold text-rose-950 tracking-tight mb-4'>
            What does a repair usually cost?
          </h2>
          <p className='text-xl text-rose-900/60 leading-relaxed'>
            Transparency is our policy. Here are the average price ranges for common furnace
            failures in our area.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-6'>
          <PriceCard
            part='Ignitor / Flame Sensor'
            range='$180 - $350'
            desc='The most common failure. It lights the gas. Small part, critical function.'
          />
          <PriceCard
            part='Blower Motor'
            range='$450 - $900'
            desc="The fan that pushes air. Costs vary heavily depending on if it's 'Standard' or 'High Efficiency'."
          />
          <PriceCard
            part='Control Board'
            range='$600 - $1,200'
            desc='The brain of the furnace. If this dies, the system is brain dead. Expensive, but vital.'
          />
        </div>

        <div className='mt-8 text-center'>
          <p className='text-sm text-rose-900/40'>
            *These are market averages for context only. Your exact quote is generated digitally
            after diagnosis.
          </p>
        </div>
      </section>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function DIYCard({ icon, title, desc, action }) {
  return (
    <div className='bg-white border border-rose-100 p-8 rounded-[32px] hover:shadow-xl hover:shadow-rose-900/5 transition-all group cursor-default'>
      <div className='w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mb-6 group-hover:scale-110 transition-transform'>
        {icon}
      </div>
      <h3 className='text-xl font-bold text-rose-950 mb-3'>{title}</h3>
      <p className='text-rose-900/60 text-sm leading-relaxed mb-6'>{desc}</p>
      <div className='flex items-center gap-2 text-rose-600 font-bold text-sm bg-rose-50 px-4 py-3 rounded-xl'>
        <HelpCircle className='w-4 h-4' />
        {action}
      </div>
    </div>
  );
}

function PriceCard({ part, range, desc }) {
  return (
    <div className='relative overflow-hidden bg-white/40 backdrop-blur-sm border border-rose-200/50 p-8 rounded-3xl group hover:bg-white/60 transition-colors'>
      <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500/0 via-rose-500/50 to-rose-500/0 opacity-50' />
      <div className='flex justify-between items-start mb-4'>
        <h3 className='font-bold text-rose-950 text-lg'>{part}</h3>
        <TrendingUp className='w-5 h-5 text-rose-300' />
      </div>
      <div className='text-3xl font-bold text-rose-600 mb-4 tracking-tight group-hover:scale-105 transition-transform origin-left'>
        {range}
      </div>
      <p className='text-rose-900/60 text-sm leading-relaxed'>{desc}</p>
    </div>
  );
}
