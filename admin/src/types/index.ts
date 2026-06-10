import type { SVGProps } from 'react';
import type {
  ProductFormData as ProductFormDataFromSchema,
  PricingTier as PricingTierFromSchema,
  CurrencyPrice as CurrencyPriceFromSchema,
  ProductAttribute as ProductAttributeFromSchema,
  CompleteProductData,
} from '@/schemas/productFormSchema';

export type { CompleteProductData };

export type ProductFormData = ProductFormDataFromSchema;
export type PricingTier = PricingTierFromSchema;
export type CurrencyPrice = CurrencyPriceFromSchema;
export type ProductAttribute = ProductAttributeFromSchema;

export interface ApiError {
  field?: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiError[];
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  _count?: {
    products: number;
  };
}

export interface VariantOption {
  id?: string;
  name?: string;
  price?: number;
  comparePrice?: number;
  weight?: number;
  additionalCost?: number;
  stock?: number;
}

export interface Variant {
  id?: number;
  name?: string;
  variantName?: string;
  sku?: string;
  images?: string[];
  price?: {
    usd?: number;
    eur?: number;
    gbp?: number;
    inr?: number;
  };
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  childAsin?: string;
  options?: VariantOption[];
  combination?: Record<string, string>;
  stock?: number;
  isActive?: boolean;
  color?: string;
  size?: string;
  pattern?: string;
  quantity?: number;
  comparePrice?: number;
  barcode?: string;
  isDefault?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  productCode?: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  comparePrice?: number;
  costPrice?: number;
  discountPercent?: number;
  sku: string;
  category: { id: string; name: string; slug: string };
  categoryId: string;
  subCategoryId?: string;
  brandId?: string;
  tags: string[];
  images: string[];
  videos?: string[];
  thumbnail?: string;
  isActive: boolean;
  quantity: number;
  lowStockThreshold?: number;
  weight?: number;
  weightUnit?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  createdAt: string;
  updatedAt: string;
  isFeatured?: boolean;
  isDigital?: boolean;
  isVariant?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  isBestSeller?: boolean;
  isSales?: boolean;
  isNewSeller?: boolean;
  isFestivalOffer?: boolean;
  variants?: Variant[];
  variantAttributes?: string[];
  selectedSizes?: string[];
  selectedColors?: string[];
  currencyPrices?: CurrencyPrice[];
  gender?: string;
  season?: string;
  material?: string;
  occasion?: string;
  fitType?: string;
  pattern?: string;
  sleeveStyle?: string;
  neckStyle?: string;
  washCare?: string;
  materialCare?: string;
  disclaimer?: string;
  barcode?: string;
  upc?: string;
  ean?: string;
  isbn?: string;
  trackQuantity?: boolean;
  allowBackorder?: boolean;
  manageStock?: boolean;
  requiresShipping?: boolean;
  shippingClass?: string;
  freeShipping?: boolean;
  taxable?: boolean;
  taxClass?: string;
  visibility?: string;
  publishedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  canonicalUrl?: string;
  robotsMeta?: string;
  seoFriendlyImageFilename?: string;
  imageAltText?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  productSchema?: string;
  brandSchema?: string;
  breadcrumbSchema?: string;
  itemListSchema?: string;
  faqSchema?: string;
  twitterCardMeta?: string;
  faqs?: string;
  customFields?: Record<string, unknown>;
  notes?: string;
  pricingTiers?: PricingTier[];
  attributes?: ProductAttribute[];
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role: 'admin' | 'staff' | 'manager' | 'viewer' | string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  lastLogin?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  total: number;
  subtotal?: number;
  tax?: number;
  shipping?: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: number;
  orderItems?: OrderItem[];
  createdAt: string;
  updatedAt: string;
  shippingAddress?: Record<string, string>;
  paymentMethod?: string;
  paymentStatus?: string;
  returnNumber?: string;
  refundNumber?: string;
  cancellationNumber?: string;
  customer?: { name: string; email: string; phone?: string };
  orderDate?: string;
  requestedDate?: string;
  returnDate?: string;
  trackingNumber?: string;
  carrier?: string;
  originalAmount?: number;
  refundAmount?: number;
  fees?: { name: string; amount: number }[];
  notes?: string;
  adminNotes?: string;
  returnReason?: string;
  cancellationReason?: string;
  refundReason?: string;
}

