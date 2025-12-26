'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
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
  RefreshCw,
  PlusCircle,
  Home,
  Maximize,
  Clock,
  Activity,
  DollarSign,
  Leaf,
  VolumeX,
  SkipForward,
  Video,
  ClipboardCheck,
  ThumbsUp,
} from 'lucide-react';
import { PopupModal, useCalendlyEventListener } from 'react-calendly';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { createLead } from '../actions';

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
    {
      id: 'DUCTLESS',
      label: 'Ductless Heat Pump',
      icon: <ThermometerSnowflake className='text-cyan-500' />,
    },
    { id: 'TANKLESS', label: 'Tankless Water Heater', icon: <Zap className='text-yellow-500' /> },
    { id: 'TANK', label: 'Hot Water Tank', icon: <Droplets className='text-blue-500' /> },
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

const INSTALL_SCENARIOS = [
  {
    id: 'EXISTING_SYSTEM',
    label: 'I have an existing system',
    desc: 'Replacing or upgrading what’s there',
    icon: <RefreshCw className='text-blue-500' />,
  },
  {
    id: 'NO_EXISTING_SYSTEM',
    label: 'No existing system here',
    desc: 'New addition or first-time install',
    icon: <PlusCircle className='text-emerald-500' />,
  },
  {
    id: 'NOT_SURE',
    label: 'I’m not sure',
    desc: 'We’ll figure it out together',
    icon: <HelpCircle className='text-rose-400' />,
  },
];

const PROPERTY_TYPES = [
  { id: 'Detached', label: 'Detached', icon: <Home /> },
  { id: 'Semi', label: 'Semi-Detached', icon: <Home className='opacity-70' /> },
  { id: 'Townhouse', label: 'Townhouse', icon: <Home className='opacity-50' /> },
  { id: 'Condo', label: 'Condo', icon: <Maximize /> },
];

const SQFT_RANGES = [
  { id: '<1000', label: '< 1000 sqft' },
  { id: '1000-1500', label: '1000 - 1500' },
  { id: '1500-2000', label: '1500 - 2000' },
  { id: '2000-3000', label: '2000 - 3000' },
  { id: '3000+', label: '3000+ sqft' },
  { id: 'Not Sure', label: 'Not Sure' },
];

const LEVELS = [
  { id: '1', label: '1 Storey' },
  { id: '2', label: '2 Storeys' },
  { id: '3+', label: '3+ Storeys' },
];

const DUCTWORK = [
  { id: 'Yes', label: 'Yes, I have ducts' },
  { id: 'No', label: 'No ductwork' },
  { id: 'Not sure', label: 'Not sure' },
];

const FUELS = [
  { id: 'Gas', label: 'Natural Gas', icon: <Flame /> },
  { id: 'Electric', label: 'Electric', icon: <Zap /> },
  { id: 'Propane', label: 'Propane / Oil', icon: <Droplets /> },
];

const AGES = [
  { id: '<10', label: 'Under 10 Yrs' },
  { id: '10-15', label: '10 - 15 Yrs' },
  { id: '15+', label: '15+ Years' },
];

const PRIORITIES = [
  { id: 'Lowest Price', label: 'Lowest Price', icon: <DollarSign /> },
  { id: 'Best Efficiency', label: 'Efficiency', icon: <Leaf /> },
  { id: 'Quiet', label: 'Quiet', icon: <VolumeX /> },
  { id: 'Best Comfort', label: 'Comfort', icon: <Activity /> },
];

const TIMELINES = [
  { id: 'ASAP', label: 'ASAP (Emergency)', icon: <AlertTriangle /> },
  { id: '1-2 Weeks', label: '1-2 Weeks', icon: <CalendarCheck /> },
  { id: '2-4 Weeks', label: '2-4 Weeks', icon: <CalendarCheck /> },
  { id: 'Just Shopping', label: 'Just Shopping', icon: <Clock /> },
];

