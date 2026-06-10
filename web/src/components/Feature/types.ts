export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  ariaLabel: string;
  order: number;
  isActive: boolean;
}

export interface FeatureData {
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
}
