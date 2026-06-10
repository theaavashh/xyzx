'use client';

import { Palette } from 'lucide-react';
import type { ColorSettings } from '../types';
import { colorSections } from '../types';

interface ColorThemeFormProps {
  settings: ColorSettings;
  onChange: (field: keyof ColorSettings, value: string) => void;
}

export function ColorThemeForm({ settings, onChange }: ColorThemeFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
      {colorSections.map((section) => (
        <div
          key={section.title}
          className="bg-white border border-gray-200 rounded-md p-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-sm font-medium text-black">
              {section.title}
            </h3>
          </div>
          <div className="space-y-3">
            {section.colors.map((color) => (
              <div
                key={color.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-black">
                    {color.label}
                  </p>
                  <p className="text-xs text-black opacity-60">
                    {color.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings[color.id]}
                    onChange={(e) => onChange(color.id, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={settings[color.id]}
                    onChange={(e) => onChange(color.id, e.target.value)}
                    className="w-24 px-2 py-1.5 text-sm border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
