'use client';

import { useCallback, useMemo, useState } from 'react';
import { Filter, Plus, Search, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { FilterDrawer } from '@/components/ui/FilterDrawer';
import { useCoupons, useCouponStats, useCreateCoupon, useUpdateCoupon, useDeleteCoupon, useToggleCouponStatus } from '@/hooks/useCouponQueries';
import { DiscountStatsCards } from '@/features/discounts/components/DiscountStatsCards';
import { DiscountTable } from '@/features/discounts/components/DiscountTable';
import { Modal } from '@/components/ui/Modal';
import { CouponForm } from '@/features/discounts/components/CouponForm';
import { CreateCouponModal } from '@/features/discounts/components/CreateCouponModal';
import { DeleteCouponAlert } from '@/features/discounts/components/DeleteCouponAlert';
import type { Coupon, CouponFormData, StatusFilter, DiscountType } from '@/features/discounts/types';

const emptyForm = (): CouponFormData => ({
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
});

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
  const [formData, setFormData] = useState<CouponFormData>(emptyForm());
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

  const openCreate = useCallback(() => {
    setFormData(emptyForm());
    setShowCreate(true);
  }, []);

  const handleCreate = useCallback(() => {
    createMut.mutate(formData, { onSuccess: () => setShowCreate(false) });
  }, [createMut, formData]);

  const openEdit = useCallback((coupon: Coupon) => {
    setEditing(coupon);
  }, []);

  const handleUpdate = useCallback(() => {
    if (!editing) return;
    updateMut.mutate(
      { id: editing.id, data: editing as unknown as CouponFormData },
      { onSuccess: () => setEditing(null) },
    );
  }, [updateMut, editing]);

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
            <h1 className="text-2xl sm:text-3xl font-bold text-black lastik">Discount Management</h1>
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
            <Button onClick={openCreate}>
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
          data={formData}
          onChange={setFormData}
          isPending={createMut.isPending}
        />

        {editing && (
          <Modal
            isOpen={true}
            onClose={() => setEditing(null)}
            title="Edit Coupon"
            size="lg"
            footer={
              <div className="flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setEditing(null)} disabled={updateMut.isPending}>
                  Cancel
                </Button>
                <Button type="submit" form="edit-coupon-form" disabled={updateMut.isPending}>
                  {updateMut.isPending ? 'Updating...' : 'Update Coupon'}
                </Button>
              </div>
            }
          >
            <form
              id="edit-coupon-form"
              onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}
            >
              <CouponForm
                initial={editing as unknown as CouponFormData}
                onChange={(data: CouponFormData) => setEditing((prev: Coupon | null) => prev ? { ...prev, ...data } as Coupon : null)}
                disabled={updateMut.isPending}
              />
            </form>
          </Modal>
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
