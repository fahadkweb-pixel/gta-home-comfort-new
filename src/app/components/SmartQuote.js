'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Flame,
  Snowflake,
  Wind,
  Droplets,
  Zap,
  ThermometerSnowflake,
  HelpCircle,
  AlertTriangle,
  CalendarCheck,
  Phone,
  User,
  Mail,
  AlertOctagon,
  Fan, // Importing Fan icon for Air Quality
} from 'lucide-react';

// --- CONFIGURATION: LOGIC MAPS ---

// 1. CATEGORIES: Maps the input 'issueType' (from Tile) to a broad category
const getCategory = (label) => {
  const l = label?.toLowerCase() || '';
  // New check for Air Quality keywords
  if (
    l.includes('purif') ||
    l.includes('humid') ||
    l.includes('quality') ||
    (l.includes('air') && !l.includes('condition'))
  )
    return 'AIR_QUALITY';
  if (l.includes('heat') || l.includes('warm')) return 'HEATING';
  if (l.includes('cool') || l.includes('ac')) return 'COOLING';
  if (l.includes('water') || l.includes('tank')) return 'WATER';
  return 'OTHER';
};

// 2. SYSTEMS: What equipment exists in each category?
const SYSTEM_OPTIONS = {
  HEATING: [
    { id: 'FURNACE', label: 'Furnace', icon: <Flame className='text-orange-500' /> },
    { id: 'BOILER', label: 'Boiler', icon: <Droplets className='text-blue-500' /> },
    { id: 'HEATPUMP', label: 'Heat Pump', icon: <Wind className='text-emerald-500' /> },
    { id: 'FIREPLACE', label: 'Gas Fireplace', icon: <Flame className='text-rose-500' /> },
  ],
  COOLING: [
    { id: 'AC', label: 'Central A/C', icon: <Snowflake className='text-blue-400' /> },
    { id: 'HEATPUMP', label: 'Heat Pump', icon: <Wind className='text-emerald-500' /> },
    {
      id: 'DUCTLESS',
      label: 'Ductless Split',
      icon: <ThermometerSnowflake className='text-cyan-500' />,
    },
  ],
  WATER: [
    { id: 'TANK', label: 'Hot Water Tank', icon: <Droplets className='text-blue-500' /> },
    { id: 'TANKLESS', label: 'Tankless Heater', icon: <Zap className='text-yellow-500' /> },
  ],
  // --- NEW CATEGORY: AIR QUALITY ---
  AIR_QUALITY: [
    {
      id: 'HUMIDIFIER',
      label: 'Whole-Home Humidifier',
      icon: <Droplets className='text-blue-400' />,
    },
    { id: 'PURIFIER', label: 'Air Purifier / HEPA', icon: <Fan className='text-cyan-500' /> },
    { id: 'HRV_ERV', label: 'HRV / ERV Unit', icon: <Wind className='text-emerald-500' /> },
  ],
  // ---------------------------------
  OTHER: [
    { id: 'FURNACE', label: 'Furnace', icon: <Flame /> },
    { id: 'AC', label: 'A/C', icon: <Snowflake /> },
    { id: 'WATER', label: 'Water Heater', icon: <Droplets /> },
    { id: 'OTHER', label: 'Other', icon: <HelpCircle /> },
  ],
};

