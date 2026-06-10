'use client';

import { Building2, MapPin } from 'lucide-react';
import type { FollowSection } from '../types';

interface FollowSectionFormProps {
  form: Partial<FollowSection>;
  onChange: (patch: Partial<FollowSection>) => void;
}

export function FollowSectionForm({ form, onChange }: FollowSectionFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Brand Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
              Brand Name *
            </label>
            <input
              id="brandName"
              type="text"
              value={form.brandName || ''}
              onChange={(e) => onChange({ brandName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-black"
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Store Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
            <input
              type="text"
              value={form.street || ''}
              onChange={(e) => onChange({ street: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#D4AF37] focus:border-transparent text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={form.city || ''}
              onChange={(e) => onChange({ city: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#D4AF37] focus:border-transparent text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              value={form.state || ''}
              onChange={(e) => onChange({ state: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#D4AF37] focus:border-transparent text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
            <input
              type="text"
              value={form.zip || ''}
              onChange={(e) => onChange({ zip: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#D4AF37] focus:border-transparent text-black"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              type="text"
              value={form.country || ''}
              onChange={(e) => onChange({ country: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#D4AF37] focus:border-transparent text-black"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
