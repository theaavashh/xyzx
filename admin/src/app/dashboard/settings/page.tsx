'use client';

import { clientLogger } from '@/lib/logger';

import { motion } from 'framer-motion';
import {
  BarChart3,
  Bell,
  CreditCard,
  Database,
  Globe,
  Mail,
  Package,
  Save,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import type { SiteSettings } from '@/types';
import type { TabKey } from '@/features/settings';
import {
  useSettingsQuery,
  useSaveSettings,
  useUploadMedia,
  GeneralSettings,
  ContactSettings,
  BusinessSettings,
  PaymentSettings,
  NotificationSettings,
  SecuritySettings,
  InventorySettings,
  SeoSettings,
  AnalyticsSettings,
  TABS,
  validateSettings,
} from '@/features/settings';

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabKey) || 'general';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  const { data: serverSettings, isLoading, error: queryError } = useSettingsQuery();
  const saveMutation = useSaveSettings();
  const uploadMutation = useUploadMedia();

  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    if (serverSettings && !settings) {
      setSettings(serverSettings);
    }
  }, [serverSettings, settings]);

  const updateSettings = useCallback((updates: Partial<SiteSettings>) => {
    setSettings((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const handleSave = useCallback(async () => {
    if (!settings) return;
    const errors = validateSettings(settings);
    if (errors.length > 0) {
      toast.error(errors[0].message);
      return;
    }

    try {
      await saveMutation.mutateAsync(settings);
      toast.success('Settings saved successfully');
    } catch (err) {
      clientLogger.error('Save failed:', err);
      toast.error('Failed to save settings');
    }
  }, [settings, saveMutation]);

  const handleLogoUpload = useCallback(
    async (file: File) => {
      try {
        const url = await uploadMutation.mutateAsync(file);
        updateSettings({ siteLogo: url });
      } catch (err) {
        clientLogger.error('Logo upload failed:', err);
      }
    },
    [uploadMutation, updateSettings],
  );

  const handleFaviconUpload = useCallback(
    async (file: File) => {
      try {
        const url = await uploadMutation.mutateAsync(file);
        updateSettings({ siteFavicon: url });
      } catch (err) {
        clientLogger.error('Favicon upload failed:', err);
      }
    },
    [uploadMutation, updateSettings],
  );

  const handleInputChange = useCallback(
    (field: keyof SiteSettings, value: string | number | boolean | string[]) => {
      updateSettings({ [field]: value });
    },
    [updateSettings],
  );

  const handleBooleanChange = useCallback(
    (field: keyof SiteSettings, value: boolean) => {
      updateSettings({ [field]: value });
    },
    [updateSettings],
  );

  const handleArrayChange = useCallback(
    (field: keyof SiteSettings, value: string[]) => {
      updateSettings({ [field]: value });
    },
    [updateSettings],
  );

  const getTabDescription = (tabKey: TabKey): string => {
    switch (tabKey) {
      case 'general':
        return 'Configure basic site information and branding';
      case 'contact':
        return 'Manage contact details and location information';
      case 'business':
        return 'Set up business operations and regional settings';
      case 'payment':
        return 'Configure payment methods and pricing';
      case 'notifications':
        return 'Manage notification preferences';
      case 'security':
        return 'Configure security settings and authentication';
      case 'inventory':
        return 'Set up inventory management preferences';
      case 'seo':
        return 'Optimize search engine visibility and metadata';
      case 'analytics':
        return 'Configure analytics and conversion tracking';
      default:
        return 'Configure site settings';
    }
  };

  const currentSettings = settings ?? serverSettings;

  const tabContent = useMemo(() => {
    if (!currentSettings) return null;

    switch (activeTab) {
      case 'general':
        return (
          <GeneralSettings
            settings={currentSettings}
            onChange={handleInputChange}
            onMediaUpload={{
              logo: handleLogoUpload,
              favicon: handleFaviconUpload,
            }}
            isUploading={uploadMutation.isPending}
          />
        );
      case 'contact':
        return (
          <ContactSettings settings={currentSettings} onChange={handleInputChange} />
        );
      case 'business':
        return (
          <BusinessSettings settings={currentSettings} onChange={handleInputChange} />
        );
      case 'payment':
        return (
          <PaymentSettings
            settings={currentSettings}
            onChange={handleInputChange}
            onArrayChange={handleArrayChange}
          />
        );
      case 'notifications':
        return (
          <NotificationSettings
            settings={currentSettings}
            onBooleanChange={handleBooleanChange}
          />
        );
      case 'security':
        return (
          <SecuritySettings
            settings={currentSettings}
            onChange={handleInputChange}
            onBooleanChange={handleBooleanChange}
          />
        );
      case 'inventory':
        return (
          <InventorySettings
            settings={currentSettings}
            onChange={handleInputChange}
            onBooleanChange={handleBooleanChange}
          />
        );
      case 'seo':
        return (
          <SeoSettings
            settings={currentSettings}
            onChange={handleInputChange}
          />
        );
      case 'analytics':
        return (
          <AnalyticsSettings
            settings={currentSettings}
            onChange={handleInputChange}
            onBooleanChange={handleBooleanChange}
          />
        );
      default:
        return null;
    }
  }, [
    activeTab,
    currentSettings,
    handleInputChange,
    handleBooleanChange,
    handleArrayChange,
    handleLogoUpload,
    handleFaviconUpload,
    uploadMutation.isPending,
  ]);

  const IconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
    Settings,
    Mail,
    Database,
    CreditCard,
    Bell,
    Shield,
    Package,
    Search,
    BarChart3,
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-3">
        <div className="mb-6 px-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-black lastik mb-2">
            Site Settings & Configuration
          </h1>
          <p className="text-black text-lg">
            Manage your site settings, appearance, and configurations
          </p>
        </div>

        {queryError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 custom-font">Failed to load settings</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <nav className="flex overflow-x-auto p-2 space-x-1 scrollbar-hide">
              {TABS.map((tab) => {
                const Icon = IconMap[tab.icon];
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`
                      flex items-center space-x-2 px-4 py-2.5 rounded-lg text-left transition-all duration-200 text-md font-medium custom-font whitespace-nowrap
                      ${
                        activeTab === tab.key
                          ? 'bg-[#D4AF37]/50 text-black border-b-2 border-[#D4AF37]'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-b-2 border-transparent'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold custom-font text-gray-900">
                {TABS.find((tab) => tab.key === activeTab)?.label || 'Settings'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {getTabDescription(activeTab)}
              </p>
            </div>

            <div className="p-6">
              {isLoading && !currentSettings ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
                </div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {tabContent}
                </motion.div>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3 flex-wrap">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading || saveMutation.isPending}
                className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <Save className="w-4 h-4" />
                <span>{saveMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]" />
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
