import type { TabKey } from '../types';

export const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'general', label: 'General', icon: 'Settings' },
  { key: 'contact', label: 'Contact', icon: 'Mail' },
  { key: 'business', label: 'Business', icon: 'Database' },
  { key: 'payment', label: 'Payment', icon: 'CreditCard' },
  { key: 'notifications', label: 'Notifications', icon: 'Bell' },
  { key: 'security', label: 'Security', icon: 'Shield' },
  { key: 'inventory', label: 'Inventory', icon: 'Package' },
  { key: 'seo', label: 'SEO', icon: 'Search' },
  { key: 'analytics', label: 'Analytics', icon: 'Search' },
];

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash on Delivery' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'esewa', label: 'eSewa' },
  { value: 'khalti', label: 'Khalti' },
];

export const TIMEZONES = [
  'Asia/Kathmandu',
  'UTC',
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo',
];

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ne', label: 'नेपाली (Nepali)' },
  { value: 'es', label: 'Español (Spanish)' },
];

export const PASSWORD_POLICIES = [
  { value: 'weak', label: 'Weak (minimum 6 characters)' },
  { value: 'medium', label: 'Medium (8+ chars, numbers)' },
  { value: 'strong', label: 'Strong (12+ chars, special chars)' },
];
