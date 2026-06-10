'use client';

import type { ColorSettings } from '../types';

interface ColorThemePreviewProps {
  settings: ColorSettings;
}

export function ColorThemePreview({ settings }: ColorThemePreviewProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
      <h4 className="text-sm font-medium text-black mb-3">Preview</h4>
      <div className="flex flex-wrap gap-3">
        <div
          className="px-3 py-1.5 rounded-md text-sm font-medium"
          style={{
            backgroundColor: settings.buttonPrimaryBg,
            color: settings.buttonPrimaryText,
          }}
        >
          Primary
        </div>
        <div
          className="px-3 py-1.5 rounded-md text-sm font-medium border"
          style={{
            backgroundColor: settings.buttonSecondaryBg,
            color: settings.buttonSecondaryText,
          }}
        >
          Secondary
        </div>
        <div
          className="px-3 py-1.5 rounded-md text-sm"
          style={{
            backgroundColor: settings.bannerBackgroundColor,
            color: settings.bannerTextColor,
          }}
        >
          Banner
        </div>
        <div
          className="px-3 py-1.5 rounded-md text-sm border"
          style={{
            backgroundColor: settings.cardBackgroundColor,
            borderColor: settings.cardBorderColor,
            color: settings.textColor,
          }}
        >
          Card
        </div>
        <div
          className="px-3 py-1.5 rounded-md text-sm text-white"
          style={{ backgroundColor: settings.footerBackgroundColor }}
        >
          Footer
        </div>
      </div>
    </div>
  );
}
