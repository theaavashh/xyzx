export interface MediaItem {
  id: string;
  linkTo: string;
  mediaType: 'IMAGE' | 'VIDEO';
  mediaUrl: string;
  internalLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type MediaViewMode = 'grid' | 'list';

export interface LinkToOption {
  value: string;
  label: string;
}

export const linkToOptions: LinkToOption[] = [
  { value: 'category', label: 'Category' },
  { value: 'today-sales', label: 'Today Sales' },
  { value: 'for-you', label: 'For You' },
  { value: 'products', label: 'Products' },
  { value: 'brands', label: 'Brands' },
  { value: 'about', label: 'About' },
  { value: 'contact', label: 'Contact' },
  { value: 'home', label: 'Home' },
  { value: 'special-offers', label: 'Special Offers' },
  { value: 'custom', label: 'Custom Link' },
];