export interface Banner {
  id: string;
  title: string;
  isActive: boolean;
  position: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  linkUrl?: string;
  altText?: string;
  sortOrder?: number;
}

export interface BannerFormData {
  title: string;
  isActive: boolean;
  imageUrl?: string;
  linkUrl?: string;
  altText?: string;
  position?: string;
  sortOrder?: number;
}

export interface BannerResponse {
  success: boolean;
  data: Banner[];
  message: string;
}

export interface BannerSingleResponse {
  success: boolean;
  data: Banner;
  message: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  user: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  children?: NavItem[];
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  siteLogo: string;
  siteFavicon: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  timezone: string;
  language: string;
  paymentMethods: string[];
  taxRate: number;
  shippingCost: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: string;
  lowStockThreshold: number;
  autoReorder: boolean;
  trackInventory: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterSite: string;
  googleAnalyticsId: string;
  facebookPixelId: string;
  conversionTracking: boolean;
  googleAnalyticsMeasurementId: string;
  googleAnalyticsTrackingId: string;
  enhancedEcommerceEnabled: boolean;
  googleAdsEnabled: boolean;
  googleAdsConversionId: string;
  googleAdsConversionLabel: string;
  facebookConversionApiEnabled: boolean;
  facebookConversionApiToken: string;
  facebookPixelAdvancedMatching: boolean;
  customTrackingScripts: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  buttonPrimaryBg: string;
  buttonPrimaryText: string;
  buttonSecondaryBg: string;
  buttonSecondaryText: string;
  bannerBackgroundColor: string;
  bannerTextColor: string;
  cardBackgroundColor: string;
  cardBorderColor: string;
  headerBackgroundColor: string;
  footerBackgroundColor: string;
  theme: string;
  defaultVariantImageWidth: number;
  defaultVariantImageHeight: number;
  variantAutoGeneration: boolean;
  allowVariantCombinations: boolean;
  showOutOfStockVariants: boolean;
  variantFallbackEnabled: boolean;
  variantAttributeTypes: string;
  googleAnalyticsEnabled: boolean;
  allowedPaymentMethods: string[];
}

export type SettingsOnChange = (field: keyof SiteSettings, value: string | number | boolean | string[]) => void;
export type SettingsOnBooleanChange = (field: keyof SiteSettings, value: boolean) => void;
export type SettingsOnArrayChange = (field: keyof SiteSettings, value: string[]) => void;

export interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}

export interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

export interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export interface TrafficSource {
  source: string;
  visitors: number;
}

export interface OrderStatusCount {
  name: string;
  count: number;
}

export interface TopProduct {
  name: string;
  sold: number;
}

export interface ShipmentStatusData {
  date: string;
  delivered: number;
  inTransit: number;
  pending: number;
  returned: number;
}

export interface CarrierPerformanceData {
  carrier: string;
  shipments: number;
  onTimeRate: number;
  avgDeliveryDays: number;
}

export interface RegionalPerformanceData {
  region: string;
  shipments: number;
  deliveryTime: number;
  successRate: number;
}

export interface DeliveryTimeTrendData {
  date: string;
  avgDeliveryTime: number;
  targetTime: number;
}

export interface CostAnalysisData {
  category: string;
  actualCost: number;
  budget: number;
}

export interface DeliveryTimeDistributionData {
  range: string;
  count: number;
  percentage: number;
}

export interface ShippingVolumeData {
  month: string;
  shipments: number;
  revenue: number;
}

export interface SidebarSectionProps {
  title: string;
  items: NavItem[];
  expandedSections: string[];
  toggleSection: (id: string) => void;
  handleNavigation: (itemId: string, parentId?: string) => void;
  animatingItems: Record<string, boolean>;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
}
