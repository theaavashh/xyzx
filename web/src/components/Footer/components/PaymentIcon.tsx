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
      {type === 'amex' && (
        <svg viewBox="0 0 50 30" className="h-5 w-8" aria-hidden="true">
          <rect width="50" height="30" rx="4" fill="#2E77BC" />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="sans-serif">AMEX</text>
        </svg>
      )}
      {type === 'applepay' && (
        <svg viewBox="0 0 50 30" className="h-5 w-8" aria-hidden="true">
          <rect width="50" height="30" rx="4" fill="black" />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="sans-serif">Apple Pay</text>
        </svg>
      )}
      {type === 'shopifypay' && (
        <svg viewBox="0 0 50 30" className="h-5 w-8" aria-hidden="true">
          <rect width="50" height="30" rx="4" fill="#7AB55C" />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="sans-serif">Shop Pay</text>
        </svg>
      )}
      {type === 'cartesbancaires' && (
        <svg viewBox="0 0 50 30" className="h-5 w-8" aria-hidden="true">
          <rect width="50" height="30" rx="4" fill="#0074B8" />
          <text x="50%" y="45%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold" fontFamily="sans-serif">CB</text>
          <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="3" fontFamily="sans-serif">cartes bancaires</text>
        </svg>
      )}
      {!['visa', 'mastercard', 'paypal', 'amex', 'applepay', 'shopifypay', 'cartesbancaires'].includes(type) && (
        <svg viewBox="0 0 50 30" className="h-5 w-8" aria-hidden="true">
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="black" fontSize="5" fontWeight="bold" fontFamily="sans-serif">{name}</text>
        </svg>
      )}
    </div>
  );
});
