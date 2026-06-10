'use client';

import { Input } from '@/components/ui/Input';
import { Select, Textarea } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { CouponFormData, DiscountType, ApplicableTo } from '../types';

interface CouponFormProps {
  initial: CouponFormData;
  onChange: (data: CouponFormData) => void;
  disabled?: boolean;
}

export function CouponForm({ initial, onChange, disabled }: CouponFormProps) {
  const update = <K extends keyof CouponFormData>(key: K, value: CouponFormData[K]) =>
    onChange({ ...initial, [key]: value });

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    update('code', code);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Coupon Code *</label>
          <div className="flex gap-2">
            <Input
              value={initial.code}
              onChange={(e) => update('code', e.target.value.toUpperCase())}
              placeholder="WELCOME10"
              disabled={disabled}
              className="flex-1"
            />
            <Button type="button" size="sm" onClick={generateCode} disabled={disabled}>
              Generate
            </Button>
          </div>
        </div>
        <Input
          label="Coupon Name *"
          value={initial.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Welcome Discount"
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Discount Type *"
          value={initial.type}
          onChange={(e) => update('type', e.target.value as DiscountType)}
          options={[
            { label: 'Percentage', value: 'percentage' },
            { label: 'Fixed Amount', value: 'fixed' },
          ]}
          disabled={disabled}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Value *</label>
          <div className="relative">
            <Input
              type="text"
              value={initial.value}
              onChange={(e) => update('value', e.target.value as any)}
              placeholder="10"
              disabled={disabled}
              className="pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              {initial.type === 'percentage' ? '%' : 'A$'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Minimum Order Amount"
          type="number"
          value={initial.minOrderAmount ?? 0}
          onChange={(e) => update('minOrderAmount', Number(e.target.value))}
          placeholder="1000"
          disabled={disabled}
        />
        <Input
          label="Maximum Discount Amount"
          type="number"
          value={initial.maxDiscountAmount ?? 0}
          onChange={(e) => update('maxDiscountAmount', Number(e.target.value))}
          placeholder="500"
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Usage Limit"
          type="number"
          value={initial.usageLimit ?? 0}
          onChange={(e) => update('usageLimit', Number(e.target.value))}
          placeholder="100"
          disabled={disabled}
        />
        <Select
          label="Applicable To"
          value={initial.applicableTo}
          onChange={(e) => update('applicableTo', e.target.value as ApplicableTo)}
          options={[
            { label: 'All Products', value: 'all' },
            { label: 'Specific Products', value: 'products' },
            { label: 'Product Categories', value: 'categories' },
          ]}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          type="date"
          value={initial.startDate}
          onChange={(e) => update('startDate', e.target.value)}
          disabled={disabled}
        />
        <Input
          label="End Date"
          type="date"
          value={initial.endDate}
          onChange={(e) => update('endDate', e.target.value)}
          disabled={disabled}
        />
      </div>

      <Textarea
        label="Description"
        value={initial.description ?? ''}
        onChange={(e) => update('description', e.target.value)}
        placeholder="Describe the coupon and its benefits"
        disabled={disabled}
      />

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={initial.isActive}
          onChange={(e) => update('isActive', e.target.checked)}
          disabled={disabled}
          className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
        />
        <span className="text-sm text-gray-700">Active</span>
      </label>
    </div>
  );
}
