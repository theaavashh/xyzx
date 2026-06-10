'use client';

import { Plus, Share2, Trash2 } from 'lucide-react';
import type { SocialLink } from '../types';
import { ICON_OPTIONS } from '../types';

interface FollowSocialListProps {
  links: SocialLink[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: string, value: string | number | boolean) => void;
}

export function FollowSocialList({ links, onAdd, onRemove, onUpdate }: FollowSocialListProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Social Media Links
        </h3>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 text-sm text-[#A68520] hover:text-[#8B6914]"
        >
          <Plus className="w-4 h-4" />
          Add Social Link
        </button>
      </div>

      <div className="space-y-3">
        {links.map((link, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={link.name}
                onChange={(e) => onUpdate(index, 'name', e.target.value)}
                placeholder="Platform Name (e.g., Facebook)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
              />
              <select
                value={link.icon}
                onChange={(e) => onUpdate(index, 'icon', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <input
                type="text"
                value={link.url}
                onChange={(e) => onUpdate(index, 'url', e.target.value)}
                placeholder="URL (e.g., https://facebook.com/rapharch)"
                className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
              />
              <input
                type="text"
                value={link.ariaLabel}
                onChange={(e) => onUpdate(index, 'ariaLabel', e.target.value)}
                placeholder="Aria Label (e.g., Follow RaphArch on Facebook)"
                className="md:col-span-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
              />
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {links.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">No social links added yet</p>
          <button
            type="button"
            onClick={onAdd}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            Add your first social link
          </button>
        </div>
      )}
    </div>
  );
}
