'use client';

import { BarChart3, TrendingUp } from 'lucide-react';
import type {
  SiteSettings,
  SettingsOnChange,
  SettingsOnBooleanChange,
  SettingsOnArrayChange,
} from '@/types';
import { MediaUploader } from './MediaUploader';
import {
  InputField,
  TextAreaField,
  SelectField,
  CheckboxField,
} from './FormFields';
import { TIMEZONES, LANGUAGES, PASSWORD_POLICIES } from '../utils/constants';

export function GeneralSettings({
  settings,
  onChange,
  onMediaUpload,
  isUploading,
}: {
  settings: SiteSettings;
  onChange: SettingsOnChange;
  onMediaUpload: { logo: (file: File) => Promise<void>; favicon: (file: File) => Promise<void> };
  isUploading: boolean;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        General Settings
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MediaUploader
          label="Site Logo"
          type="logo"
          currentUrl={settings.siteLogo}
          onUpload={onMediaUpload.logo}
          isUploading={isUploading}
        />

        <MediaUploader
          label="Favicon"
          type="favicon"
          currentUrl={settings.siteFavicon}
          onUpload={onMediaUpload.favicon}
          isUploading={isUploading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Site Name"
          value={settings.siteName}
          onChange={(v: string) => onChange('siteName', v)}
        />
        <InputField
          label="Site URL"
          value={settings.siteUrl}
          onChange={(v: string) => onChange('siteUrl', v)}
        />
      </div>

      <div>
        <TextAreaField
          label="Site Description"
          value={settings.siteDescription}
          onChange={(v: string) => onChange('siteDescription', v)}
          rows={3}
        />
      </div>
    </div>
  );
}

export function ContactSettings({ settings, onChange }: { settings: SiteSettings; onChange: SettingsOnChange }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        Contact Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Email"
          type="email"
          value={settings.email}
          onChange={(v: string) => onChange('email', v)}
        />
        <InputField
          label="Phone"
          type="tel"
          value={settings.phone}
          onChange={(v: string) => onChange('phone', v)}
        />
        <InputField
          label="Address"
          value={settings.address}
          onChange={(v: string) => onChange('address', v)}
        />
        <InputField
          label="City"
          value={settings.city}
          onChange={(v: string) => onChange('city', v)}
        />
        <InputField
          label="Country"
          value={settings.country}
          onChange={(v: string) => onChange('country', v)}
        />
      </div>
    </div>
  );
}

export function BusinessSettings({ settings, onChange }: { settings: SiteSettings; onChange: SettingsOnChange }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        Business Settings
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Currency"
          value={settings.currency}
          onChange={(v: string) => onChange('currency', v)}
          options={['NPR', 'USD', 'EUR', 'GBP']}
        />
        <SelectField
          label="Timezone"
          value={settings.timezone}
          onChange={(v: string) => onChange('timezone', v)}
          options={TIMEZONES}
        />
        <SelectField
          label="Language"
          value={settings.language}
          onChange={(v: string) => onChange('language', v)}
          options={LANGUAGES.map((l) => l.value)}
        />
      </div>
    </div>
  );
}

export function PaymentSettings({ settings, onChange, onArrayChange }: { settings: SiteSettings; onChange: SettingsOnChange; onArrayChange: SettingsOnArrayChange }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        Payment Settings
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Tax Rate (%)"
          type="number"
          value={settings.taxRate}
          onChange={(v: string) => onChange('taxRate', Number(v))}
        />
        <InputField
          label="Shipping Cost"
          type="number"
          value={settings.shippingCost}
          onChange={(v: string) => onChange('shippingCost', Number(v))}
        />
      </div>
    </div>
  );
}

export function NotificationSettings({ settings, onBooleanChange }: { settings: SiteSettings; onBooleanChange: SettingsOnBooleanChange }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        Notification Settings
      </h3>
      <div className="space-y-4">
        <CheckboxField
          label="Email Notifications"
          checked={settings.emailNotifications}
          onChange={(v: boolean) => onBooleanChange('emailNotifications', v)}
        />
        <CheckboxField
          label="SMS Notifications"
          checked={settings.smsNotifications}
          onChange={(v: boolean) => onBooleanChange('smsNotifications', v)}
        />
        <CheckboxField
          label="Push Notifications"
          checked={settings.pushNotifications}
          onChange={(v: boolean) => onBooleanChange('pushNotifications', v)}
        />
      </div>
    </div>
  );
}

export function SecuritySettings({ settings, onChange, onBooleanChange }: { settings: SiteSettings; onChange: SettingsOnChange; onBooleanChange: SettingsOnBooleanChange }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        Security Settings
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CheckboxField
          label="Two-Factor Authentication"
          checked={settings.twoFactorAuth}
          onChange={(v: boolean) => onBooleanChange('twoFactorAuth', v)}
        />
        <InputField
          label="Session Timeout (minutes)"
          type="number"
          value={settings.sessionTimeout}
          onChange={(v: string) => onChange('sessionTimeout', Number(v))}
        />
        <SelectField
          label="Password Policy"
          value={settings.passwordPolicy}
          onChange={(v: string) => onChange('passwordPolicy', v)}
          options={PASSWORD_POLICIES.map((p) => p.value)}
        />
      </div>
    </div>
  );
}

