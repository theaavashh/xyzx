import { memo } from 'react';

interface PaymentIconProps {
  name: string;
  type: string;
}

export const PaymentIcon = memo(function PaymentIcon({ name, type }: PaymentIconProps) {
  return (
    <div className="flex items-center justify-center" title={name}>
      {type === 'visa' && (
        <svg viewBox="0 0 50 30" className="h-5 w-8" aria-hidden="true">
          <rect width="50" height="30" rx="4" fill="#1A1F71" />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">VISA</text>
        </svg>
      )}
      {type === 'mastercard' && (
        <svg viewBox="0 0 50 30" className="h-5 w-8" aria-hidden="true">
          <circle cx="18" cy="15" r="8" fill="#EB001B" />
          <circle cx="32" cy="15" r="8" fill="#F79E1B" opacity="0.8" />
        </svg>
      )}
      {type === 'paypal' && (
        <svg viewBox="0 0 50 30" className="h-5 w-8" aria-hidden="true">
          <rect width="50" height="30" rx="4" fill="#003087" />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">PayPal</text>
        </svg>
      )}
      
     
    </div>
  );
});
