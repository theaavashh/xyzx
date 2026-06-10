'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { memo } from 'react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = memo(function ErrorState({ 
  message = 'Something went wrong while loading this section. Please check your connection and try again.', 
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="h-10 w-10 text-red-500" strokeWidth={1.5} />
      </div>
      <h3 className={`lastik text-2xl text-gray-900 mb-3 uppercase tracking-tight`}>
        Unable to load data
      </h3>
      <p className="text-gray-500 text-lg mb-8 text-center max-w-md leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-3 px-8 py-3.5 bg-[#D4AF37] text-white rounded-lg text-base font-bold uppercase tracking-wider hover:bg-[#C4A030] active:scale-[0.98] transition-all shadow-lg shadow-amber-100"
        >
          <RefreshCw className="h-5 w-5" />
          Try Again
        </button>
      )}
    </div>
  );
});
