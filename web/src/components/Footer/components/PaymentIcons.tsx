import { memo } from 'react';
import { PAYMENT_METHODS } from '../constants';
import { PaymentIcon } from './PaymentIcon';

export const PaymentIcons = memo(function PaymentIcons() {
  return (
    <div className="flex items-center justify-start md:justify-center flex-wrap gap-2" aria-label="Accepted payment methods">
      <span className="text-xs sm:text-sm text-zinc-600 font-medium mr-1">Pay Securely</span>
      {PAYMENT_METHODS.map((method) => (
        <PaymentIcon key={method.name} {...method} />
      ))}
    </div>
  );
});
