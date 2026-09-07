'use client';

import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue, Control } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Select, Textarea } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { CouponFormData } from '../types';

interface CouponFormProps {
  register: UseFormRegister<CouponFormData>;
  errors: FieldErrors<CouponFormData>;
  watch: UseFormWatch<CouponFormData>;
  setValue: UseFormSetValue<CouponFormData>;
  disabled?: boolean;
}

export function CouponForm({ register, errors, watch, setValue, disabled }: CouponFormProps) {
  const discountType = watch('type');

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setValue('code', code, { shouldValidate: true });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Coupon Code *</label>
          <div className="flex gap-2">
            <Input
              {...register('code', { required: 'Coupon code is required', minLength: { value: 2, message: 'Code must be at least 2 characters' } })}
              placeholder="WELCOME10"
              disabled={disabled}
              className="flex-1"
              error={errors.code?.message}
            />
            <Button type="button" size="sm" onClick={generateCode} disabled={disabled}>
              Generate
            </Button>
          </div>
        </div>
        <Input
          label="Coupon Name *"
          {...register('name', { required: 'Coupon name is required' })}
          placeholder="Welcome Discount"
          disabled={disabled}
          error={errors.name?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Discount Type *"
          {...register('type', { required: 'Discount type is required' })}
          options={[
            { label: 'Percentage', value: 'percentage' },
            { label: 'Fixed Amount', value: 'fixed' },
          ]}
          disabled={disabled}
          error={errors.type?.message}
        />
        <Input
          label="Discount Value *"
          type="number"
          step="0.01"
          {...register('value', { required: 'Discount value is required', valueAsNumber: true, min: { value: 0.01, message: 'Value must be greater than 0' } })}
          placeholder="10"
          disabled={disabled}
          error={errors.value?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Minimum Order Amount"
          type="number"
          step="0.01"
          {...register('minOrderAmount', { valueAsNumber: true, min: { value: 0, message: 'Cannot be negative' } })}
          placeholder="0"
          disabled={disabled}
          error={errors.minOrderAmount?.message}
        />
        <Input
          label="Maximum Discount Amount"
          type="number"
          step="0.01"
          {...register('maxDiscountAmount', { valueAsNumber: true, min: { value: 0, message: 'Cannot be negative' } })}
          placeholder="0"
          disabled={disabled}
          error={errors.maxDiscountAmount?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Usage Limit"
          type="number"
          {...register('usageLimit', { valueAsNumber: true, min: { value: 0, message: 'Cannot be negative' } })}
          placeholder="0"
          disabled={disabled}
          error={errors.usageLimit?.message}
        />
        <div />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date *"
          type="date"
          {...register('startDate', { required: 'Start date is required' })}
          disabled={disabled}
          error={errors.startDate?.message}
        />
        <Input
          label="End Date *"
          type="date"
          {...register('endDate', { required: 'End date is required' })}
          disabled={disabled}
          error={errors.endDate?.message}
        />
      </div>

      <Textarea
        label="Description"
        {...register('description')}
        placeholder="Describe the coupon and its benefits"
        disabled={disabled}
        error={errors.description?.message}
      />

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          {...register('isActive')}
          disabled={disabled}
          className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
        />
        <span className="text-sm text-gray-700">Active</span>
      </label>
    </div>
  );
}
