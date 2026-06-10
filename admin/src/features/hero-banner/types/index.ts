export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  largeImage?: string;
  smallImage?: string;
  videoUrl?: string;
  buttonUrl?: string;
  buttonText?: string;
  isActive: boolean;
  order: number;
}

export interface BannerFormEntry {
  id: string;
  title: string;
  subtitle: string;
  largeImage: string;
  smallImage: string;
  videoUrl: string;
  buttonUrl: string;
  buttonText: string;
  isActive: boolean;
  order: number;
  largePreview: string;
  smallPreview: string;
  isUploadingLarge: boolean;
  isUploadingSmall: boolean;
}

export const INTERNAL_LINKS = [
  { label: 'Home', value: '/' },
  { label: 'All Products', value: '/products' },
  { label: 'New Arrivals', value: '/new-arrivals' },
  { label: 'Best Sellers', value: '/best-sellers' },
  { label: 'Sale', value: '/sale' },
  { label: 'Privacy Policy', value: '/privacy-policy' },
  { label: 'Terms of Use', value: '/terms-of-use' },
  { label: 'Cookie Policy', value: '/cookie-policy' },
  { label: 'Shipping & Delivery', value: '/shipping-delivery' },
  { label: 'Order Cancellation', value: '/order-cancellation' },
  { label: 'Custom URL', value: 'custom' },
];

let entryCounter = 0;

export function createEntry(order: number): BannerFormEntry {
  entryCounter++;
  return {
    id: `entry-${entryCounter}`,
    title: '', subtitle: '', largeImage: '', smallImage: '',
    videoUrl: '', buttonUrl: '', buttonText: '', isActive: true, order,
    largePreview: '', smallPreview: '',
    isUploadingLarge: false, isUploadingSmall: false,
  };
}
