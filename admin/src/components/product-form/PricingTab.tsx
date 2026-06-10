'use client';

import React, { useState } from 'react';
import { Plus, Globe, Trash2 } from 'lucide-react';

interface CurrencyPrice {
  id?: string;
  country: string;
  currency: string;
  symbol: string;
  price: number;
  comparePrice?: number;
  minDeliveryDays?: number;
  maxDeliveryDays?: number;
  isActive?: boolean;
}

interface PricingTabProps {
  currencyPrices: CurrencyPrice[];
  errors: Record<string, string>;
  onAddCurrencyPrice: (price: CurrencyPrice) => void;
  onRemoveCurrencyPrice: (id: string) => void;
}

interface NewCurrencyPriceForm {
  country: string;
  currency: string;
  symbol: string;
  price: number;
  comparePrice?: number;
  isActive: boolean;
}

const validatePricing = (currencyPrices: CurrencyPrice[]): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (currencyPrices.length === 0) {
    errors.pricing = 'At least one currency price is required';
  } else {
    const invalidPrices = currencyPrices.filter(
      (cp) => cp.price < 0 || isNaN(cp.price)
    );
    if (invalidPrices.length > 0) {
      errors.pricing = 'All currency prices must be valid positive numbers';
    }
  }
  return errors;
};

const currencyOptions = [
  { country: 'Australia', currency: 'AUD', symbol: 'A$' },
  { country: 'New Zealand', currency: 'NZD', symbol: 'NZ$' },
];

const PricingTab: React.FC<PricingTabProps> = React.memo(({
  currencyPrices,
  errors,
  onAddCurrencyPrice,
  onRemoveCurrencyPrice,
}) => {
  const [newCurrencyPrice, setNewCurrencyPrice] = useState<NewCurrencyPriceForm>({
    country: '',
    currency: 'USD',
    symbol: '$',
    price: 0,
    comparePrice: 0,
    isActive: true,
  });

  const handleCountrySelect = (country: string) => {
    const selectedCountry = currencyOptions.find((opt) => opt.country === country);
    setNewCurrencyPrice((prev) => ({
      ...prev,
      country,
      currency: selectedCountry?.currency || prev.currency,
      symbol: selectedCountry?.symbol || prev.symbol,
    }));
  };

  const handleAddPrice = () => {
    if (newCurrencyPrice.country && newCurrencyPrice.currency && newCurrencyPrice.price) {
      onAddCurrencyPrice({
        ...newCurrencyPrice,
        id: Date.now().toString(),
      });
      setNewCurrencyPrice({
        country: '',
        currency: 'USD',
        symbol: '$',
        price: 0,
        comparePrice: 0,
        isActive: true,
      });
    }
  };

  return (
    <div className="space-y-6">
      {errors.pricing && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{errors.pricing}</p>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              International Pricing
            </h3>
            <p className="text-sm text-gray-500">
              Set different prices for different countries
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                value={newCurrencyPrice.country}
                onChange={(e) => handleCountrySelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
              >
                <option value="">Select Country</option>
                {currencyOptions.map((opt) => (
                  <option key={opt.country} value={opt.country}>
                    {opt.country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <input
                type="text"
                value={newCurrencyPrice.currency}
                onChange={(e) =>
                  setNewCurrencyPrice((prev) => ({
                    ...prev,
                    currency: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
                placeholder="USD"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Symbol
              </label>
              <input
                type="text"
                value={newCurrencyPrice.symbol}
                onChange={(e) =>
                  setNewCurrencyPrice((prev) => ({
                    ...prev,
                    symbol: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
                placeholder="$"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={newCurrencyPrice.price}
                onChange={(e) =>
                  setNewCurrencyPrice((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compare Price
              </label>
              <input
                type="number"
                step="0.01"
                value={newCurrencyPrice.comparePrice}
                onChange={(e) =>
                  setNewCurrencyPrice((prev) => ({
                    ...prev,
                    comparePrice: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-black"
                placeholder="0.00"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddPrice}
            className="mt-3 w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Price
          </button>
        </div>

        <div className="space-y-3">
          {currencyPrices.map((currencyPrice, index) => (
            <div
              key={currencyPrice.id || index}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border border-gray-200 rounded-lg bg-white"
            >
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Country
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {currencyPrice.country}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Currency
                </label>
                <p className="text-sm text-gray-900">{currencyPrice.currency}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Symbol
                </label>
                <p className="text-sm text-gray-900">{currencyPrice.symbol}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Price
                </label>
                <p className="text-sm font-semibold text-gray-900">
                  {currencyPrice.symbol}
                  {currencyPrice.price.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Compare Price
                </label>
                <p className="text-sm text-gray-600 line-through">
                  {currencyPrice.comparePrice
                    ? `${currencyPrice.symbol}${currencyPrice.comparePrice.toFixed(2)}`
                    : '-'}
                </p>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() =>
                    onRemoveCurrencyPrice(currencyPrice.id || index.toString())
                  }
                  className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
          {currencyPrices.length === 0 && (
            <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
              <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No country prices added yet</p>
              <p className="text-sm">Add prices for different countries above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

PricingTab.displayName = 'PricingTab';

export { validatePricing };
export default PricingTab;
