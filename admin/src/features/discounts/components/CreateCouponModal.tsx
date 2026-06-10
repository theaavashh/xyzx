'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CouponForm } from './CouponForm';
import type { CouponFormData } from '../types';

interface CreateCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  data: CouponFormData;
  onChange: (data: CouponFormData) => void;
  isPending: boolean;
}

export function CreateCouponModal({ isOpen, onClose, onSubmit, data, onChange, isPending }: CreateCouponModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.code || !data.name || !data.value) return;
    onSubmit();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Coupon" size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending || !data.code || !data.name || !data.value}>
            {isPending ? 'Creating...' : 'Create Coupon'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        <CouponForm initial={data} onChange={onChange} disabled={isPending} />
      </form>
    </Modal>
  );
}
