import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Music,
  Twitter,
  Youtube,
} from 'lucide-react';
import type { ServiceItem, SocialLink } from './types';

export const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Music,
  Linkedin,
  Github,
};

export const DEFAULT_SERVICE_ITEMS: ServiceItem[] = [
  {
    id: '1',
    title: 'Premium Materials',
    description: 'Highest quality stone and tile sourced worldwide',
    image: '/fast-shipping.png',
    order: 0,
    isActive: true,
  },
  {
    id: '2',
    title: 'Expert Team',
    description: 'Skilled professionals dedicated to your vision',
    image: '/easy-return.png',
    order: 1,
    isActive: true,
  },
  {
    id: '3',
    title: 'Custom Solutions',
    description: 'Tailored designs to transform any space',
    image: '/new-arrival.png',
    order: 2,
    isActive: true,
  },
];

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    id: '1',
    name: 'Facebook',
    url: 'https://facebook.com/rapharch',
    icon: 'Facebook',
    ariaLabel: 'Follow RaphArch on Facebook',
    order: 0,
    isActive: true,
  },
  {
    id: '2',
    name: 'Instagram',
    url: 'https://instagram.com/rapharch',
    icon: 'Instagram',
    ariaLabel: 'Follow RaphArch on Instagram',
    order: 1,
    isActive: true,
  },
  {
    id: '3',
    name: 'TikTok',
    url: 'https://tiktok.com/@rapharch',
    icon: 'Music',
    ariaLabel: 'Follow RaphArch on TikTok',
    order: 2,
    isActive: true,
  },
];

export const DEFAULT_ADDRESS = {
  street: '123 Fashion Avenue',
  city: 'New York',
  state: 'NY',
  zip: '10001',
  country: 'United States',
};
