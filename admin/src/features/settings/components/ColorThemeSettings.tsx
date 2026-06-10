import { Eye, Palette, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import type { SiteSettings, SettingsOnChange } from '@/types';

interface ColorThemeSettingsProps {
  settings: SiteSettings;
  onChange: SettingsOnChange;
  onBooleanChange: (field: keyof SiteSettings, value: boolean) => void;
}

export function ColorThemeSettings({
  settings,
  onChange,
}: ColorThemeSettingsProps) {
  const [previewTheme, setPreviewTheme] = useState(false);

  const colorFields = [
    {
      id: 'primaryColor',
      label: 'Primary Color',
      description: 'Main brand color used for primary buttons and links',
      defaultValue: '#3B82F6',
    },
    {
      id: 'secondaryColor',
      label: 'Secondary Color',
      description: 'Secondary brand color for accents and highlights',
      defaultValue: '#10B981',
    },
    {
      id: 'accentColor',
      label: 'Accent Color',
      description: 'Color for special highlights and call-to-action elements',
      defaultValue: '#F59E0B',
    },
    {
      id: 'backgroundColor',
      label: 'Background Color',
      description: 'Main background color for the website',
      defaultValue: '#FFFFFF',
    },
    {
      id: 'textColor',
      label: 'Text Color',
      description: 'Primary text color for content',
      defaultValue: '#1F2937',
    },
    {
      id: 'buttonPrimaryBg',
      label: 'Primary Button Background',
      description: 'Background color for primary action buttons',
      defaultValue: '#3B82F6',
    },
    {
      id: 'buttonPrimaryText',
      label: 'Primary Button Text',
      description: 'Text color for primary buttons',
      defaultValue: '#FFFFFF',
    },
    {
      id: 'buttonSecondaryBg',
      label: 'Secondary Button Background',
      description: 'Background color for secondary buttons',
      defaultValue: '#F3F4F6',
    },
    {
      id: 'buttonSecondaryText',
      label: 'Secondary Button Text',
      description: 'Text color for secondary buttons',
      defaultValue: '#1F2937',
    },
    {
      id: 'bannerBackgroundColor',
      label: 'Banner Background',
      description: 'Background color for promotional banners',
      defaultValue: '#F0F9FF',
    },
    {
      id: 'bannerTextColor',
      label: 'Banner Text',
      description: 'Text color for banner content',
      defaultValue: '#1E40AF',
    },
    {
      id: 'cardBackgroundColor',
      label: 'Card Background',
      description: 'Background color for product cards and content cards',
      defaultValue: '#FFFFFF',
    },
    {
      id: 'cardBorderColor',
      label: 'Card Border',
      description: 'Border color for cards',
      defaultValue: '#E5E7EB',
    },
    {
      id: 'headerBackgroundColor',
      label: 'Header Background',
      description: 'Background color for the site header/navigation',
      defaultValue: '#FFFFFF',
    },
    {
      id: 'footerBackgroundColor',
      label: 'Footer Background',
      description: 'Background color for the site footer',
      defaultValue: '#1F2937',
    },
  ];

  const resetToDefaults = () => {
    colorFields.forEach((field) => {
      onChange(field.id as keyof SiteSettings, field.defaultValue);
    });
  };

  const getPreviewStyle = (fieldId: string) => {
    return {
      backgroundColor: settings[fieldId as keyof SiteSettings] as string,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold custom-font text-gray-900 mb-2">
            Color Theme Configuration
          </h3>
          <p className="text-gray-600 custom-font">
            Customize the color scheme for your entire website
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setPreviewTheme(!previewTheme)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {previewTheme ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            type="button"
            onClick={resetToDefaults}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
        </div>
      </div>

      {previewTheme && (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">
            Theme Preview
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              className="p-4 rounded-lg"
              style={getPreviewStyle('buttonPrimaryBg')}
            >
              <button
                className="px-4 py-2 rounded-md font-medium text-sm"
                style={{
                  backgroundColor: settings.buttonPrimaryBg,
                  color: settings.buttonPrimaryText,
                }}
              >
                Primary Button
              </button>
            </div>

            <div
              className="p-4 rounded-lg"
              style={getPreviewStyle('buttonSecondaryBg')}
            >
              <button
                className="px-4 py-2 rounded-md font-medium text-sm border"
                style={{
                  backgroundColor: settings.buttonSecondaryBg,
                  color: settings.buttonSecondaryText,
                  borderColor: settings.primaryColor,
                }}
              >
                Secondary Button
              </button>
            </div>

            <div
              className="p-4 rounded-lg"
              style={getPreviewStyle('bannerBackgroundColor')}
            >
              <div
                className="px-3 py-2 rounded text-sm"
                style={{
                  backgroundColor: settings.bannerBackgroundColor,
                  color: settings.bannerTextColor,
                }}
              >
                Promotional Banner Text
              </div>
            </div>

            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: settings.cardBackgroundColor,
                borderColor: settings.cardBorderColor,
              }}
            >
              <div
                className="text-sm font-medium"
                style={{ color: settings.textColor }}
              >
                Product Card
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: settings.textColor }}
              >
                Sample product description
              </div>
            </div>

            <div
              className="p-4 rounded-lg"
              style={getPreviewStyle('headerBackgroundColor')}
            >
              <div
                className="text-sm font-bold"
                style={{ color: settings.textColor }}
              >
                Header Navigation
              </div>
            </div>

            <div
              className="p-4 rounded-lg"
              style={getPreviewStyle('footerBackgroundColor')}
            >
              <div className="text-sm text-white">Footer Content</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colorFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 custom-font">
              {field.label}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings[field.id as keyof SiteSettings] as string}
                onChange={(e) =>
                  onChange(field.id as keyof SiteSettings, e.target.value)
                }
                className="w-12 h-10 rounded-md border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={settings[field.id as keyof SiteSettings] as string}
                onChange={(e) =>
                  onChange(field.id as keyof SiteSettings, e.target.value)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder={field.defaultValue}
              />
            </div>
            <p className="text-xs text-gray-500">{field.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Palette className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">Pro Tip</h4>
            <p className="text-sm text-blue-800">
              Use a consistent color palette that reflects your brand identity.
              Consider accessibility by ensuring sufficient contrast between
              text and background colors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
