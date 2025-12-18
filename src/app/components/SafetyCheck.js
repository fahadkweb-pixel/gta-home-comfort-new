import { AlertTriangle, ChevronLeft } from 'lucide-react';

export default function SafetyCheck({ onSafe, onCancel }) {
  return (
    <div
      className='w-full bg-white border border-amber-100 rounded-2xl shadow-xl p-8 animate-in fade-in slide-in-from-bottom-8 duration-500'
      role='alert'
      aria-live='polite'
    >
      <div className='flex flex-col md:flex-row gap-6 items-start'>
        <div className='bg-amber-50 p-4 rounded-full' aria-hidden>
          <AlertTriangle className='w-8 h-8 text-amber-600' />
        </div>

        <div className='flex-1'>
          <h2 className='text-2xl font-bold text-rose-950 mb-2'>Safety Check</h2>
          <p className='text-rose-800/80 mb-8 text-lg leading-relaxed'>
            Before we book, we need to rule out immediate danger.
            <br />
            <strong>Do you smell gas (rotten eggs) or see sparks?</strong>
          </p>

          <div className='flex flex-col sm:flex-row gap-3'>
            <a
              href='tel:18667635427'
              className='flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 font-bold py-4 px-6 rounded-xl transition-colors text-center'
            >
              Yes, I smell gas
            </a>

            <button
              type='button'
              onClick={() => onSafe?.()}
              className='flex-1 bg-rose-950 hover:bg-rose-900 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-rose-900/20 transition-all'
            >
              No, it's safe
            </button>
          </div>

          <button
            type='button'
            onClick={() => onCancel?.()}
            className='mt-6 text-rose-400 hover:text-rose-600 text-sm font-medium flex items-center gap-1'
          >
            <ChevronLeft className='w-4 h-4' /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
