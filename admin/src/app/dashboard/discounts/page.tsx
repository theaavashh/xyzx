'use client';

import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Filter, Plus, Search, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { FilterDrawer } from '@/components/ui/FilterDrawer';
import { Modal } from '@/components/ui/Modal';
import { useCoupons, useCouponStats, useCreateCoupon, useUpdateCoupon, useDeleteCoupon, useToggleCouponStatus } from '@/hooks/useCouponQueries';
import { DiscountStatsCards } from '@/features/discounts/components/DiscountStatsCards';
import { DiscountTable } from '@/features/discounts/components/DiscountTable';
import { CouponForm } from '@/features/discounts/components/CouponForm';
import { CreateCouponModal } from '@/features/discounts/components/CreateCouponModal';
import { DeleteCouponAlert } from '@/features/discounts/components/DeleteCouponAlert';
import type { Coupon, CouponFormData, StatusFilter, DiscountType } from '@/features/discounts/types';

export default function DiscountsPage() {
  const { data: coupons = [], isLoading } = useCoupons();
  const { data: stats } = useCouponStats();
  const createMut = useCreateCoupon();
  const updateMut = useUpdateCoupon();
  const deleteMut = useDeleteCoupon();
  const toggleMut = useToggleCouponStatus();

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState<Coupon | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<DiscountType | 'all'>('all');

  const hasActiveFilters = search || statusFilter !== 'all' || typeFilter !== 'all';

  const filteredCoupons = useMemo(
    () =>
      coupons.filter((c) => {
        const q = search.toLowerCase();
        return (
          (c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)) &&
          (statusFilter === 'all' || (statusFilter === 'active' ? c.isActive : !c.isActive)) &&
          (typeFilter === 'all' || c.type === typeFilter)
        );
      }),
    [coupons, search, statusFilter, typeFilter],
  );

  const handleCreate = useCallback((data: CouponFormData) => {
    createMut.mutate(data, { onSuccess: () => setShowCreate(false) });
  }, [createMut]);

  const openEdit = useCallback((coupon: Coupon) => {
    setEditing(coupon);
  }, []);

  const openDelete = useCallback((id: string) => {
    const coupon = coupons.find((c) => c.id === id);
    if (coupon) setDeleting(coupon);
  }, [coupons]);

  const handleDelete = useCallback(() => {
    if (!deleting) return;
    deleteMut.mutate(deleting.id, { onSuccess: () => setDeleting(null) });
  }, [deleteMut, deleting]);

  const handleToggle = useCallback((id: string) => {
    toggleMut.mutate(id);
  }, [toggleMut]);

  const clearFilters = useCallback(() => {
    setSearch('');
    setStatusFilter('all');
    setTypeFilter('all');
  }, []);

  return (
    <DashboardLayout title="Discount Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Discount Management</h1>
            <p className="text-black text-lg mt-2">Create and manage discount coupons and promotions</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search coupons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-black w-64"
              />
            </div>
            <Button variant={hasActiveFilters ? 'default' : 'outline'} onClick={() => setShowFilter(true)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 w-2 h-2 rounded-full bg-white" />
              )}
            </Button>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Coupon
            </Button>
          </div>
        </div>

        <DiscountStatsCards stats={stats} />

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
          </div>
        ) : (
          <DiscountTable
            coupons={filteredCoupons}
            onEdit={openEdit}
            onToggleStatus={handleToggle}
            onDelete={openDelete}
          />
        )}

        <FilterDrawer
          isOpen={showFilter}
          onClose={() => setShowFilter(false)}
          title="Filters"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                options={[
                  { label: 'All Status', value: 'all' },
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount Type</label>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as DiscountType | 'all')}
                options={[
                  { label: 'All Types', value: 'all' },
                  { label: 'Percentage', value: 'percentage' },
                  { label: 'Fixed Amount', value: 'fixed' },
                ]}
              />
            </div>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="w-full">
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </FilterDrawer>

        <CreateCouponModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
          isPending={createMut.isPending}
        />

        {editing && (
          <EditCouponModal
            coupon={editing}
            onClose={() => setEditing(null)}
            onSubmit={(data) => {
              updateMut.mutate(
                { id: editing.id, data },
                { onSuccess: () => setEditing(null) },
              );
            }}
            isPending={updateMut.isPending}
          />
        )}

        <DeleteCouponAlert
          isOpen={!!deleting}
          onClose={() => setDeleting(null)}
          onConfirm={handleDelete}
          couponCode={deleting?.code}
          isPending={deleteMut.isPending}
        />
      </div>
    </DashboardLayout>
  );
}

function EditCouponModal({
  coupon,
  onClose,
  onSubmit,
  isPending,
}: {
  coupon: Coupon;
  onClose: () => void;
  onSubmit: (data: CouponFormData) => void;
  isPending: boolean;
}) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CouponFormData>({
    defaultValues: {
      code: coupon.code,
      name: coupon.name,
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount ?? 0,
      maxDiscountAmount: coupon.maxDiscountAmount ?? 0,
      usageLimit: coupon.usageLimit ?? 0,
      startDate: coupon.startDate.split('T')[0],
      endDate: coupon.endDate.split('T')[0],
      isActive: coupon.isActive,
      applicableTo: coupon.applicableTo,
      applicableItems: coupon.applicableItems ?? [],
      description: coupon.description ?? '',
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

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Edit Coupon"
      size="lg"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" form="edit-coupon-form" disabled={isPending}>
            {isPending ? 'Updating...' : 'Update Coupon'}
          </Button>
        </div>
      }
    >
      <form id="edit-coupon-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <CouponForm register={register} errors={errors} watch={watch} setValue={setValue} disabled={isPending} />
      </form>
    </Modal>
  );
}
