import {
  BarChart,
  BarChart3,
  Bot,
  Code,
  CreditCard,
  DollarSign,
  FileText,
  FolderOpen,
  Globe,
  Grid3X3,
  Home,
  Layers,
  LayoutGrid,
  Map as MapIcon,
  Menu,
  Package,
  Package2,
  Palette,
  PanelBottom,
  Printer,
  RotateCcw,
  Settings,
  Share2,
  ShoppingCart,
  Image as SliderIcon,
  Tag,
  TrendingUp,
  Truck,
  Users,
  XCircle,
  Monitor,
} from 'lucide-react';

import type { SVGProps } from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  children?: NavItem[];
}

export const BREAKPOINTS = {
  DESKTOP: 1024,
  MOBILE: 768,
};

export const NAVIGATION_SECTIONS = [
  {
    id: 'main',
    title: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Home, children: [] },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    id: 'catalog',
    title: 'Catalog',
    items: [
      {
        id: 'manage-categories',
        label: 'Categories',
        icon: FolderOpen,
      },
      {
        id: 'products',
        label: 'Products',
        icon: Package,
        children: [
          { id: 'all-products', label: 'All Products', icon: Package2 },
          { id: 'inventory', label: 'Inventory', icon: Layers },
        ],
      },
    ],
  },
  {
    id: 'orders',
    title: 'Orders',
    items: [
      {
        id: 'orders',
        label: 'Orders',
        icon: ShoppingCart,
        children: [
          { id: 'all-orders', label: 'All Orders', icon: FileText },
          { id: 'billing', label: 'Billing', icon: CreditCard },
          { id: 'shipped-delivered', label: 'Shipped/Delivered', icon: Truck },
          { id: 'returns', label: 'Returns', icon: RotateCcw },
          { id: 'refunds', label: 'Refunds', icon: DollarSign },
          { id: 'cancellations', label: 'Cancellations', icon: XCircle },
          { id: 'invoices', label: 'Invoices', icon: Printer },
        ],
      },
    ],
  },
  {
    id: 'coupon',
    title: 'Coupon',
    items: [
      {
        id: 'discounts',
        label: 'Discounts',
        icon: Tag,
        children: [],
      },
    ],
  },
  {
    id: 'pos',
    title: 'Point of Sale',
    items: [
      { id: 'pos', label: 'POS Terminal', icon: Monitor, children: [] },
    ],
  },
  {
    id: 'content',
    title: 'Content',
    items: [
      {
        id: 'content-management',
        label: 'Content Management',
        icon: FileText,
        children: [
          { id: 'top-banner-page', label: 'Top Banner', icon: SliderIcon },
          { id: 'navigation', label: 'Navigation', icon: Menu },
           { id: 'hero-banner', label: 'Hero Section', icon: SliderIcon },
           { id: 'short-description', label: 'Short Description', icon: FileText },
           { id: 'women-items', label: 'Women Items', icon: Grid3X3 },
           {
               id: 'category-grid',
               label: 'Category Grid',
               icon: Grid3X3,
             },
           { id: 'hero-slide', label: 'Hero Slides', icon: SliderIcon },
           {
            id: 'editorial-section',
            label: 'Editorial Sections',
            icon: SliderIcon,
          },
           {
            id: 'featured-sections',
            label: 'Featured Sections',
            icon: SliderIcon,
          },
           {
              id: 'image-grid',
              label: 'Image Grid',
              icon: Grid3X3,
            },
            {
              id: 'three-image-grid',
              label: 'Three Image Grid',
              icon: Grid3X3,
            },
            {
              id: 'category-tile-grid',
              label: 'Category Tile Grid',
              icon: Grid3X3,
            },


          {
            id: 'sales-banners',
            label: 'Sales Banners',
            icon: TrendingUp,
          },
           {
            id: 'dual-card-section',
            label: 'Dual Card Sections',
            icon: SliderIcon,
          },
           {
            id: 'promotional-banners-page',
            label: 'Promotional Banners',
            icon: SliderIcon,
          },
           {
            id: 'feature-configs-page',
            label: 'Feature Configs',
            icon: SliderIcon,
          },

           { id: 'footer-catalog', label: 'Footer Catalog', icon: LayoutGrid },
           { id: 'footer-section', label: 'Footer Sections', icon: PanelBottom },
           { id: 'shipping-delivery', label: 'Shipping & Delivery', icon: Truck },
           { id: 'shipping', label: 'Shipping Items', icon: Truck },
          { id: 'order-cancellation', label: 'Order Cancellation', icon: XCircle },
          { id: 'popup-banner', label: 'Popup Banner', icon: SliderIcon },
        ],
      },
      {
        id: 'company-details',
        label: 'Company Details',
        icon: FileText,
        children: [
          { id: 'about', label: 'About Us', icon: FileText },
          { id: 'contact-page', label: 'Contact Page', icon: FileText },
          { id: 'store', label: 'Store', icon: MapIcon },
        ],
      },
      {
        id: 'policies',
        label: 'Policies',
        icon: FileText,
        children: [
          { id: 'follow-section', label: 'Follow Section', icon: Share2 },
          { id: 'faq', label: 'FAQ', icon: FileText },
          { id: 'privacy-policy', label: 'Privacy Policy', icon: FileText },
          { id: 'return-policy', label: 'Return Policy', icon: FileText },
          { id: 'terms-of-use', label: 'Terms of Use', icon: FileText },
          { id: 'terms-of-service', label: 'Terms of Service', icon: FileText },
          { id: 'cookie-policy', label: 'Cookie Policy', icon: FileText },
        ],
      },
    ],
  },
  {
    id: 'seo',
    title: 'SEO',
    items: [
      {
        id: 'seo',
        label: 'SEO',
        icon: Globe,
        children: [
          { id: 'sitemap', label: 'Sitemap', icon: MapIcon },
          { id: 'robots-txt', label: 'Robots.txt', icon: Bot },
          { id: 'json-ld', label: 'JSON-LD', icon: Code },
        ],
      },
    ],
  },
  {
    id: 'users',
    title: 'User Management',
    items: [
      {
        id: 'user-management',
        label: 'Staff Management',
        icon: Users,
        children: [
          { id: 'all-staff', label: 'All Staff', icon: Users },
          { id: 'permissions', label: 'Permissions', icon: Settings },
        ],
      },
      {
        id: 'client-details',
        label: 'Client Details',
        icon: Users,
        children: [],
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        children: [
          { id: 'site-settings', label: 'Site Settings', icon: Settings },
          { id: 'api-integration', label: 'API Integration', icon: Code },
          { id: 'reward-settings', label: 'Reward Settings', icon: DollarSign },
          { id: 'color-theme', label: 'Color Theme', icon: Palette },
        ],
      },
    ],
  },
];

