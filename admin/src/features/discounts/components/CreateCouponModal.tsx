'use client';

import { useForm } from 'react-hook-form';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CouponForm } from './CouponForm';
import type { CouponFormData } from '../types';

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CouponFormData) => void;
  isPending: boolean;
}

export function CreateCouponModal({ isOpen, onClose, onSubmit, isPending }: CreateCouponModalProps) {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<CouponFormData>({
    defaultValues: {
      code: '',
      name: '',
      type: 'percentage',
      value: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      applicableTo: 'all',
      applicableItems: [],
      description: '',
    },
  });

  const handleFormSubmit = (data: CouponFormData) => {
    onSubmit({
      ...data,
      code: data.code.toUpperCase(),
      value: Number(data.value),
      minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : undefined,
      maxDiscountAmount: data.maxDiscountAmount ? Number(data.maxDiscountAmount) : undefined,
      usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined,
      applicableTo: 'all',
      applicableItems: [],
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Coupon" size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" form="create-coupon-form" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Coupon'}
          </Button>
        </div>
      }
    >
      <form id="create-coupon-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <CouponForm register={register} errors={errors} watch={watch} setValue={setValue} disabled={isPending} />
      </form>
    </Modal>
  );
}
