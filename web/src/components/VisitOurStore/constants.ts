import type { StoreHours, VisitOurStoreData } from './types';

export const DEFAULT_STORE_HOURS: StoreHours[] = [
  {
    days: 'Monday - Friday',
    hours: '10:00 AM - 8:00 PM',
    isActive: true,
  },
  {
    days: 'Saturday',
    hours: '10:00 AM - 9:00 PM',
    isActive: true,
  },
  {
    days: 'Sunday',
    hours: '11:00 AM - 6:00 PM',
    isActive: true,
  },
];

export const DEFAULT_STORE_DATA: VisitOurStoreData = {
  id: 'default',
  title: 'Visit Our Store',
  subtitle: 'Experience RaphArch in Person',
  description:
    'Step into our flagship store and immerse yourself in the world of premium fashion. Discover exclusive collections, get personalized styling advice, and experience luxury retail at its finest.',
  address: '123 Fashion Avenue',
  city: 'New York',
  state: 'NY',
  zip: '10001',
  country: 'United States',
  phone: '+1 (212) 555-0147',
  email: 'store@rapharch.com',
  image: '/icon.jpeg',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-73.9857!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU0LjIiTiA3M8KwNTknMDguNSJX!5e0!3m2!1sen!2sus!4v1',
  ctaText: 'Get Directions',
  ctaUrl: 'https://maps.google.com/?q=123+Fashion+Avenue+New+York+NY+10001',
  hours: [],
  isActive: true,
};