export default function SmartQuote({ issueType, onBack }) {
  const containerRef = useRef(null);

  const initialCategory = useMemo(() => getCategory(issueType), [issueType]);
  const isInstall = initialCategory === 'INSTALLATION';

  const [view, setView] = useState(isInstall ? 'WIZARD' : 'SAFETY');
  const [isUnsafe, setIsUnsafe] = useState(false);
  const [overrideEmergency, setOverrideEmergency] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    category: initialCategory,
    system: isInstall ? [] : '',
    issue: '',
    issueLabel: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    bot_field: '',
    // Install Fields
    installScenario: '',
    propertyType: '',
    sqftRange: '',
    levels: '',
    ductwork: '',
    existingFuel: '',
    existingAge: '',
    hasGasToHome: '',
    panelSize: '',
    priority: '',
    timeline: '',
  });

  // --- HELPER: CHECK IF DETAILS STEP IS NEEDED ---
  const isDetailsNeeded = useMemo(() => {
    // 1. If scenario is Existing, we always ask Fuel/Age
    if (formData.installScenario === 'EXISTING_SYSTEM') return true;

    // 2. If scenario is New, we check logic
    if (formData.installScenario === 'NO_EXISTING_SYSTEM') {
      const systems = Array.isArray(formData.system) ? formData.system : [formData.system];
      const hasGasSys = systems.some((s) =>
        ['FURNACE', 'BOILER', 'TANKLESS', 'TANK', 'FIREPLACE'].includes(s)
      );
      const hasElecSys = systems.some((s) => ['HEATPUMP', 'DUCTLESS', 'AC'].includes(s));

      // Need details if we need to ask about Gas or Panel
      if (hasGasSys || hasElecSys) return true;
    }
    return false;
  }, [formData.installScenario, formData.system]);

  // Dynamic Step Count
  const TOTAL_STEPS = isInstall ? (isDetailsNeeded ? 6 : 5) : 3;

  // --- SCROLL TO TOP ON STEP CHANGE ---
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step, view]);

  const currentSystems = useMemo(
    () => SYSTEM_OPTIONS[formData.category] || SYSTEM_OPTIONS.OTHER,
    [formData.category]
  );

  const currentIssues = useMemo(() => {
    if (isInstall) return [];
    return ISSUE_OPTIONS[formData.system] || ISSUE_OPTIONS.DEFAULT;
  }, [formData.system, isInstall]);

  // --- MAPPING LOGIC FOR STEP TITLES/SUBTITLES ---
  const getCurrentStepContent = () => {
    // FIX: Step 1 is always SYSTEM selection, regardless of category.
    if (step === 1) return 'SYSTEM';

    if (!isInstall) return 'DEFAULT';

    if (step === 2) return 'SCENARIO';
    if (step === 3) return 'HOME';

    if (isDetailsNeeded) {
      if (step === 4) return 'DETAILS';
      if (step === 5) return 'PREFS';
      if (step === 6) return 'CONTACT';
    } else {
      if (step === 4) return 'PREFS';
      if (step === 5) return 'CONTACT';
    }
    return 'UNKNOWN';
  };

  const stepContent = getCurrentStepContent();

  const getStepTitle = () => {
    if (!isInstall) {
      if (step === 1) return 'Which system?';
      if (step === 2) return 'The Problem?';
      if (step === 3) return 'Almost done';
    }

    switch (stepContent) {
      case 'SYSTEM':
        return 'What do you need?';
      case 'SCENARIO':
        return 'Current Setup';
      case 'HOME':
        return 'Home & Layout';
      case 'DETAILS':
        return 'System Details';
      case 'PREFS':
        return 'Preferences';
      case 'CONTACT':
        return 'Last Step';
      default:
        return '';
    }
  };

  const getStepSubtitle = () => {
    if (!isInstall) {
      if (step === 1) return 'Select the equipment needing service.';
      if (step === 2) return 'This helps us prepare parts.';
      if (step === 3) return 'Where should we send the confirmation?';
    }

    switch (stepContent) {
      case 'SYSTEM':
        return 'Select all that apply.';
      case 'SCENARIO':
        return 'Are we replacing or adding new?';
      case 'HOME':
        return 'Tell us about the building (Optional).';
      case 'DETAILS':
        return 'Help us size it right (Optional).';
      case 'PREFS':
        return 'What matters most to you?';
      case 'CONTACT':
        return 'Where should we send the quote?';
      default:
        return '';
    }
  };

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSystem = (id) => {
    setFormData((prev) => {
      const current = prev.system || [];
      if (current.includes(id)) {
        return { ...prev, system: current.filter((x) => x !== id) };
      }
      return { ...prev, system: [...current, id] };
    });
  };

  const validateInstallStep = (currentStep, data) => {
    if (currentStep === 1 && (!data.system || data.system.length === 0)) {
      alert('Please select at least one system.');
      return false;
    }
    if (currentStep === 2 && !data.installScenario) {
      alert('Please select a scenario.');
      return false;
    }
    return true;
  };

  const handleNext = (key, value, extraLabel = '') => {
    let nextData = { ...formData };
    if (key) {
      nextData[key] = value;
      if (extraLabel) nextData.issueLabel = extraLabel;
    }

    if (key) {
      setFormData(nextData);
    }

    if (isInstall && !validateInstallStep(step, nextData)) return;

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
      if (isInstall) {
        onBack();
      } else {
        setView('SAFETY');
      }
    }
  };

  const systems = Array.isArray(formData.system) ? formData.system : [formData.system];
  const hasGasSys = systems.some((s) =>
    ['FURNACE', 'BOILER', 'TANKLESS', 'TANK', 'FIREPLACE'].includes(s)
  );
  const hasElecSys = systems.some((s) => ['HEATPUMP', 'DUCTLESS', 'AC'].includes(s));
  const hasDuctSys = systems.some((s) => ['FURNACE', 'AC', 'HEATPUMP'].includes(s));

  const showGasQuestion = formData.installScenario === 'NO_EXISTING_SYSTEM' && hasGasSys;
  const showElectricQuestion = formData.installScenario === 'NO_EXISTING_SYSTEM' && hasElecSys;
  const showDuctQuestion = hasDuctSys;

  if (view === 'SAFETY') {
    return (
      <SafetyView
        isUnsafe={isUnsafe}
        setIsUnsafe={setIsUnsafe}
        onSafe={() => setView('WIZARD')}
        onBack={onBack}
      />
    );
  }

  if (view === 'SUCCESS') {
    const isNoHeat = formData.issue === 'NO_HEAT';
    if (isNoHeat && !overrideEmergency && !isInstall) {
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
    <div ref={containerRef} className='w-full mx-auto animate-in fade-in zoom-in duration-300'>
      <div className='relative overflow-hidden bg-white/60 backdrop-blur-2xl border border-white/40 shadow-2xl shadow-rose-900/10 rounded-[32px] ring-1 ring-white/50'>
        {/* HEADER */}
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

        {/* CONTENT AREA */}
        <div className='p-6 md:p-10 min-h-[400px] flex flex-col justify-center max-w-xl mx-auto w-full'>
          <div className='animate-in slide-in-from-right-8 duration-500 space-y-6'>
            <div className='text-center'>
              <h2 className='text-3xl font-bold text-rose-950 mb-2'>{getStepTitle()}</h2>
              <p className='text-rose-900/60 font-medium'>{getStepSubtitle()}</p>
            </div>

            {/* 1. SYSTEM SELECTION */}
            {stepContent === 'SYSTEM' && (
              <div className='space-y-6'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  {currentSystems.map((opt) => {
                    const isSelected = isInstall
                      ? formData.system.includes(opt.id)
                      : formData.system === opt.id;
                    return (
                      <SelectionTile
                        key={opt.id}
                        icon={opt.icon}
                        title={opt.label}
                        selected={isSelected}
                        onClick={() => {
                          if (isInstall) {
                            toggleSystem(opt.id);
                          } else {
                            handleNext('system', opt.id);
                          }
                        }}
                      />
                    );
                  })}
                </div>
                {isInstall && (
                  <ContinueButton
                    onClick={() => handleNext()}
                    disabled={formData.system.length === 0}
                  />
                )}
              </div>
            )}

            {/* REPAIR: ISSUE */}
            {!isInstall && step === 2 && (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {currentIssues.map((opt) => (
                  <SelectionTile
                    key={opt.id}
                    title={opt.label}
                    desc={opt.desc}
                    icon={opt.icon}
                    onClick={() => handleNext('issue', opt.id, opt.label)}
                  />
                ))}
              </div>
            )}

            {/* 2. SCENARIO */}
            {stepContent === 'SCENARIO' && (
              <div className='grid grid-cols-1 gap-3'>
                {INSTALL_SCENARIOS.map((opt) => (
                  <SelectionTile
                    key={opt.id}
                    title={opt.label}
                    desc={opt.desc}
                    icon={opt.icon}
                    selected={formData.installScenario === opt.id}
                    onClick={() => handleNext('installScenario', opt.id)}
                  />
                ))}
              </div>
            )}

            {/* 3. HOME & LAYOUT */}
            {stepContent === 'HOME' && (
              <div className='space-y-8'>
                <TileGroup
                  label='Property Type'
                  options={PROPERTY_TYPES}
                  value={formData.propertyType}
                  onChange={(val) => updateField('propertyType', val)}
                />
                <TileGroup
                  label='Approx Sq. Footage'
                  options={SQFT_RANGES}
                  value={formData.sqftRange}
                  onChange={(val) => updateField('sqftRange', val)}
                  cols={2}
                />
                <TileGroup
                  label='Levels'
                  options={LEVELS}
                  value={formData.levels}
                  onChange={(val) => updateField('levels', val)}
                  cols={3}
                />
                {showDuctQuestion && (
                  <TileGroup
                    label='Existing Ductwork'
                    options={DUCTWORK}
                    value={formData.ductwork}
                    onChange={(val) => updateField('ductwork', val)}
                    cols={3}
                  />
                )}
                <div className='space-y-2 pt-2'>
                  <ContinueButton onClick={() => handleNext()} />
                  <SkipButton onClick={() => handleNext()} />
                </div>
              </div>
            )}

            {/* 4. DETAILS */}
            {stepContent === 'DETAILS' && (
              <div className='space-y-8'>
                {formData.installScenario === 'EXISTING_SYSTEM' ? (
                  <>
                    <TileGroup
                      label='Existing Fuel Source'
                      options={FUELS}
                      value={formData.existingFuel}
                      onChange={(val) => updateField('existingFuel', val)}
                    />
                    <TileGroup
                      label='Age of System'
                      options={AGES}
                      value={formData.existingAge}
                      onChange={(val) => updateField('existingAge', val)}
                      cols={3}
                    />
                  </>
                ) : (
                  <>
                    {showGasQuestion && (
                      <TileGroup
                        label='Gas Service at Home?'
                        options={[
                          { id: 'Yes', label: 'Yes' },
                          { id: 'No', label: 'No' },
                          { id: 'Unsure', label: 'Unsure' },
                        ]}
                        value={formData.hasGasToHome}
                        onChange={(val) => updateField('hasGasToHome', val)}
                        cols={3}
                      />
                    )}
                    {showElectricQuestion && (
                      <TileGroup
                        label='Electrical Panel'
                        options={[
                          { id: '100A', label: '100 Amp' },
                          { id: '200A', label: '200 Amp' },
                          { id: 'Unsure', label: 'Unsure' },
                        ]}
                        value={formData.panelSize}
                        onChange={(val) => updateField('panelSize', val)}
                        cols={3}
                      />
                    )}
                  </>
                )}
                <div className='space-y-2 pt-2'>
                  <ContinueButton onClick={() => handleNext()} />
                  <SkipButton onClick={() => handleNext()} />
                </div>
              </div>
            )}

            {/* 5. PREFS */}
            {stepContent === 'PREFS' && (
              <div className='space-y-8'>
                <TileGroup
                  label='Top Priority'
                  options={PRIORITIES}
                  value={formData.priority}
                  onChange={(val) => updateField('priority', val)}
                />
                <TileGroup
                  label='Timeline'
                  options={TIMELINES}
                  value={formData.timeline}
                  onChange={(val) => updateField('timeline', val)}
                />
                <div className='space-y-2 pt-2'>
                  <ContinueButton onClick={() => handleNext()} />
                  <SkipButton onClick={() => handleNext()} />
                </div>
              </div>
            )}

            {/* 6. CONTACT */}
            {(stepContent === 'CONTACT' || (!isInstall && step === 3)) && (
              <ContactForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={() => {
                  createLead(formData);
                  handleNext('contact', 'SUBMIT');
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function SelectionTile({ icon, title, desc, selected, onClick, className = '' }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 group flex items-center gap-4 active:scale-[0.98] ${
        selected
          ? 'bg-rose-50 border-rose-500 ring-1 ring-rose-500 shadow-sm'
          : 'bg-white/40 border-white/50 hover:bg-white/80 hover:border-rose-200'
      } ${className}`}
    >
      {icon && (
        <div
          className={`p-2 rounded-xl shadow-sm text-lg transition-all duration-300 ${
            selected
              ? 'bg-rose-500 text-white scale-110 [&_*]:text-white'
              : 'bg-white text-rose-900/80 group-hover:text-rose-500 group-hover:scale-110'
          }`}
        >
          {icon}
        </div>
      )}
      <div className='flex-1'>
        <div
          className={`font-bold text-base leading-tight transition-colors ${
            selected ? 'text-rose-900' : 'text-rose-950 group-hover:text-rose-600'
          }`}
        >
          {title}
        </div>
        {desc && (
          <div
            className={`text-xs font-medium mt-0.5 ${
              selected ? 'text-rose-700/80' : 'text-rose-500/80'
            }`}
          >
            {desc}
          </div>
        )}
      </div>
      {selected && <CheckCircle2 className='w-5 h-5 text-rose-500 animate-in zoom-in' />}
    </button>
  );
}

function TileGroup({ label, options, value, onChange, cols = 2 }) {
  return (
    <div className='animate-in slide-in-from-bottom-2 duration-500'>
      <div className='text-xs font-bold text-rose-900/60 uppercase tracking-widest mb-3 ml-1'>
        {label}
      </div>
      <div className={`grid gap-3 ${cols === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {options.map((opt) => (
          <button
            key={opt.id}
            type='button'
            onClick={() => onChange(opt.id)}
            className={`flex flex-col items-center justify-center text-center p-3 rounded-xl border transition-all ${
              value === opt.id
                ? 'bg-rose-500 text-white border-rose-500 shadow-md transform scale-[1.02] [&_*]:text-white'
                : 'bg-white border-rose-100 text-rose-900/80 hover:bg-rose-50 hover:border-rose-200'
            }`}
          >
            {opt.icon && (
              <div className={`mb-2 ${value === opt.id ? 'text-white' : 'text-rose-400'}`}>
                {opt.icon}
              </div>
            )}
            <span className='text-sm font-bold leading-tight'>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ContinueButton({ onClick, disabled }) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className='w-full bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2'
    >
      Continue <ArrowRight className='w-5 h-5' />
    </button>
  );
}

function SkipButton({ onClick }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='w-full text-rose-400 hover:text-rose-600 font-semibold py-2 text-sm transition-colors flex items-center justify-center gap-1.5'
    >
      Skip this step <SkipForward className='w-3 h-3' />
    </button>
  );
}

function ContactForm({ formData, setFormData, onSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (formData.name && formData.phone && formData.address && formData.email) {
          onSubmit();
        }
      }}
      className='space-y-4'
    >
      <input
        type='text'
        name='bot_field'
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete='off'
        onChange={(e) => setFormData((prev) => ({ ...prev, bot_field: e.target.value }))}
      />

      <div className='relative group z-50'>
        <MapPin className='absolute left-4 top-[18px] z-10 w-5 h-5 text-rose-300' />
        <div className='google-places-autocomplete-wrapper'>
          <GooglePlacesAutocomplete
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}
            selectProps={{
              value: formData.address ? { label: formData.address, value: formData.address } : null,
              onChange: (val) => setFormData((prev) => ({ ...prev, address: val.label })),
              placeholder: 'Service Address (Start Typing...)',
              styles: {
                control: (provided) => ({
                  ...provided,
                  borderRadius: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  paddingLeft: '40px',
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
          placeholder='Email'
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          className='w-full p-4 pl-12 bg-white/50 border border-white/40 rounded-2xl text-rose-950 placeholder:text-rose-300 outline-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 transition-all'
          required
        />
      </div>

      <button
        type='submit'
        className='w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2'
      >
        Continue to Booking <ArrowRight className='w-5 h-5' />
      </button>

      <p className='text-[10px] text-center text-rose-900/40 px-4 leading-tight'>
        By continuing, you agree to allow GTA Home Comfort to contact you regarding your request.
        Your data is secured and never sold.
      </p>
    </form>
  );
}

// --- OUTPUT SCREENS ---

function BookingOutput({ contactData, onBack }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState(null);
  const [rootElement, setRootElement] = useState(null);
  const [isBooked, setIsBooked] = useState(false);

  useCalendlyEventListener({
    onEventScheduled: (e) => {
      setIsOpen(false);
      setIsBooked(true);
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRootElement(document.body);
    }
  }, []);

  const handleBookClick = (url) => {
    setActiveUrl(url);
    setIsOpen(true);
  };

  const isInstall = contactData.category === 'INSTALLATION';

  if (isBooked) {
    return (
      <div className='text-center animate-in zoom-in duration-500 py-12 max-w-lg mx-auto'>
        <div className='inline-flex items-center justify-center w-24 h-24 rounded-full bg-rose-500 text-white shadow-lg shadow-rose-500/30 mb-6'>
          <ThumbsUp className='w-12 h-12' />
        </div>
        <h2 className='text-3xl font-bold text-rose-950 mb-4'>You're All Set!</h2>
        <p className='text-rose-900/70 mb-8 text-lg leading-relaxed'>
          Thanks, {contactData.name.split(' ')[0]}. <br />
          Your appointment has been confirmed. Please check your email for the calendar invite and
          details.
        </p>

        <button
          onClick={onBack}
          className='w-full py-4 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold rounded-2xl transition-all'
        >
          Return to Homepage
        </button>
      </div>
    );
  }

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

      {isInstall ? (
        <div className='grid gap-4 text-left mb-6'>
          <div className='bg-white/60 border border-rose-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group'>
            <div className='absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm'>
              RECOMMENDED
            </div>
            <div className='flex items-start gap-4'>
              <div className='w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-1'>
                <Video size={20} />
              </div>
              <div>
                <h3 className='font-bold text-rose-950 text-lg leading-tight mb-1'>
                  Free Quote Review Call
                </h3>
                <p className='text-rose-900/70 text-sm mb-4 leading-relaxed'>
                  15–20 minutes by phone or video. Great for reviewing options, pricing, and
                  rebates.
                </p>
                <button
                  onClick={() =>
                    handleBookClick(
                      'https://calendly.com/gtahomecomfort-info/book-a-call-for-a-free-quote-review'
                    )
                  }
                  className='w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2'
                >
                  Book Quote Review
                </button>
              </div>
            </div>
          </div>

          <div className='bg-white/40 border border-white/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-start gap-4'>
            <div className='w-10 h-10 rounded-full bg-white flex items-center justify-center text-rose-400 shrink-0 mt-1 border border-rose-100'>
              <ClipboardCheck size={20} />
            </div>
            <div className='w-full'>
              <h3 className='font-bold text-rose-950 text-lg leading-tight mb-1'>
                Free On-Site Assessment
              </h3>
              <p className='text-rose-900/70 text-sm mb-4 leading-relaxed'>
                An in-home visit with a technician to verify sizing and site conditions.
              </p>
              <button
                onClick={() =>
                  handleBookClick(
                    'https://calendly.com/gtahomecomfort-info/quote-review-call-free-clone'
                  )
                }
                className='w-full py-3 bg-white border-2 border-rose-100 hover:border-rose-300 text-rose-900 font-bold rounded-xl active:scale-[0.98] transition-all'
              >
                Book On-Site Visit
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => handleBookClick('https://calendly.com/gtahomecomfort-info/30min')}
          className='inline-flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-600/20 text-xl transition-all mb-4'
        >
          <CalendarCheck className='w-6 h-6' />
          Pick Your Time Slot
        </button>
      )}

      <button
        onClick={onBack}
        className='text-rose-400 hover:text-rose-600 font-semibold text-sm mt-4'
      >
        Return to Dashboard
      </button>

      {rootElement && (
        <PopupModal
          url={activeUrl || 'https://calendly.com/gtahomecomfort-info/30min'}
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

function SafetyView({ isUnsafe, setIsUnsafe, onSafe, onBack }) {
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
                onClick={onSafe}
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