// 3. ISSUES: What goes wrong with that specific equipment?
const ISSUE_OPTIONS = {
  // Generic fallbacks if specific ID isn't found
  DEFAULT: [
    { id: 'BROKEN', label: 'Not Working', desc: "System won't turn on" },
    { id: 'NOISE', label: 'Weird Noise', desc: 'Banging, humming, or clicking' },
    { id: 'LEAK', label: 'Water Leak', desc: 'Water pooling around unit' },
    { id: 'MAINTENANCE', label: 'Maintenance', desc: 'Yearly cleaning & tune-up' },
  ],
  // Heating Specifics
  FURNACE: [
    { id: 'NO_HEAT', label: 'No Heat', desc: 'Blowing cold air or nothing' },
    { id: 'NOISE', label: 'Loud Noise', desc: 'Banging or squealing' },
    { id: 'CYCLE', label: 'Short Cycling', desc: 'Turns on/off constantly' },
    { id: 'MAINTENANCE', label: 'Tune-Up', desc: 'Annual safety check' },
  ],
  // Cooling Specifics
  AC: [
    { id: 'NO_COOL', label: 'No Cool Air', desc: 'House is getting hot' },
    { id: 'LEAK', label: 'Leaking Water', desc: 'Water near the furnace' },
    { id: 'FROZEN', label: 'Frozen Coil', desc: 'Ice on the pipes' },
    { id: 'MAINTENANCE', label: 'Tune-Up', desc: 'Annual cleaning' },
  ],
  // Water Specifics
  TANK: [
    { id: 'NO_HOT', label: 'No Hot Water', desc: 'Water is freezing' },
    { id: 'LEAK', label: 'Leaking', desc: 'Puddle at base of tank' },
    { id: 'RUST', label: 'Rusty Water', desc: 'Discolored water' },
  ],
  // --- NEW AIR QUALITY ISSUES ---
  HUMIDIFIER: [
    { id: 'NOT_WORKING', label: 'Not Working', desc: 'House feels too dry' },
    { id: 'LEAK', label: 'Leaking Water', desc: 'Water around the unit' },
    { id: 'MAINTENANCE', label: 'Replace Pad/Filter', desc: 'Routine maintenance' },
  ],
  PURIFIER: [
    { id: 'NOT_WORKING', label: 'Not Working', desc: "Won't turn on" },
    { id: 'FILTER_LIGHT', label: 'Filter Light On', desc: 'Needs new media filter' },
    { id: 'NOISE', label: 'Loud Noise', desc: 'Fan is making noise' },
  ],
  HRV_ERV: [
    { id: 'NOT_WORKING', label: 'Not Working', desc: 'Stale air in house' },
    { id: 'FILTER_CLEAN', label: 'Needs Cleaning', desc: 'Routine core cleaning' },
    { id: 'NOISE', label: 'Loud Noise', desc: 'Fan or motor noise' },
  ],
  // ------------------------------
};

// --- MAIN COMPONENT ---