export function InventorySettings({ settings, onChange, onBooleanChange }: { settings: SiteSettings; onChange: SettingsOnChange; onBooleanChange: SettingsOnBooleanChange }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        Inventory Settings
      </h3>
      <div className="space-y-4">
        <InputField
          label="Low Stock Threshold"
          type="number"
          value={settings.lowStockThreshold}
          onChange={(v: string) => onChange('lowStockThreshold', Number(v))}
        />
        <CheckboxField
          label="Auto Reorder"
          checked={settings.autoReorder}
          onChange={(v: boolean) => onBooleanChange('autoReorder', v)}
        />
        <CheckboxField
          label="Track Inventory"
          checked={settings.trackInventory}
          onChange={(v: boolean) => onBooleanChange('trackInventory', v)}
        />
      </div>
    </div>
  );
}

export function SeoSettings({ settings, onChange }: { settings: SiteSettings; onChange: SettingsOnChange }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-4">
        SEO Settings
      </h3>
      <div className="space-y-6">
        <InputField
          label="SEO Title"
          value={settings.seoTitle}
          onChange={(v: string) => onChange('seoTitle', v)}
        />
        <TextAreaField
          label="SEO Description"
          value={settings.seoDescription}
          onChange={(v: string) => onChange('seoDescription', v)}
          rows={3}
        />
        <InputField
          label="SEO Keywords"
          value={settings.seoKeywords}
          onChange={(v: string) => onChange('seoKeywords', v)}
        />
      </div>
    </div>
  );
}

export function AnalyticsSettings({ settings, onChange, onBooleanChange }: { settings: SiteSettings; onChange: SettingsOnChange; onBooleanChange: SettingsOnBooleanChange }) {
  return (
    <div className="space-y-8">
      <h3 className="text-lg font-semibold custom-font text-gray-900 mb-6 flex items-center space-x-2">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <span>Analytics & Conversion Tracking</span>
      </h3>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium custom-font text-gray-900 mb-4 flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span>Google Analytics</span>
        </h4>

        <div className="space-y-4">
          <CheckboxField
            label="Enable Google Analytics"
            checked={settings.googleAnalyticsEnabled}
            onChange={(v: boolean) =>
              onBooleanChange('googleAnalyticsEnabled', v)
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Measurement ID (G-XXXXXXXXXX)"
              value={settings.googleAnalyticsMeasurementId}
              onChange={(v: string) =>
                onChange('googleAnalyticsMeasurementId', v)
              }
              placeholder="G-XXXXXXXXXX"
            />
            <InputField
              label="Tracking ID (UA-XXXXXXXX-X)"
              value={settings.googleAnalyticsTrackingId}
              onChange={(v: string) => onChange('googleAnalyticsTrackingId', v)}
              placeholder="UA-XXXXXXXX-X"
            />
          </div>

          <CheckboxField
            label="Enable Enhanced Ecommerce"
            checked={settings.enhancedEcommerceEnabled}
            onChange={(v: boolean) =>
              onBooleanChange('enhancedEcommerceEnabled', v)
            }
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium custom-font text-gray-900 mb-4 flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">G</span>
          </div>
          <span>Google Ads Conversion Tracking</span>
        </h4>

        <div className="space-y-4">
          <CheckboxField
            label="Enable Google Ads Conversion Tracking"
            checked={settings.googleAdsEnabled}
            onChange={(v: boolean) => onBooleanChange('googleAdsEnabled', v)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Conversion ID"
              value={settings.googleAdsConversionId}
              onChange={(v: string) => onChange('googleAdsConversionId', v)}
              placeholder="123456789"
            />
            <InputField
              label="Conversion Label"
              value={settings.googleAdsConversionLabel}
              onChange={(v: string) => onChange('googleAdsConversionLabel', v)}
              placeholder="abcdefgHIjklmnOPQ"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium custom-font text-gray-900 mb-4 flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-700 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">f</span>
          </div>
          <span>Meta (Facebook) Conversion API</span>
        </h4>

        <div className="space-y-4">
          <CheckboxField
            label="Enable Facebook Conversion API"
            checked={settings.facebookConversionApiEnabled}
            onChange={(v: boolean) =>
              onBooleanChange('facebookConversionApiEnabled', v)
            }
          />

          <InputField
            label="Access Token"
            type="password"
            value={settings.facebookConversionApiToken}
            onChange={(v: string) => onChange('facebookConversionApiToken', v)}
            placeholder="EAACEdEose0cBA..."
          />

          <CheckboxField
            label="Enable Advanced Matching"
            checked={settings.facebookPixelAdvancedMatching}
            onChange={(v: boolean) =>
              onBooleanChange('facebookPixelAdvancedMatching', v)
            }
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-md font-medium custom-font text-gray-900 mb-4">
          Custom Tracking Scripts
        </h4>
        <TextAreaField
          label="Additional Tracking Code"
          value={settings.customTrackingScripts}
          onChange={(v: string) => onChange('customTrackingScripts', v)}
          rows={6}
          placeholder="Add custom JavaScript tracking code here..."
        />
        <p className="text-sm text-gray-500 mt-2">
          This code will be inserted before the closing &lt;/body&gt; tag on all
          pages.
        </p>
      </div>
    </div>
  );
}
