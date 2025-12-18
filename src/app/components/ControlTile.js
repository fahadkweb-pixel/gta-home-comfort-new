'use client';

export default function ControlTile({
  icon,
  label,
  sub,
  onClick,
  variant = 'default',
  imageSrc, // New Prop
  className = '',
}) {
  const isPrimary = variant === 'primary';

  // Base styles for the outer container
  const baseStyles =
    'relative group flex flex-col justify-between p-6 rounded-[32px] border overflow-hidden transition-all duration-500 w-full h-full text-left';

  // Specific variant styles (Border & Shadow)
  const variantStyles = {
    default: 'border-rose-100/50 hover:border-rose-200 bg-white hover:shadow-xl',
    primary: 'border-rose-400 shadow-rose-500/20 shadow-xl bg-rose-600',
    warning: 'border-amber-200/50 bg-amber-50 hover:shadow-lg',
  };

  return (
    <button
      type='button'
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className} hover:scale-[1.01] active:scale-[0.98]`}
    >
      {/* 1. BACKGROUND IMAGE LAYER */}
      {imageSrc && (
        <div
          className='absolute inset-0 z-0 transition-transform duration-700 ease-out group-hover:scale-110'
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* 2. COLOR OVERLAY LAYER (The Tint) */}
      {/* This ensures the image is visible but the color theme is dominant */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-300 ${
          isPrimary
            ? 'bg-gradient-to-br from-rose-600/90 to-rose-700/80 mix-blend-multiply' // Red Tint
            : variant === 'warning'
            ? 'bg-amber-50/90' // Warning Tint
            : 'bg-white/80 group-hover:bg-white/70 backdrop-blur-[2px]' // Glass Tint
        }`}
      />

      {/* 3. CONTENT LAYER (Z-10 to sit above image) */}
      <div className='relative z-10 w-full h-full flex flex-col justify-between'>
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-colors duration-300 ${
            isPrimary
              ? 'bg-white/20 text-white backdrop-blur-md border border-white/10'
              : 'bg-white shadow-sm text-rose-500 group-hover:text-rose-600 border border-rose-50'
          }`}
        >
          {icon}
        </div>

        {/* Text */}
        <div>
          <div
            className={`font-bold tracking-tight text-xl leading-tight ${
              isPrimary ? 'text-white' : 'text-rose-950'
            }`}
          >
            {label}
          </div>
          <div
            className={`text-sm font-medium mt-1.5 ${
              isPrimary ? 'text-rose-100/90' : 'text-rose-400'
            }`}
          >
            {sub}
          </div>
        </div>
      </div>
    </button>
  );
}
