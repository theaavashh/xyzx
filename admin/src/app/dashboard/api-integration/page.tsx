'use client';

import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useApiIntegrationQueries } from '@/features/api-integration';
import type { ApiIntegrationSettings } from '@/features/api-integration';

type SecretKey = 'stripeSecretKey' | 'stripeWebhookSecret' | 'bankApiKey' | 'australiaPostApiKey';

export default function ApiIntegrationPage() {
  const { loading, saving, fetchSettings, saveSettings } = useApiIntegrationQueries();
  const [settings, setSettings] = useState<ApiIntegrationSettings | null>(null);
  const [formData, setFormData] = useState({
    stripePublishableKey: '',
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    bankApiKey: '',
    australiaPostApiKey: '',
  });
  const [showSecrets, setShowSecrets] = useState({
    stripeSecretKey: false,
    stripeWebhookSecret: false,
    bankApiKey: false,
    australiaPostApiKey: false,
  });

  useEffect(() => {
    (async () => {
      const response = await fetchSettings();
      if (response) {
        setSettings(response);
        setFormData({
          stripePublishableKey: response.stripePublishableKey || '',
          stripeSecretKey: response.stripeSecretKey || '',
          stripeWebhookSecret: response.stripeWebhookSecret || '',
          bankApiKey: response.bankApiKey || '',
          australiaPostApiKey: response.australiaPostApiKey || '',
        });
      }
    })();
  }, [fetchSettings]);

  const handleSave = async () => {
    await saveSettings(formData);
  };

  const handleReset = () => {
    if (settings) {
      setFormData({
        stripePublishableKey: settings.stripePublishableKey || '',
        stripeSecretKey: settings.stripeSecretKey || '',
        stripeWebhookSecret: settings.stripeWebhookSecret || '',
        bankApiKey: settings.bankApiKey || '',
        australiaPostApiKey: settings.australiaPostApiKey || '',
      });
    }
  };

  const toggleSecret = (key: SecretKey) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <DashboardLayout title="API Integration">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="API Integration">
      <div className="space-y-2 max-w-7xl">
        <div className="rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">API Integration</h1>
              <p className="text-black mt-2 opacity-75">Configure API keys for third-party integrations</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleReset}
                className="px-6 py-2.5 border border-gray-300 text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md transition-all">
                Reset
              </Button>
              <Button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 bg-[#D4AF37] text-white hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-2 max-w-5xl">
          <div className="bg-white rounded-md border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">Stripe Payment Gateway</h2>
                <p className="text-black text-sm">Configure your Stripe payment processing keys</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="stripePublishableKey" className="block text-black font-medium mb-2">Publishable Key</label>
                <input id="stripePublishableKey" type="text" value={formData.stripePublishableKey}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stripePublishableKey: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all"
                  placeholder="pk_live_..." />
                <p className="text-black text-xs mt-2 opacity-75">Your Stripe publishable key (starts with pk_live_ or pk_test_)</p>
              </div>
              <div>
                <label htmlFor="stripeSecretKey" className="block text-black font-medium mb-2">Secret Key</label>
                <div className="relative">
                  <input id="stripeSecretKey" type={showSecrets.stripeSecretKey ? 'text' : 'password'} value={formData.stripeSecretKey}
                    onChange={(e) => setFormData((prev) => ({ ...prev, stripeSecretKey: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all pr-10"
                    placeholder="sk_live_..." />
                  <button type="button" onClick={() => toggleSecret('stripeSecretKey')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showSecrets.stripeSecretKey ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-black text-xs mt-2 opacity-75">Your Stripe secret key (starts with sk_live_ or sk_test_)</p>
              </div>
              <div>
                <label htmlFor="stripeWebhookSecret" className="block text-black font-medium mb-2">Webhook Secret</label>
                <div className="relative">
                  <input id="stripeWebhookSecret" type={showSecrets.stripeWebhookSecret ? 'text' : 'password'} value={formData.stripeWebhookSecret}
                    onChange={(e) => setFormData((prev) => ({ ...prev, stripeWebhookSecret: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all pr-10"
                    placeholder="whsec_..." />
                  <button type="button" onClick={() => toggleSecret('stripeWebhookSecret')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showSecrets.stripeWebhookSecret ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-black text-xs mt-2 opacity-75">Your Stripe webhook signing secret (starts with whsec_)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">Bank API Integration</h2>
                <p className="text-black text-sm">Configure your bank API key for payment processing</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="bankApiKey" className="block text-black font-medium mb-2">Bank API Key</label>
                <div className="relative">
                  <input id="bankApiKey" type={showSecrets.bankApiKey ? 'text' : 'password'} value={formData.bankApiKey}
                    onChange={(e) => setFormData((prev) => ({ ...prev, bankApiKey: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all pr-10"
                    placeholder="Enter your bank API key" />
                  <button type="button" onClick={() => toggleSecret('bankApiKey')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showSecrets.bankApiKey ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-black text-xs mt-2 opacity-75">Your bank&apos;s API key for payment processing</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-md flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">Australia Post Delivery API</h2>
                <p className="text-black text-sm">Configure your Australia Post API key for shipping and delivery</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="australiaPostApiKey" className="block text-black font-medium mb-2">Australia Post API Key</label>
                <div className="relative">
                  <input id="australiaPostApiKey" type={showSecrets.australiaPostApiKey ? 'text' : 'password'} value={formData.australiaPostApiKey}
                    onChange={(e) => setFormData((prev) => ({ ...prev, australiaPostApiKey: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all pr-10"
                    placeholder="Enter your Australia Post API key" />
                  <button type="button" onClick={() => toggleSecret('australiaPostApiKey')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showSecrets.australiaPostApiKey ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-black text-xs mt-2 opacity-75">Your Australia Post API key for shipping rate calculations and label generation</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800">Security Notice</p>
                <p className="text-xs text-yellow-700 mt-1">Keep your API keys secure and never expose them in client-side code. These keys are encrypted and stored securely.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
