'use client';

import { Truck, PackageOpen, CheckCircle, Clock } from 'lucide-react';
import { memo } from 'react';

const ORDER_STEPS = [
  { step: 1, label: 'Order Placed', icon: Clock },
  { step: 2, label: 'Processing', icon: PackageOpen },
  { step: 3, label: 'Shipped', icon: Truck },
  { step: 4, label: 'Delivered', icon: CheckCircle },
];

interface ProgressBarProps {
  currentStep: number;
}

export const ProgressBar = memo(function ProgressBar({ currentStep }: ProgressBarProps) {
  if (currentStep === 0) return null;

  return (
    <div className="relative">
      <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100 hidden md:block" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
        {ORDER_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStep - 1;
          const isCurrent = index === currentStep - 1;
          const isLast = index === ORDER_STEPS.length - 1;

          return (
            <div key={step.step} className="relative flex md:flex-col items-center md:items-start gap-4 md:gap-0">
              <div className="relative flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted ? 'bg-gray-900 border-gray-900 text-white' : isCurrent ? 'bg-white border-gray-900 text-gray-900' : 'bg-white border-gray-200 text-gray-300'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-medium flex items-center justify-center ${
                  isCompleted ? 'bg-[#D4AF37] text-white' : isCurrent ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.step}
                </span>
              </div>
              <div className="md:mt-3 md:text-center">
                <p className={`text-base font-medium ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                {isCurrent && <p className="text-sm text-[#D4AF37] mt-0.5 font-medium">In Progress</p>}
              </div>
              {!isLast && (
                <div className="hidden md:block absolute top-5 -right-3 text-gray-200">
                  <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                    <path d="M0 6H22M22 6L17 1M22 6L17 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});
