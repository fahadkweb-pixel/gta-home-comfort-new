'use client';

import { useState, useMemo, useEffect } from 'react';
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
  Fan,
  MapPin,
  RefreshCw, // Icon for Replace
  PlusCircle, // Icon for New Install
} from 'lucide-react';
import { PopupModal } from 'react-calendly';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

// --- CONFIGURATION: LOGIC MAPS ---

const getCategory = (label) => {
  const l = label?.toLowerCase() || '';
  if (l.includes('install') || l.includes('new') || l.includes('replace') || l.includes('quote'))
    return 'INSTALLATION';
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

const SYSTEM_OPTIONS = {
  INSTALLATION: [
    { id: 'FURNACE', label: 'New Furnace', icon: <Flame className='text-orange-500' /> },
    { id: 'AC', label: 'New A/C', icon: <Snowflake className='text-blue-400' /> },
    { id: 'HEATPUMP', label: 'New Heat Pump', icon: <Wind className='text-emerald-500' /> },
    { id: 'TANKLESS', label: 'Tankless Water Heater', icon: <Zap className='text-yellow-500' /> },
  ],
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
  AIR_QUALITY: [
    {
      id: 'HUMIDIFIER',
      label: 'Whole-Home Humidifier',
      icon: <Droplets className='text-blue-400' />,
    },
    { id: 'PURIFIER', label: 'Air Purifier / HEPA', icon: <Fan className='text-cyan-500' /> },
    { id: 'HRV_ERV', label: 'HRV / ERV Unit', icon: <Wind className='text-emerald-500' /> },
  ],
  OTHER: [
    { id: 'FURNACE', label: 'Furnace', icon: <Flame /> },
    { id: 'AC', label: 'A/C', icon: <Snowflake /> },
    { id: 'WATER', label: 'Water Heater', icon: <Droplets /> },
    { id: 'OTHER', label: 'Other', icon: <HelpCircle /> },
  ],
};

const ISSUE_OPTIONS = {
  // --- UPDATED INSTALLATION OPTIONS ---
  INSTALLATION_TYPE: [
    {
      id: 'REPLACE',
      label: 'Replace Existing System',
      desc: 'Swapping out an old unit',
      icon: <RefreshCw className='text-blue-500' />,
    },
    {
      id: 'NEW_INSTALL',
      label: 'Install New System',
      desc: 'Adding a unit where none exists',
      icon: <PlusCircle className='text-emerald-500' />,
    },
    { id: 'NOT_SURE', label: 'Not Sure / Other', desc: 'I need a professional opinion' },
  ],
  // ------------------------------------
  DEFAULT: [
    { id: 'BROKEN', label: 'Not Working', desc: "System won't turn on" },
    { id: 'NOISE', label: 'Weird Noise', desc: 'Banging, humming, or clicking' },
    { id: 'LEAK', label: 'Water Leak', desc: 'Water pooling around unit' },
    { id: 'MAINTENANCE', label: 'Maintenance', desc: 'Yearly cleaning & tune-up' },
  ],
  FURNACE: [
    { id: 'NO_HEAT', label: 'No Heat', desc: 'Blowing cold air or nothing' },
    { id: 'NOISE', label: 'Loud Noise', desc: 'Banging or squealing' },
    { id: 'CYCLE', label: 'Short Cycling', desc: 'Turns on/off constantly' },
    { id: 'MAINTENANCE', label: 'Tune-Up', desc: 'Annual safety check' },
  ],
  AC: [
    { id: 'NO_COOL', label: 'No Cool Air', desc: 'House is getting hot' },
    { id: 'LEAK', label: 'Leaking Water', desc: 'Water near the furnace' },
    { id: 'FROZEN', label: 'Frozen Coil', desc: 'Ice on the pipes' },
    { id: 'MAINTENANCE', label: 'Tune-Up', desc: 'Annual cleaning' },
  ],
  TANK: [
    { id: 'NO_HOT', label: 'No Hot Water', desc: 'Water is freezing' },
    { id: 'LEAK', label: 'Leaking', desc: 'Puddle at base of tank' },
    { id: 'RUST', label: 'Rusty Water', desc: 'Discolored water' },
  ],
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
};

export default function SmartQuote({ issueType, onBack }) {
  // 1. CALCULATE CATEGORY IMMEDIATELY
  const initialCategory = useMemo(() => getCategory(issueType), [issueType]);

  // 2. SET INITIAL VIEW: Bypass SAFETY if it's an Installation
  const [view, setView] = useState(initialCategory === 'INSTALLATION' ? 'WIZARD' : 'SAFETY');

  const [isUnsafe, setIsUnsafe] = useState(false);
  const [overrideEmergency, setOverrideEmergency] = useState(false);
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 3;

  const [formData, setFormData] = useState({
    category: initialCategory,
    system: '',
    issue: '',
    issueLabel: '',
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const currentSystems = useMemo(
    () => SYSTEM_OPTIONS[formData.category] || SYSTEM_OPTIONS.OTHER,
    [formData.category]
  );

  const currentIssues = useMemo(() => {
    if (formData.category === 'INSTALLATION') {
      return ISSUE_OPTIONS.INSTALLATION_TYPE;
    }
    return ISSUE_OPTIONS[formData.system] || ISSUE_OPTIONS.DEFAULT;
  }, [formData.system, formData.category]);

  // 3. UPDATED TITLES
  const getStepTitle = () => {
    if (step === 1) {
      return formData.category === 'INSTALLATION'
        ? 'What are we installing?'
        : 'Which system do you have?';
    }
    if (step === 2) {
      return formData.category === 'INSTALLATION'
        ? 'Installation Type'
        : 'What seems to be the problem?';
    }
    return 'Almost done.';
  };

  const getStepSubtitle = () => {
    if (step === 1)
      return formData.category === 'INSTALLATION'
        ? 'Select the new equipment needed.'
        : 'Select the equipment that needs service.';
    if (step === 2)
      return formData.category === 'INSTALLATION'
        ? 'Is this a replacement or a new addition?'
        : 'This helps us prepare the right parts.';
    return 'Where should we send the booking confirmation?';
  };

  const handleNext = (key, value, extraLabel = '') => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
      ...(extraLabel ? { issueLabel: extraLabel } : {}),
    }));

    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
    } else {
      setView('SUCCESS');
    }
  };

  const handleBack = () => {
    if (isUnsafe) {
      setIsUnsafe(false);
      return;
    }
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      // If we skipped safety, going back from Step 1 should exit to Home
      if (formData.category === 'INSTALLATION') {
        onBack();
      } else {
        // Otherwise go back to Safety check
        setView('SAFETY');
      }
    }
  };

  if (view === 'SAFETY') {
    if (isUnsafe) {
      return (
        <div className='w-full mx-auto animate-in fade-in zoom-in duration-300 max-w-2xl'>
          <div className='bg-red-600 text-white rounded-[32px] p-8 md:p-12 shadow-2xl shadow-red-600/30 text-center relative overflow-hidden'>
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

    return (
      <div className='w-full mx-auto animate-in fade-in zoom-in duration-300 max-w-2xl'>
        <div className='relative overflow-hidden bg-white/60 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-rose-900/10 rounded-[32px] ring-1 ring-white/50'>
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

  if (view === 'SUCCESS') {
    const isNoHeat = formData.issue === 'NO_HEAT';

    if (isNoHeat && !overrideEmergency) {
      return (
        <EmergencyOutput
          issueLabel={formData.issueLabel}
          onBack={onBack}
          onBookAnyway={() => setOverrideEmergency(true)}
        />
      );
    }

    return <BookingOutput contactData={formData} onBack={onBack} />;
  }

  const progressPercent = (step / TOTAL_STEPS) * 100;

  return (
    <div className='w-full mx-auto animate-in fade-in zoom-in duration-300'>
      <div className='relative overflow-hidden bg-white/60 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-rose-900/10 rounded-[32px] ring-1 ring-white/50'>
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

        <div className='p-6 md:p-10 min-h-[400px] flex flex-col justify-center max-w-xl mx-auto w-full'>
          {step === 1 && (
            <div className='animate-in slide-in-from-right-8 duration-500 space-y-6'>
              <div className='text-center'>
                <h2 className='text-3xl font-bold text-rose-950 mb-3'>{getStepTitle()}</h2>
                <p className='text-rose-900/60 font-medium'>{getStepSubtitle()}</p>
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

          {step === 2 && (
            <div className='animate-in slide-in-from-right-8 duration-500 space-y-6'>
              <div className='text-center'>
                <h2 className='text-3xl font-bold text-rose-950 mb-3'>{getStepTitle()}</h2>
                <p className='text-rose-900/60 font-medium'>{getStepSubtitle()}</p>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {currentIssues.map((opt) => (
                  <SelectionTile
                    key={opt.id}
                    title={opt.label}
                    desc={opt.desc}
                    icon={opt.icon} // Pass icon here
                    onClick={() => handleNext('issue', opt.id, opt.label)}
                  />
                ))}
              </div>
            </div>
          )}

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
                  // 3. ONLY SUBMIT IF REQUIRED FIELDS ARE FILLED
                  if (formData.name && formData.phone && formData.address)
                    handleNext('contact', 'SUBMIT');
                }}
                className='space-y-4'
              >
                {/* 4. ADDRESS FIELD WITH AUTOCOMPLETE & SECURE KEY */}
                <div className='relative group z-50'>
                  {/* z-50 is important for dropdowns */}
                  <MapPin className='absolute left-4 top-[18px] z-10 w-5 h-5 text-rose-300' />
                  <div className='google-places-autocomplete-wrapper'>
                    <GooglePlacesAutocomplete
                      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}
                      selectProps={{
                        value: formData.address
                          ? { label: formData.address, value: formData.address }
                          : null,
                        onChange: (val) => setFormData((prev) => ({ ...prev, address: val.label })),
                        placeholder: 'Service Address (Start Typing...)',
                        styles: {
                          // Minimalist styling to match your theme
                          control: (provided) => ({
                            ...provided,
                            borderRadius: '1rem', // rounded-2xl
                            border: '1px solid rgba(255, 255, 255, 0.4)',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            paddingLeft: '40px', // Make room for icon
                            paddingBlock: '6px',
                            boxShadow: 'none',
                            '&:hover': { borderColor: '#fecdd3' },
                          }),
                          input: (provided) => ({ ...provided, color: '#4c0519' }),
                          placeholder: (provided) => ({ ...provided, color: '#fda4af' }),
                          singleValue: (provided) => ({ ...provided, color: '#4c0519' }),
                        },
                      }}
                    />
                  </div>
                </div>

                <div className='relative group'>
                  <User className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300' />
                  <input
                    type='text'
                    placeholder='Your Name'
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className='w-full p-4 pl-12 bg-white/50 border border-white/40 rounded-2xl text-rose-950 placeholder:text-rose-300 outline-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 transition-all'
                    required
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

function BookingOutput({ contactData, onBack }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rootElement, setRootElement] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRootElement(document.body);
    }
  }, []);

  return (
    <div className='text-center animate-in zoom-in duration-500 py-12 max-w-lg mx-auto'>
      <div className='inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 mb-6'>
        <CheckCircle2 className='w-12 h-12' />
      </div>
      <h2 className='text-3xl font-bold text-rose-950 mb-4'>Request Received.</h2>
      <p className='text-rose-900/70 mb-8 text-lg leading-relaxed'>
        We have your info, {contactData.name.split(' ')[0]}. <br />
        To secure your slot immediately, please pick a time on our calendar.
      </p>

      <button
        onClick={() => setIsOpen(true)}
        className='inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-600/20 text-xl transition-all mb-4'
      >
        <CalendarCheck className='w-6 h-6' />
        Pick Your Time Slot
      </button>

      <button
        onClick={onBack}
        className='text-rose-400 hover:text-rose-600 font-semibold text-sm mt-4'
      >
        Return to Dashboard
      </button>

      {rootElement && (
        <PopupModal
          url='https://calendly.com/gtahomecomfort-info/30min'
          pageSettings={{
            backgroundColor: 'ffffff',
            hideEventTypeDetails: false,
            hideLandingPageDetails: false,
            primaryColor: 'f43f5e',
            textColor: '4d5055',
          }}
          prefill={{
            email: contactData.email,
            firstName: contactData.name,
            smsReminderNumber: contactData.phone,
            // INJECT ADDRESS into Custom Answer 'a1' (Check your Calendly for exact mapping)
            customAnswers: {
              a1: contactData.address,
            },
          }}
          onModalClose={() => setIsOpen(false)}
          open={isOpen}
          rootElement={rootElement}
        />
      )}
    </div>
  );
}

function EmergencyOutput({ issueLabel, onBack, onBookAnyway }) {
  return (
    <div className='text-center animate-in zoom-in duration-500 py-12 max-w-lg mx-auto'>
      <div className='inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 text-red-600 mb-6 animate-pulse'>
        <AlertTriangle className='w-12 h-12' />
      </div>
      <h2 className='text-3xl font-bold text-rose-950 mb-4'>Priority Action Required.</h2>
      <p className='text-rose-900/80 mb-8 text-lg leading-relaxed'>
        Since you have <strong>{issueLabel || 'an emergency'}</strong>, we have flagged this as
        urgent. <br />
        Please call dispatch directly to bypass the online queue.
      </p>
      <a
        href='tel:4166782131'
        className='block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-red-600/20 text-xl transition-all mb-4'
      >
        Call Dispatch: 416-678-2131
      </a>
      <button
        onClick={onBookAnyway}
        className='text-rose-400 hover:text-rose-600 text-sm font-semibold underline'
      >
        I'll book online anyway
      </button>
    </div>
  );
}

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
