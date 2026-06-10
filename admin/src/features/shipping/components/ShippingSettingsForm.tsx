'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import type { ShippingSettings } from '../types';

interface Props {
  settings: ShippingSettings;
  onSave: (data: Partial<ShippingSettings>) => Promise<void>;
  isSaving: boolean;
}

export function ShippingSettingsForm({ settings, onSave, isSaving }: Props) {
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('');
  const [freeInternationalThreshold, setFreeInternationalThreshold] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');

  useEffect(() => {
    if (settings) {
      setFreeShippingThreshold(settings.freeShippingThreshold);
      setFreeInternationalThreshold(settings.freeInternationalThreshold);
      setHeroTitle(settings.heroTitle);
      setHeroSubtitle(settings.heroSubtitle);
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ freeShippingThreshold, freeInternationalThreshold, heroTitle, heroSubtitle });
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none';

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Shipping Settings</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Free Shipping Threshold</label>
          <input value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(e.target.value)} className={inputClass} placeholder="$100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Free International Threshold</label>
          <input value={freeInternationalThreshold} onChange={(e) => setFreeInternationalThreshold(e.target.value)} className={inputClass} placeholder="$200" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Title</label>
        <input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className={inputClass} placeholder="Shipping" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hero Subtitle</label>
        <input value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className={inputClass} placeholder="Fast, reliable delivery worldwide" />
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="flex items-center px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#b8962e] disabled:opacity-50 transition-colors text-sm"
      >
        <Save className="w-4 h-4 mr-2" />
        {isSaving ? 'Saving...' : 'Save Settings'}
      </button>
    </form>
  );
}
