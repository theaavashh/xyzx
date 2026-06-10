export const LEGAL_LINKS = [
  { href: '/terms-of-service', label: 'Terms of Service' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
] as const;

export const PAYMENT_METHODS = [
  { name: 'Visa', type: 'visa' },
  { name: 'Mastercard', type: 'mastercard' },
  { name: 'PayPal', type: 'paypal' },
  { name: 'American Express', type: 'amex' },
  { name: 'Apple Pay', type: 'applepay' },
  { name: 'Shop Pay', type: 'shopifypay' },
  { name: 'Cartes Bancaires', type: 'cartesbancaires' },
] as const;
