export interface ServiceItem {
  id?: string;
  title: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

export interface SocialLink {
  id?: string;
  name: string;
  url: string;
  icon: string;
  ariaLabel: string;
  order: number;
  isActive: boolean;
}

export interface FollowSection {
  id: string;
  brandName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  copyrightText: string;
  designerCredit: string;
  showPaymentIcons: boolean;
  isActive: boolean;
  serviceItems: ServiceItem[];
  socialLinks: SocialLink[];
  createdAt: string;
  updatedAt: string;
}

export const ICON_OPTIONS = [
  'Facebook',
  'Instagram',
  'Twitter',
  'Youtube',
  'Music',
  'Linkedin',
  'Github',
];

export const DEFAULT_FORM_STATE: Partial<FollowSection> = {
  brandName: 'Rapharch',
  street: '123 Fashion Avenue',
  city: 'New York',
  state: 'NY',
  zip: '10001',
  country: 'United States',
  copyrightText: 'All rights reserved.',
  designerCredit: 'Designed by: M.A.P Tech Pvt. Ltd.',
  showPaymentIcons: true,
  isActive: true,
  serviceItems: [],
  socialLinks: [],
};
