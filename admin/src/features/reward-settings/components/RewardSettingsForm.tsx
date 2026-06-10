'use client';

import { Button } from '@/components/ui/Button';

interface RewardSettingsFormData {
  amountUnit: number;
  rewardValue: number;
  isActive: boolean;
}

interface RewardSettingsFormProps {
  formData: RewardSettingsFormData;
  saving: boolean;
  onFormChange: (field: keyof RewardSettingsFormData, value: number | boolean) => void;
  onSave: () => void;
  onReset: () => void;
}

export function RewardSettingsForm({ formData, saving, onFormChange, onSave, onReset }: RewardSettingsFormProps) {
  return (
    <div className="space-y-2 max-w-7xl">
      <div className="rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black">Reward Settings</h1>
            <p className="text-black mt-2 opacity-75">
              Configure how customers earn rewards from their purchases
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onReset}
              className="px-6 py-2.5 border border-gray-300 text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md transition-all"
            >
              Reset
            </Button>
            <Button
              onClick={onSave}
              disabled={saving}
              className="px-6 py-2.5 bg-[#D4AF37] text-white hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-5xl">
          <div className="bg-white rounded-md border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-black">Reward Configuration</h2>
                <p className="text-black text-sm">Set up reward calculation parameters</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="amountUnit" className="block text-black font-medium mb-2">
                  Amount Unit ($)
                </label>
                <input
                  id="amountUnit"
                  type="number"
                  min="1"
                  value={formData.amountUnit}
                  onChange={(e) =>
                    onFormChange('amountUnit', parseInt(e.target.value) || 1)
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all"
                />
                <p className="text-black text-xs mt-2 opacity-75">
                  For every ${formData.amountUnit} spent, give{' '}
                  {formData.rewardValue} reward point(s)
                </p>
              </div>

              <div>
                <label htmlFor="rewardValue" className="block text-black font-medium mb-2">
                  Reward Points
                </label>
                <input
                  id="rewardValue"
                  type="number"
                  min="1"
                  value={formData.rewardValue}
                  onChange={(e) =>
                    onFormChange('rewardValue', parseInt(e.target.value) || 1)
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all"
                />
                <p className="text-black text-xs mt-2 opacity-75">
                  Points awarded per amount unit
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
                <div>
                  <label htmlFor="isActive" className="text-black font-medium cursor-pointer">
                    Enable Reward System
                  </label>
                  <p className="text-black text-xs mt-1 opacity-75">
                    Toggle rewards on or off
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      onFormChange('isActive', e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D4AF37] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
