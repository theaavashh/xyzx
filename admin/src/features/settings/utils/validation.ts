import type { SiteSettings } from '../types';

const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone: string): boolean => {
  return /^[+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-()]/g, ''));
};

export function validateSettings(
  settings: SiteSettings,
): Array<{ field: string; message: string }> {
  const errors: Array<{ field: string; message: string }> = [];

  if (!settings.siteName?.trim()) {
    errors.push({ field: 'siteName', message: 'Site name is required' });
  }

  if (!settings.siteUrl?.trim()) {
    errors.push({ field: 'siteUrl', message: 'Site URL is required' });
  }

  if (settings.siteUrl && !settings.siteUrl.startsWith('http')) {
    errors.push({
      field: 'siteUrl',
      message: 'Site URL must start with http:// or https://',
    });
  }

  if (settings.email && !isValidEmail(settings.email)) {
    errors.push({ field: 'email', message: 'Invalid email address' });
  }

  if (settings.phone && !isValidPhone(settings.phone)) {
    errors.push({ field: 'phone', message: 'Invalid phone number' });
  }

  if (
    settings.taxRate !== undefined &&
    (settings.taxRate < 0 || settings.taxRate > 100)
  ) {
    errors.push({
      field: 'taxRate',
      message: 'Tax rate must be between 0 and 100',
    });
  }

  if (settings.shippingCost !== undefined && settings.shippingCost < 0) {
    errors.push({
      field: 'shippingCost',
      message: 'Shipping cost cannot be negative',
    });
  }

  if (
    settings.sessionTimeout !== undefined &&
    (settings.sessionTimeout < 1 || settings.sessionTimeout > 480)
  ) {
    errors.push({
      field: 'sessionTimeout',
      message: 'Session timeout must be between 1 and 480 minutes',
    });
  }

  if (
    settings.lowStockThreshold !== undefined &&
    settings.lowStockThreshold < 0
  ) {
    errors.push({
      field: 'lowStockThreshold',
      message: 'Low stock threshold cannot be negative',
    });
  }

  const colorFields = [
    'primaryColor',
    'secondaryColor',
    'accentColor',
    'backgroundColor',
    'textColor',
    'buttonPrimaryBg',
    'buttonPrimaryText',
    'buttonSecondaryBg',
    'buttonSecondaryText',
    'bannerBackgroundColor',
    'bannerTextColor',
    'cardBackgroundColor',
    'cardBorderColor',
    'headerBackgroundColor',
    'footerBackgroundColor',
  ];

  colorFields.forEach((field) => {
    const colorValue = settings[field as keyof SiteSettings] as string;
    if (colorValue && !isValidHexColor(colorValue)) {
      errors.push({
        field,
        message: `${field.replace(/([A-Z])/g, ' $1')} must be a valid hex color (e.g., #FF0000)`,
      });
    }
  });

  return errors;
}

export const getErrorMessage = (
  field: string,
  errors: Array<{ field: string; message: string }>,
): string | undefined => {
  return errors.find((err) => err.field === field)?.message;
};
