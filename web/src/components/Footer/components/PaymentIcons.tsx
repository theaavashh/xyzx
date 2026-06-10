import { memo } from 'react';
import { PAYMENT_METHODS } from '../constants';
import { PaymentIcon } from './PaymentIcon';

export const PaymentIcons = memo(function PaymentIcons() {
  return (
    <div className="flex items-center justify-center flex-wrap gap-2" aria-label="Accepted payment methods">
      {PAYMENT_METHODS.map((method) => (
        <PaymentIcon key={method.name} {...method} />
      ))}
    </div>
  );
});
