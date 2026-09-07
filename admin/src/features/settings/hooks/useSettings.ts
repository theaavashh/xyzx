'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientLogger } from '@/lib/logger';
import { authHeaders } from '@/utils/authHeaders';
import { apiRequest } from '@/services/apiClient';
import type { SiteSettings } from '../types';

const SETTINGS_KEY = ['settings'];

function getDefaultSettings(): SiteSettings {
  return {
    siteName: 'Rapharch',
    siteDescription: 'Your trusted online shopping destination',
    siteUrl: 'https://rapharch.com',
    siteLogo: '',
    siteFavicon: '',
    email: 'info@rapharch.com',
    phone: '',
    address: '',
    city: '',
    country: 'Nepal',
    currency: 'NPR',
    timezone: 'Asia/Kathmandu',
    language: 'en',
    paymentMethods: ['cash', 'card', 'bank_transfer', 'esewa', 'khalti'],
    taxRate: 13,
    shippingCost: 100,
    primaryColor: '#D4AF37',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    buttonPrimaryBg: '#D4AF37',
    buttonPrimaryText: '#FFFFFF',
    buttonSecondaryBg: '#F3F4F6',
    buttonSecondaryText: '#1F2937',
    bannerBackgroundColor: '#F0F9FF',
    bannerTextColor: '#1E40AF',
    cardBackgroundColor: '#FFFFFF',
    cardBorderColor: '#E5E7EB',
    headerBackgroundColor: '#FFFFFF',
    footerBackgroundColor: '#1F2937',
    theme: 'light',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordPolicy: 'strong',
    lowStockThreshold: 10,
    autoReorder: false,
    trackInventory: true,
    defaultVariantImageWidth: 800,
    defaultVariantImageHeight: 800,
    variantAutoGeneration: true,
    allowVariantCombinations: true,
    showOutOfStockVariants: false,
    variantFallbackEnabled: true,
    variantAttributeTypes: 'color,size,material',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterSite: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    conversionTracking: false,
    googleAnalyticsMeasurementId: '',
    googleAnalyticsTrackingId: '',
    enhancedEcommerceEnabled: false,
    googleAdsEnabled: false,
    googleAdsConversionId: '',
    googleAdsConversionLabel: '',
    facebookConversionApiEnabled: false,
    facebookConversionApiToken: '',
    facebookPixelAdvancedMatching: false,
    customTrackingScripts: '',
    googleAnalyticsEnabled: false,
    allowedPaymentMethods: ['cash', 'card', 'bank_transfer', 'esewa', 'khalti'],
  };
}

export function useSettingsQuery() {
  return useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: async () => {
      const response = await apiRequest<{ success: boolean; data: SiteSettings }>('/api/v1/settings');
      return { ...getDefaultSettings(), ...response.data } as SiteSettings;
    },
  });
}

export function useSaveSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: SiteSettings) => {
      const response = await apiRequest<{ success: boolean; data: SiteSettings }>('/api/v1/settings', 'PUT', settings);
      return { ...getDefaultSettings(), ...response.data } as SiteSettings;
    },
    onSuccess: (data) => {
      qc.setQueryData(SETTINGS_KEY, data);
    },
    onError: (err) => {
      clientLogger.error('Failed to save settings:', err);
    },
  });
}

export function useUploadMedia() {
  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/v1/upload/file', {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders(),
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      return result.data?.url || result.data;
    },
    onError: (err) => {
      clientLogger.error('Failed to upload media:', err);
    },
  });
}