export default function SmartQuote({ issueType, onBack }) {
  // View State: SAFETY -> WIZARD -> SUCCESS
  const [view, setView] = useState('SAFETY');
  const [isUnsafe, setIsUnsafe] = useState(false); // Tracks if user hit the "Gas/Sparks" button

  // Wizard Steps: 1=System, 2=Issue, 3=Contact
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 3;

  const [formData, setFormData] = useState({
    category: getCategory(issueType),
    system: '',
    issue: '',
    name: '',
    phone: '',
    email: '',
  });

  // --- HELPER LOGIC ---
  const currentSystems = useMemo(
    () => SYSTEM_OPTIONS[formData.category] || SYSTEM_OPTIONS.OTHER,
    [formData.category]
  );

  const currentIssues = useMemo(() => {
    return ISSUE_OPTIONS[formData.system] || ISSUE_OPTIONS.DEFAULT;
  }, [formData.system]);

  const handleNext = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));

    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
    } else {
      setView('SUCCESS');
    }
  };

  const handleBack = () => {
    // If on the red unsafe screen, go back to safety question
    if (isUnsafe) {
      setIsUnsafe(false);
      return;
    }

    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      // Go back to Safety Check start
      onBack();
    }
  };

  // --- RENDER 1: SAFETY CHECK (Integrated Logic) ---
  if (view === 'SAFETY') {
    // A. RED WARNING SCREEN
    if (isUnsafe) {
      return (
        <div className='w-full mx-auto animate-in fade-in zoom-in duration-300 max-w-2xl'>
          <div className='bg-red-600 text-white rounded-[32px] p-8 md:p-12 shadow-2xl shadow-red-600/30 text-center relative overflow-hidden'>
            {/* Background pattern overlay */}
            <div className='absolute top-0 left-0 w-full h-full bg-[url("https://www.transparenttextures.com/patterns/diagmonds-light.png")] opacity-10 mix-blend-overlay pointer-events-none' />

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
                className='bg-white text-red-600 font-bold py-4 px-8 rounded-2xl text-lg hover:bg-red-50 transition-all w-full max-w-sm flex items-center justify-center gap-2 mb-4 shadow-lg'
              >
                <Phone className='w-5 h-5' /> Call 1-866-763-5427
              </a>

              <button
                onClick={() => setIsUnsafe(false)}
                className='text-white/70 hover:text-white text-sm font-semibold mt-4 underline decoration-white/30 transition-colors'
              >
                I made a mistake, it's safe.
              </button>
            </div>
          </div>
        </div>
      );
    }

    // B. INITIAL QUESTION SCREEN
    return (
      <div className='w-full mx-auto animate-in fade-in zoom-in duration-300 max-w-2xl'>
        {/* GLASS CONTAINER */}
        <div className='relative overflow-hidden bg-white/60 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-rose-900/10 rounded-[32px] ring-1 ring-white/50'>
          {/* Header */}
          <div className='px-6 py-6 md:px-8 flex justify-between items-center'>
            <button
              type='button'
              onClick={onBack}
              className='group flex items-center gap-2 text-sm font-semibold text-rose-800/60 hover:text-rose-950 transition-colors px-3 py-1.5 rounded-full hover:bg-white/50'
            >
              <ChevronLeft className='w-4 h-4 group-hover:-translate-x-0.5 transition-transform' />
              Home
            </button>
            <div className='text-xs font-bold text-rose-400 uppercase tracking-widest'>
              Safety First
            </div>
          </div>

          {/* Content Area */}
          <div className='p-6 md:p-10 min-h-[400px] flex flex-col justify-center max-w-xl mx-auto w-full'>
            <div className='animate-in slide-in-from-right-8 duration-500 space-y-8'>
              <div className='text-center'>
                <div className='inline-flex p-3 bg-amber-100 text-amber-600 rounded-full mb-4'>
                  <AlertTriangle className='w-6 h-6' />
                </div>
                <h2 className='text-3xl font-bold text-rose-950 mb-3'>Safety Check</h2>
                <p className='text-rose-900/60 font-medium text-lg leading-relaxed max-w-md mx-auto'>
                  Before we start, do you smell gas (rotten eggs) or see electrical sparks?
                </p>
              </div>

              <div className='grid gap-4 md:grid-cols-2'>
                <SelectionTile
                  icon={<CheckCircle2 className='text-emerald-500' />}
                  title='No, it looks safe'
                  desc='Proceed to booking'
                  onClick={() => setView('WIZARD')}
                  className='border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/80 hover:border-emerald-300'
                />
                <SelectionTile
                  icon={<AlertTriangle className='text-red-500' />}
                  title='Yes, I do'
                  desc='Potential Danger'
                  onClick={() => setIsUnsafe(true)}
                  className='border-red-100 bg-red-50/50 hover:bg-red-100/80 hover:border-red-300'
                />
              </div>

              <div className='p-4 bg-rose-50 rounded-xl border border-rose-100 flex gap-3 items-start'>
                <Phone className='w-4 h-4 text-rose-500 shrink-0 mt-0.5' />
                <p className='text-xs text-rose-800/70 leading-relaxed'>
                  <strong>Note:</strong> If this is an emergency involving gas, call Enbridge Gas
                  immediately at 1-866-763-5427.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER 2: SUCCESS / BOOKING ---
  if (view === 'SUCCESS') {
    // Determine Output Type: Call vs Book
    const isEmergency =
      formData.issue === 'NO_HEAT' || formData.issue === 'NO_COOL' || formData.issue === 'LEAK';

    if (isEmergency && formData.category === 'HEATING') {
      return <EmergencyOutput onBack={onBack} />;
    }

    return <BookingOutput contact={formData.phone} onBack={onBack} />;
  }

  // --- RENDER 3: WIZARD ---
  const progressPercent = (step / TOTAL_STEPS) * 100;

  return (
    <div className='w-full mx-auto animate-in fade-in zoom-in duration-300'>
      <div className='relative overflow-hidden bg-white/60 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-rose-900/10 rounded-[32px] ring-1 ring-white/50'>
        {/* Header */}
        <div className='px-6 py-6 md:px-8 flex justify-between items-center border-b border-rose-100/50'>
          <button
            type='button'
            onClick={handleBack}
            className='group flex items-center gap-2 text-sm font-semibold text-rose-800/60 hover:text-rose-950 transition-colors px-3 py-1.5 rounded-full hover:bg-white/50'
          >
            <ChevronLeft className='w-4 h-4 group-hover:-translate-x-0.5 transition-transform' />
            Back
          </button>

          <div className='flex flex-col items-end'>
            <span className='text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1'>
              Step {step} of {TOTAL_STEPS}
            </span>
            <div className='w-24 h-1 bg-rose-100 rounded-full overflow-hidden'>
              <div
                className='h-full bg-rose-500 transition-all duration-500'
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className='p-6 md:p-10 min-h-[400px] flex flex-col justify-center max-w-xl mx-auto w-full'>
          {/* STEP 1: SYSTEM SELECTION */}
          {step === 1 && (
            <div className='animate-in slide-in-from-right-8 duration-500 space-y-6'>
              <div className='text-center'>
                <h2 className='text-3xl font-bold text-rose-950 mb-3'>Which system do you have?</h2>
                <p className='text-rose-900/60 font-medium'>
                  Select the equipment that needs service.
                </p>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {currentSystems.map((opt) => (
                  <SelectionTile
                    key={opt.id}
                    icon={opt.icon}
                    title={opt.label}
                    onClick={() => handleNext('system', opt.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: ISSUE SELECTION */}
          {step === 2 && (
            <div className='animate-in slide-in-from-right-8 duration-500 space-y-6'>
              <div className='text-center'>
                <h2 className='text-3xl font-bold text-rose-950 mb-3'>
                  What seems to be the problem?
                </h2>
                <p className='text-rose-900/60 font-medium'>
                  This helps us prepare the right parts.
                </p>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {currentIssues.map((opt) => (
                  <SelectionTile
                    key={opt.id}
                    title={opt.label}
                    desc={opt.desc}
                    onClick={() => handleNext('issue', opt.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: CONTACT FORM */}
          {step === 3 && (
            <div className='animate-in slide-in-from-right-8 duration-500 max-w-sm mx-auto w-full'>
              <div className='text-center mb-8'>
                <div className='w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500'>
                  <User className='w-8 h-8' />
                </div>
                <h2 className='text-2xl font-bold text-rose-950 mb-2'>Almost done.</h2>
                <p className='text-rose-900/60 text-sm'>
                  Where should we send the booking confirmation?
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (formData.name && formData.phone) handleNext('contact', 'SUBMIT');
                }}
                className='space-y-4'
              >
                <div className='relative group'>
                  <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300' />
                  <input
                    type='text'
                    placeholder='Your Name'
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className='w-full p-4 pl-12 bg-white/50 border border-white/40 rounded-2xl text-rose-950 placeholder:text-rose-300 outline-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 transition-all'
                    required
                    autoFocus
                  />
                </div>

                <div className='relative group'>
                  <Phone className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300' />
                  <input
                    type='tel'
                    placeholder='Phone Number'
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className='w-full p-4 pl-12 bg-white/50 border border-white/40 rounded-2xl text-rose-950 placeholder:text-rose-300 outline-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 transition-all'
                    required
                  />
                </div>

                <div className='relative group'>
                  <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300' />
                  <input
                    type='email'
                    placeholder='Email (Optional)'
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className='w-full p-4 pl-12 bg-white/50 border border-white/40 rounded-2xl text-rose-950 placeholder:text-rose-300 outline-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 transition-all'
                  />
                </div>

                <button
                  type='submit'
                  className='w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2'
                >
                  Continue to Booking <ArrowRight className='w-5 h-5' />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- OUTPUT SCREENS ---

function BookingOutput({ contact, onBack }) {
  return (
    <div className='text-center animate-in zoom-in duration-500 py-12 max-w-lg mx-auto'>
      <div className='inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 mb-6'>
        <CheckCircle2 className='w-12 h-12' />
      </div>
      <h2 className='text-3xl font-bold text-rose-950 mb-4'>Request Received.</h2>
      <p className='text-rose-900/70 mb-8 text-lg leading-relaxed'>
        We have your info, {contact ? `and we'll text ${contact} shortly.` : ''} <br />
        To secure your slot immediately, please choose a time on our calendar below.
      </p>

      {/* CALENDLY BUTTON / PLACEHOLDER */}
      <a
        href='https://calendly.com/'
        target='_blank'
        rel='noopener noreferrer'
        className='inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-600/20 text-xl transition-all mb-4'
      >
        <CalendarCheck className='w-6 h-6' />
        Pick Your Time Slot
      </a>

      <button
        onClick={onBack}
        className='text-rose-400 hover:text-rose-600 font-semibold text-sm mt-4'
      >
        Return to Dashboard
      </button>
    </div>
  );
}

function EmergencyOutput({ onBack }) {
  return (
    <div className='text-center animate-in zoom-in duration-500 py-12 max-w-lg mx-auto'>
      <div className='inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 text-red-600 mb-6 animate-pulse'>
        <AlertTriangle className='w-12 h-12' />
      </div>
      <h2 className='text-3xl font-bold text-rose-950 mb-4'>Priority Action Required.</h2>
      <p className='text-rose-900/80 mb-8 text-lg leading-relaxed'>
        Since you have <strong>No Heat</strong>, we have flagged this as urgent. <br />
        Please call dispatch directly to bypass the online queue.
      </p>
      <a
        href='tel:4165550199'
        className='block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-red-600/20 text-xl transition-all mb-4'
      >
        Call Dispatch: 416-555-0199
      </a>
      <button
        onClick={onBack}
        className='text-rose-400 hover:text-rose-600 text-sm font-semibold underline'
      >
        I'll book online anyway
      </button>
    </div>
  );
}

// --- SUB-COMPONENT: SELECTION TILE ---
function SelectionTile({ icon, title, desc, onClick, className = '' }) {
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
      </div>

      <div className='ml-auto opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0'>
        <ArrowRight className='w-4 h-4 text-rose-400' />
      </div>
    </button>
  );
}
