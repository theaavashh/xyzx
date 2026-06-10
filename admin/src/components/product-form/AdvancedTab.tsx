'use client';

import React from 'react';
import { Settings } from 'lucide-react';

interface AdvancedTabProps {
  formData: {
    isActive: boolean;
    isDigital: boolean;
    isFeatured: boolean;
    isNew: boolean;
    isOnSale: boolean;
    isBestSeller: boolean;
    isSales: boolean;
    isNewSeller: boolean;
    isFestivalOffer: boolean;
    visibility: string;
    publishedAt: string;
    notes: string;
  };
  onInputChange: (field: string, value: unknown) => void;
}

const validateAdvanced = (_formData: AdvancedTabProps['formData']): Record<string, string> => {
  return {};
};

const AdvancedTab: React.FC<AdvancedTabProps> = React.memo(({
  formData,
  onInputChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          Product Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => onInputChange('isActive', e.target.checked)}
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-900"
            >
              Active
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isDigital"
              checked={formData.isDigital}
              onChange={(e) => onInputChange('isDigital', e.target.checked)}
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="isDigital"
              className="ml-2 block text-sm text-gray-900"
            >
              Digital Product
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => onInputChange('isFeatured', e.target.checked)}
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="isFeatured"
              className="ml-2 block text-sm text-gray-900"
            >
              Featured
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isNew"
              checked={formData.isNew}
              onChange={(e) => onInputChange('isNew', e.target.checked)}
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="isNew"
              className="ml-2 block text-sm text-gray-900"
            >
              New Arrival
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isOnSale"
              checked={formData.isOnSale}
              onChange={(e) => onInputChange('isOnSale', e.target.checked)}
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="isOnSale"
              className="ml-2 block text-sm text-gray-900"
            >
              On Sale
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isBestSeller"
              checked={formData.isBestSeller}
              onChange={(e) => onInputChange('isBestSeller', e.target.checked)}
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="isBestSeller"
              className="ml-2 block text-sm text-gray-900"
            >
              Best Seller
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isSales"
              checked={formData.isSales}
              onChange={(e) => onInputChange('isSales', e.target.checked)}
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="isSales"
              className="ml-2 block text-sm text-gray-900"
            >
              Sales
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isNewSeller"
              checked={formData.isNewSeller}
              onChange={(e) => onInputChange('isNewSeller', e.target.checked)}
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="isNewSeller"
              className="ml-2 block text-sm text-gray-900"
            >
              New Seller
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isFestivalOffer"
              checked={formData.isFestivalOffer}
              onChange={(e) =>
                onInputChange('isFestivalOffer', e.target.checked)
              }
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="isFestivalOffer"
              className="ml-2 block text-sm text-gray-900"
            >
              Festival Offer
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          Visibility & Publishing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibility
            </label>
            <select
              value={formData.visibility}
              onChange={(e) => onInputChange('visibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none"
            >
              <option value="VISIBLE">Visible</option>
              <option value="HIDDEN">Hidden</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Published At
            </label>
            <input
              type="datetime-local"
              value={formData.publishedAt}
              onChange={(e) => onInputChange('publishedAt', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          Internal Notes
        </h3>
        <textarea
          value={formData.notes}
          onChange={(e) => onInputChange('notes', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none"
          placeholder="Add internal notes about this product..."
        />
        <p className="text-xs text-gray-500 mt-1">
          These notes are only visible to admin users
        </p>
      </div>
    </div>
  );
});

AdvancedTab.displayName = 'AdvancedTab';

export { validateAdvanced };
export default AdvancedTab;