export const ROUTE_MAP: Record<string, string> = {
  'dashboard': '/dashboard',
  'categories': '/dashboard/category',
  'manage-categories': '/dashboard/category',
  'products': '/dashboard/products',
  'all-products': '/dashboard/products',
  'inventory': '/dashboard/inventory',
  'settings': '/dashboard/settings',
  'site-settings': '/dashboard/settings',
  'api-integration': '/dashboard/api-integration',
  'reward-settings': '/dashboard/reward-settings',
  'color-theme': '/dashboard/color-theme',
  'content-management': '/analytics',
  'analytics': '/analytics',
  'top-banner-page': '/dashboard/top-banner',
  'hero-slide': '/dashboard/hero-slide',
  'hero-banner': '/dashboard/hero-banner',
  'featured-sections': '/dashboard/featured-sections',
  'sales-banners': '/dashboard/sales-banners',
  'editorial-section': '/dashboard/editorial-section',
  'dual-card-section': '/dashboard/dual-card-section',
  'promotional-banners-page': '/dashboard/promotional-banners',
  'feature-configs-page': '/dashboard/feature-configs',
  'popup-banner': '/dashboard/popup-banner',
  'about': '/dashboard/about',
  'contact-page': '/dashboard/contact-page',
  'navigation': '/dashboard/navigation',
  'footer-catalog': '/dashboard/footer-catalog',
  'footer-section': '/dashboard/footer-section',
  'short-description': '/dashboard/short-description',
  'women-items': '/dashboard/women-items',
  'store': '/dashboard/store',
  'follow-section': '/dashboard/follow-section',
  'faq': '/dashboard/faq',
  'category-grid': '/dashboard/category-grid',
  'image-grid': '/dashboard/image-grid',
  'three-image-grid': '/dashboard/three-image-grid',
  'category-tile-grid': '/dashboard/category-tile-grid',
  'content-pages': '/dashboard/content',
  'cookie-policy': '/dashboard/content/cookie-policy',
  'shipping-delivery': '/dashboard/content/shipping-delivery',
  'shipping': '/dashboard/shipping',
  'terms-of-use': '/dashboard/content/terms-of-use',
  'terms-of-service': '/dashboard/content/terms-of-service',
  'privacy-policy': '/dashboard/content/privacy-policy',
  'return-policy': '/dashboard/content/return-policy',
  'order-cancellation': '/dashboard/content/order-cancellation',
  'product-performance': '/dashboard/product-performance',
  'discounts': '/dashboard/discounts',
  'all-orders': '/dashboard/orders',
  'billing': '/dashboard/billing',
  'pos': '/dashboard/pos',
  'shipped-delivered': '/dashboard/orders/shipped-delivered',
  'returns': '/dashboard/orders/returns',
  'refunds': '/dashboard/orders/refunds',
  'cancellations': '/dashboard/orders/cancellations',
  'sitemap': '/dashboard/seo/sitemap',
  'robots-txt': '/dashboard/seo/robots',
  'json-ld': '/dashboard/seo/json-ld',
  'all-staff': '/dashboard/user-management/all-staff',
  'permissions': '/dashboard/user-management/permissions',
  'client-details': '/dashboard/client-details',
  'invoices': '/dashboard/invoices',
};

export const SECTIONS_WITH_CHILDREN = new Set([
  'orders',
  'seo',
  'user-management',
  'products',
  'content-management',
  'policies',
  'settings',
]);
