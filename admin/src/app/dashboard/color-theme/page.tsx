'use client';

import { Eye, Save, Check } from 'lucide-react';
import { useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  useColorTheme,
  useUpdateColorTheme,
  ColorThemeForm,
  ColorThemePreview,
  defaultSettings,
} from '@/features/color-theme';
import type { ColorSettings } from '@/features/color-theme';

export default function ColorThemePage() {
  const { data: fetched, isLoading } = useColorTheme();
  const { mutateAsync: saveTheme, isPending: saving } = useUpdateColorTheme();
  const [dirty, setDirty] = useState<ColorSettings | null>(null);
  const [previewTheme, setPreviewTheme] = useState(false);
  const [saved, setSaved] = useState(false);

  const settings = dirty ?? fetched ?? defaultSettings;

  const updateSetting = useCallback((field: keyof ColorSettings, value: string) => {
    setDirty((prev) => ({ ...(prev ?? fetched ?? defaultSettings), [field]: value }));
    setSaved(false);
  }, [fetched]);

  const handleSave = async () => {
    await saveTheme(dirty ?? settings);
    setDirty(null);
    setSaved(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Color Theme">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Color Theme">
      <div className="space-y-2 max-w-7xl">
        <div className="rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black outer-sans">Color Theme</h1>
              <p className="text-black text-lg mt-2">
                Customize your website color scheme
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewTheme(!previewTheme)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-black border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
              >
                <Eye className="w-4 h-4" />
                {previewTheme ? 'Hide' : 'Preview'}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${saved ? 'bg-green-600 hover:bg-green-700' : 'bg-[#D4AF37] hover:bg-[#b8962e]'} focus:outline-none focus:ring-2 focus:ring-[#D4AF37]`}
              >
                {saving ? (
                  'Saving...'
                ) : saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {previewTheme && <ColorThemePreview settings={settings} />}

        <ColorThemeForm settings={settings} onChange={updateSetting} />
      </div>
    </DashboardLayout>
  );
}
