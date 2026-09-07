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
  copyrightText: string;
  designerCredit: string;
  showPaymentIcons: boolean;
  isActive: boolean;
  serviceItems: { title: string; description: string; image: string; order: number; isActive: boolean }[];
  socialLinks: SocialLink[];
  createdAt: string;
  updatedAt: string;
}

export interface FollowSectionFormState {
  copyrightText: string;
  designerCredit: string;
  showPaymentIcons: boolean;
  isActive: boolean;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
}

export const DEFAULT_FORM_STATE: FollowSectionFormState = {
  copyrightText: 'All rights reserved.',
  designerCredit: 'Designed by: M.A.P Tech Pvt. Ltd.',
  showPaymentIcons: true,
  isActive: true,
  facebookUrl: '',
  instagramUrl: '',
  tiktokUrl: '',
};
