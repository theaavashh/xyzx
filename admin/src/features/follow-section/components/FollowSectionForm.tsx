'use client';

import { Share2 } from 'lucide-react';
import type { FollowSectionFormState } from '../types';

interface FollowSectionFormProps {
  form: FollowSectionFormState;
  onChange: (patch: Partial<FollowSectionFormState>) => void;
}

export function FollowSectionForm({ form, onChange }: FollowSectionFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Social Media Links
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
            <input
              type="url"
              value={form.facebookUrl}
              onChange={(e) => onChange({ facebookUrl: e.target.value })}
              placeholder="https://facebook.com/yourpage"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
            <input
              type="url"
              value={form.instagramUrl}
              onChange={(e) => onChange({ instagramUrl: e.target.value })}
              placeholder="https://instagram.com/yourpage"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">TikTok URL</label>
            <input
              type="url"
              value={form.tiktokUrl}
              onChange={(e) => onChange({ tiktokUrl: e.target.value })}
              placeholder="https://tiktok.com/@yourpage"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
