'use client';

import React from 'react';
import { Package, TruckIcon, Receipt } from 'lucide-react';

interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

interface InventoryTabProps {
  formData: {
    trackQuantity: boolean;
    quantity: number;
    lowStockThreshold: number;
    allowBackorder: boolean;
    manageStock: boolean;
    weight: number;
    weightUnit: string;
    dimensions: Dimensions;
    requiresShipping: boolean;
    shippingClass: string;
    freeShipping: boolean;
    taxable: boolean;
    taxClass: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: unknown) => void;
}

const validateInventory = (formData: InventoryTabProps['formData']): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (formData.trackQuantity && formData.quantity < 0) {
    errors.quantity = 'Quantity cannot be negative';
  }
  return errors;
};

const InventoryTab: React.FC<InventoryTabProps> = React.memo(({
  formData,
  errors,
  onInputChange,
}) => {
  const handleDimensionChange = (field: keyof Dimensions, value: number | string) => {
    const newDimensions = { ...formData.dimensions, [field]: value };
    onInputChange('dimensions', newDimensions);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-600" />
          Stock Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.quantity}
              onChange={(e) =>
                onInputChange('quantity', parseInt(e.target.value) || 0)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none text-black ${
                errors.quantity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Low Stock Threshold
            </label>
            <input
              type="number"
              min="0"
              value={formData.lowStockThreshold}
              onChange={(e) =>
                onInputChange('lowStockThreshold', parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
              placeholder="5"
            />
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="trackQuantity"
              checked={formData.trackQuantity}
              onChange={(e) => onInputChange('trackQuantity', e.target.checked)}
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="trackQuantity"
              className="ml-2 block text-sm text-gray-900"
            >
              Track quantity for this product
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowBackorder"
              checked={formData.allowBackorder}
              onChange={(e) => onInputChange('allowBackorder', e.target.checked)}
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="allowBackorder"
              className="ml-2 block text-sm text-gray-900"
            >
              Allow backorders when out of stock
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="manageStock"
              checked={formData.manageStock}
              onChange={(e) => onInputChange('manageStock', e.target.checked)}
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="manageStock"
              className="ml-2 block text-sm text-gray-900"
            >
              Manage stock levels
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-600" />
          Shipping & Weight
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.weight}
                onChange={(e) =>
                  onInputChange('weight', parseFloat(e.target.value) || 0)
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
                placeholder="0.00"
              />
              <select
                value={formData.weightUnit}
                onChange={(e) => onInputChange('weightUnit', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="lb">lb</option>
                <option value="oz">oz</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dimensions
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.dimensions.length}
                onChange={(e) =>
                  handleDimensionChange('length', parseFloat(e.target.value) || 0)
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
                placeholder="L"
              />
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.dimensions.width}
                onChange={(e) =>
                  handleDimensionChange('width', parseFloat(e.target.value) || 0)
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
                placeholder="W"
              />
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.dimensions.height}
                onChange={(e) =>
                  handleDimensionChange('height', parseFloat(e.target.value) || 0)
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
                placeholder="H"
              />
            </div>
            <select
              value={formData.dimensions.unit}
              onChange={(e) => handleDimensionChange('unit', e.target.value)}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
            >
              <option value="cm">cm</option>
              <option value="m">m</option>
              <option value="in">in</option>
              <option value="ft">ft</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="requiresShipping"
              checked={formData.requiresShipping}
              onChange={(e) =>
                onInputChange('requiresShipping', e.target.checked)
              }
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="requiresShipping"
              className="ml-2 block text-sm text-gray-900"
            >
              Requires shipping
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="freeShipping"
              checked={formData.freeShipping}
              onChange={(e) => onInputChange('freeShipping', e.target.checked)}
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="freeShipping"
              className="ml-2 block text-sm text-gray-900"
            >
              Free shipping
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shipping Class
            </label>
            <input
              type="text"
              value={formData.shippingClass}
              onChange={(e) => onInputChange('shippingClass', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
              placeholder="e.g. Standard, Express"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-gray-600" />
          Tax Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="taxable"
              checked={formData.taxable}
              onChange={(e) => onInputChange('taxable', e.target.checked)}
              className="h-4 w-4 text-gray-900 accent-gray-900 border-gray-300 rounded"
            />
            <label
              htmlFor="taxable"
              className="ml-2 block text-sm text-gray-900"
            >
              This product is taxable
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax Class
            </label>
            <input
              type="text"
              value={formData.taxClass}
              onChange={(e) => onInputChange('taxClass', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
              placeholder="e.g. Standard Rate, Reduced Rate"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

InventoryTab.displayName = 'InventoryTab';

export { validateInventory };
export default InventoryTab;
