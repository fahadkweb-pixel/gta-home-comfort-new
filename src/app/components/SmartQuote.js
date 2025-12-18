'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  AlertTriangle,
  Clock,
  Calendar,
  Flame,
  Zap,
  Snowflake,
  HelpCircle,
  FileText,
  MapPin,
  Phone,
  Wind,
  Droplets,
} from 'lucide-react';

// Step 1: Safety | Step 2: Urgency | Step 3: Type | Step 4: Age | Step 5: Details | Step 6: Contact
const TOTAL_STEPS = 6;

export default function SmartQuote({ issueType, onBack }) {
  const [step, setStep] = useState(1);
  const [isUnsafe, setIsUnsafe] = useState(false); // Tracks if user hit the "Gas/Sparks" kill switch

  const [formData, setFormData] = useState({
    safety: '',
    urgency: '',
    systemType: '',
    systemAge: '',
    details: '',
    contact: '',
    postal: '',
  });

  const goNext = useCallback((key, value) => {
    // Save data
    setFormData((prev) => ({ ...prev, [key]: value }));

    // Logic: If Safety is 'YES' (Unsafe), trigger the kill switch screen
    if (key === 'safety' && value === 'UNSAFE') {
      setIsUnsafe(true);
      return;
    }

    // Proceed to next step
    setStep((prev) => Math.min(TOTAL_STEPS + 1, prev + 1));
  }, []);

  const goPrev = useCallback(() => {
    if (isUnsafe) {
      setIsUnsafe(false); // Return from unsafe screen to safety question
    } else {
      setStep((prev) => Math.max(1, prev - 1));
    }
  }, [isUnsafe]);

  const handleHeaderBack = useCallback(() => {
    if (step === 1 && !isUnsafe) onBack?.();
    else goPrev();
  }, [step, isUnsafe, onBack, goPrev]);

  // Progress Bar Segments
  const progressSegments = useMemo(() => Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1), []);

  // --- RENDER: KILL SWITCH (GAS LEAK) ---
  if (isUnsafe) {
    return (
      <div className='w-full mx-auto animate-in fade-in zoom-in duration-300'>
        <div className='bg-red-500 text-white rounded-[32px] p-8 md:p-12 shadow-2xl shadow-red-500/30 text-center relative overflow-hidden'>
          <div className='absolute top-0 left-0 w-full h-full bg-[url("https://www.transparenttextures.com/patterns/diagmonds-light.png")] opacity-10' />

          <div className='relative z-10 flex flex-col items-center'>
            <div className='w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-pulse'>
              <AlertTriangle className='w-10 h-10 text-white' />
            </div>

            <h2 className='text-3xl md:text-4xl font-bold mb-4'>Stop Immediately.</h2>
            <p className='text-white/90 text-lg md:text-xl mb-8 leading-relaxed max-w-lg'>
              Gas leaks and electrical sparks are life-threatening emergencies. Do not use this
              form. Evacuate your home and call Enbridge now.
            </p>

            <a
              href='tel:18667635427'
              className='bg-white text-red-600 font-bold py-4 px-8 rounded-2xl text-lg hover:bg-red-50 transition-all w-full max-w-sm flex items-center justify-center gap-2 mb-4'
            >
              <Phone className='w-5 h-5' /> Call 1-866-763-5427
            </a>

            <button
              onClick={() => setIsUnsafe(false)}
              className='text-white/60 hover:text-white text-sm font-semibold mt-4 underline decoration-white/30'
            >
              I made a mistake, it's safe.
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: STANDARD FORM ---
  return (
    <div className='w-full mx-auto animate-in fade-in zoom-in duration-300'>
      {/* GLASS CONTAINER */}
      <div className='relative overflow-hidden bg-white/60 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-rose-900/10 rounded-[32px] ring-1 ring-white/50'>
        {/* Header */}
        <div className='px-6 py-6 md:px-8 flex justify-between items-center'>
          <button
            type='button'
            onClick={handleHeaderBack}
            className='group flex items-center gap-2 text-sm font-semibold text-rose-800/60 hover:text-rose-950 transition-colors px-3 py-1.5 rounded-full hover:bg-white/50'
          >
            <ChevronLeft className='w-4 h-4 group-hover:-translate-x-0.5 transition-transform' />
            Back
          </button>

          {/* Progress Bar */}
          <div className='hidden sm:flex gap-1.5' aria-label='Progress'>
            {progressSegments.map((i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-all duration-500 ${
                  step >= i ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 'bg-rose-200/30'
                }`}
              />
            ))}
          </div>
          <div className='sm:hidden text-xs font-bold text-rose-400'>
            Step {step} of {TOTAL_STEPS}
          </div>
        </div>

        {/* Content Area */}
        <div className='p-6 md:p-10 min-h-[400px] flex flex-col justify-center max-w-xl mx-auto w-full'>
          {/* STEP 1: SAFETY (The Filter) */}
          {step === 1 && (
            <div className='animate-in slide-in-from-right-8 duration-500 space-y-6'>
              <div className='text-center'>
                <h2 className='text-3xl font-bold text-rose-950 mb-3'>Safety Check</h2>
                <p className='text-rose-900/60 font-medium'>
                  Do you smell gas (rotten eggs) or see sparks?
                </p>
              </div>

              <div className='grid gap-3'>
                <SelectionTile
                  icon={<AlertTriangle className='text-red-500' />}
                  title='Yes, I do'
                  desc='Potential Danger'
                  onClick={() => goNext('safety', 'UNSAFE')}
                />
                <SelectionTile
                  icon={<CheckCircle2 className='text-emerald-500' />}
                  title='No, it looks safe'
                  desc='Proceed to booking'
                  onClick={() => goNext('safety', 'SAFE')}
                />
              </div>

              <div className='p-4 bg-rose-50 rounded-xl border border-rose-100 flex gap-3 items-start'>
                <div className='bg-white p-1.5 rounded-full shadow-sm'>
                  <Phone className='w-3 h-3 text-rose-500' />
                </div>
                <p className='text-xs text-rose-800/70 leading-relaxed'>
                  <strong>Note:</strong> If this is an emergency involving gas, stop and call
                  Enbridge Gas immediately at{' '}
                  <a href='tel:18667635427' className='underline font-bold'>
                    1-866-763-5427
                  </a>
                  .
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: URGENCY */}
          {step === 2 && (
            <div className='animate-in slide-in-from-right-8 duration-500 space-y-6'>
              <div className='text-center'>
                <h2 className='text-3xl font-bold text-rose-950 mb-3'>How urgent is this?</h2>
              </div>

              <div className='grid gap-3'>
                <SelectionTile
                  icon={<Flame className='text-rose-500' />}
                  title='Emergency'
                  desc='No heat / Flooding / Safety Risk'
                  onClick={() => goNext('urgency', 'EMERGENCY')}
                />
                <SelectionTile
                  icon={<Clock className='text-orange-500' />}
                  title='Urgent'
                  desc='Needs attention within 24h'
                  onClick={() => goNext('urgency', 'URGENT')}
                />
                <SelectionTile
                  icon={<Calendar className='text-blue-500' />}
                  title='Flexible'
                  desc='Routine check / Maintenance'
                  onClick={() => goNext('urgency', 'FLEXIBLE')}
                />
              </div>
            </div>
          )}

          {/* STEP 3: SYSTEM TYPE */}
          {step === 3 && (
            <div className='animate-in slide-in-from-right-8 duration-500 space-y-6'>
              <div className='text-center'>
                <h2 className='text-3xl font-bold text-rose-950 mb-3'>What system do you have?</h2>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <SelectionTile
                  icon={<Flame />}
                  title='Furnace'
                  onClick={() => goNext('systemType', 'FURNACE')}
                />
                <SelectionTile
                  icon={<Droplets />}
                  title='Boiler'
                  onClick={() => goNext('systemType', 'BOILER')}
                />
                <SelectionTile
                  icon={<Snowflake />}
                  title='A/C'
                  onClick={() => goNext('systemType', 'AC')}
                />
                <SelectionTile
                  icon={<Wind />}
                  title='Heat Pump'
                  onClick={() => goNext('systemType', 'HEATPUMP')}
                />
                <SelectionTile
                  icon={<HelpCircle />}
                  title='Not Sure'
                  onClick={() => goNext('systemType', 'UNKNOWN')}
                  className='sm:col-span-2'
                />
              </div>
            </div>
          )}

          {/* STEP 4: SYSTEM AGE */}
          {step === 4 && (
            <div className='animate-in slide-in-from-right-8 duration-500 space-y-6'>
              <div className='text-center'>
                <h2 className='text-3xl font-bold text-rose-950 mb-3'>How old is the system?</h2>
              </div>

              <div className='grid gap-3'>
                <SelectionTile
                  title='Less than 10 years'
                  sub='Modern'
                  onClick={() => goNext('systemAge', 'NEW')}
                />
                <SelectionTile
                  title='10–20 years'
                  sub='Aging'
                  onClick={() => goNext('systemAge', 'OLD')}
                />
                <SelectionTile
                  title='20+ years'
                  sub='Vintage'
                  onClick={() => goNext('systemAge', 'ANCIENT')}
                />
                <SelectionTile title='Not Sure' onClick={() => goNext('systemAge', 'UNKNOWN')} />
              </div>
            </div>
          )}

          {/* STEP 5: DETAILS (FREE TEXT) */}
          {step === 5 && (
            <div className='animate-in slide-in-from-right-8 duration-500 space-y-6'>
              <div className='text-center'>
                <h2 className='text-3xl font-bold text-rose-950 mb-3'>Anything else?</h2>
                <p className='text-rose-900/60 font-medium'>
                  Error codes, recent repairs, or unusual noises. (Optional)
                </p>
              </div>

              <div className='relative'>
                <textarea
                  className='w-full h-40 p-5 rounded-2xl bg-white/50 border border-rose-200/50 focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10 outline-none transition-all resize-none text-rose-900 placeholder:text-rose-300 text-lg'
                  placeholder='Describe the issue here...'
                  value={formData.details}
                  onChange={(e) => setFormData((prev) => ({ ...prev, details: e.target.value }))}
                  autoFocus
                />
                <div className='absolute bottom-4 right-4 text-xs font-bold text-rose-300 pointer-events-none'>
                  <FileText className='w-4 h-4 inline mr-1' />
                  Note
                </div>
              </div>

              <button
                onClick={() => goNext('details', formData.details)}
                className='w-full bg-rose-950 hover:bg-rose-900 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-900/20 transition-all flex items-center justify-center gap-2'
              >
                Continue <ArrowRight className='w-5 h-5' />
              </button>
              <button
                onClick={() => goNext('details', 'SKIPPED')}
                className='w-full text-rose-400 hover:text-rose-600 font-semibold py-2 text-sm'
              >
                Skip this step
              </button>
            </div>
          )}

          {/* STEP 6: CONTACT */}
          {step === 6 && (
            <div className='animate-in slide-in-from-right-8 duration-500 max-w-sm mx-auto w-full'>
              <div className='text-center mb-8'>
                <div className='w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-emerald-500/20'>
                  <CheckCircle2 className='w-8 h-8 text-emerald-600' />
                </div>
                <h2 className='text-2xl font-bold text-rose-950 mb-2'>Slots Available.</h2>
                <p className='text-rose-900/60 text-sm'>
                  Where should we send the confirmation link?
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (formData.contact.trim()) goNext('contact', formData.contact.trim());
                }}
                className='space-y-3'
              >
                <div className='relative group'>
                  <input
                    type='tel'
                    placeholder='(416) 555-0123'
                    value={formData.contact}
                    onChange={(e) => setFormData((prev) => ({ ...prev, contact: e.target.value }))}
                    className='w-full p-5 bg-white/50 border border-white/40 shadow-inner rounded-2xl text-2xl text-center font-bold tracking-wider text-rose-950 placeholder:text-rose-200 outline-none ring-1 ring-rose-200 focus:ring-2 focus:ring-rose-500 transition-all'
                    required
                    autoFocus
                  />
                </div>

                <div className='relative group'>
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <MapPin className='h-5 w-5 text-rose-300' />
                  </div>
                  <input
                    type='text'
                    placeholder='Postal Code (Optional)'
                    value={formData.postal}
                    onChange={(e) => setFormData((prev) => ({ ...prev, postal: e.target.value }))}
                    className='w-full p-4 pl-12 bg-white/30 border border-white/40 rounded-xl text-center font-medium text-rose-900 placeholder:text-rose-300 outline-none focus:bg-white/50 focus:ring-2 focus:ring-rose-500/50 transition-all'
                  />
                </div>

                <button
                  type='submit'
                  className='w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4'
                >
                  See Booking Slots <ArrowRight className='w-5 h-5' />
                </button>
              </form>
            </div>
          )}

          {/* STEP 7: SUCCESS */}
          {step === 7 && (
            <div className='text-center animate-in zoom-in duration-500 py-8'>
              <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 mb-6'>
                <CheckCircle2 className='w-10 h-10' />
              </div>
              <h2 className='text-3xl font-bold text-rose-950 mb-3'>Sent.</h2>
              <p className='text-rose-900/60 mb-8 max-w-xs mx-auto text-lg'>
                We've matched you with a technician. Check your text messages for the confirmed
                booking link.
              </p>
              <button
                type='button'
                onClick={onBack}
                className='text-rose-500 hover:text-rose-700 font-semibold text-sm transition-colors'
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Mini-Tile Component for Options
function SelectionTile({ icon, title, desc, sub, onClick, className = '' }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl bg-white/40 hover:bg-white/80 border border-white/50 hover:border-rose-200 transition-all duration-200 group flex items-center gap-4 active:scale-[0.98] ${className}`}
    >
      {icon && (
        <div className='p-2 bg-white rounded-xl shadow-sm text-lg text-rose-900/80 group-hover:text-rose-500 group-hover:scale-110 transition-all duration-300'>
          {icon}
        </div>
      )}

      <div>
        <div className='font-bold text-rose-950 text-base leading-tight group-hover:text-rose-600 transition-colors'>
          {title}
        </div>
        {desc && <div className='text-xs text-rose-500/80 font-medium mt-0.5'>{desc}</div>}
        {sub && <div className='text-xs text-rose-400 font-medium mt-0.5'>{sub}</div>}
      </div>

      <div className='ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0'>
        <ArrowRight className='w-4 h-4 text-rose-400' />
      </div>
    </button>
  );
}
