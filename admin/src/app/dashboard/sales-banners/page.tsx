'use client';

import { useCallback, useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  SalesBannerGrid,
  SalesBannerModal,
  SalesBannerDeleteAlert,
  useSalesBanners,
  useCreateSalesBanner,
  useUpdateSalesBanner,
  useDeleteSalesBanner,
  useToggleSalesBannerStatus,
  useReorderSalesBanners,
  useUploadSalesBannerImage,
} from '@/features/sales-banners';
import type { SalesBanner, SalesBannerFormData } from '@/features/sales-banners';

const INITIAL_FORM: SalesBannerFormData = {
  title: '',
  subtitle: '',
  image: '',
  buttonText: '',
  buttonUrl: '',
  isActive: true,
};

export default function SalesBannersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<SalesBanner | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<SalesBanner | null>(null);
  const [form, setForm] = useState<SalesBannerFormData>(INITIAL_FORM);

  const { data: salesBanners = [], isLoading } = useSalesBanners();
  const createBanner = useCreateSalesBanner();
  const updateBanner = useUpdateSalesBanner();
  const deleteBanner = useDeleteSalesBanner();
  const toggleStatus = useToggleSalesBannerStatus();
  const reorderBanners = useReorderSalesBanners();
  const uploadImage = useUploadSalesBannerImage();

  const handleFormChange = (field: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openModal = () => {
    setForm(INITIAL_FORM);
    setEditingBanner(null);
    setIsModalOpen(true);
  };

  const openEditModal = (banner: SalesBanner) => {
    setForm({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image: banner.image || '',
      buttonText: banner.buttonText || '',
      buttonUrl: banner.buttonUrl || '',
      isActive: banner.isActive,
    });
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
    setForm(INITIAL_FORM);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image || !form.title) return;

    if (editingBanner) {
      updateBanner.mutate(
        { id: editingBanner.id, form },
        { onSuccess: closeModal },
      );
    } else {
      createBanner.mutate(form, { onSuccess: closeModal });
    }
  };

  const handleDelete = () => {
    if (!bannerToDelete) return;
    deleteBanner.mutate(bannerToDelete.id, {
      onSuccess: () => {
        setBannerToDelete(null);
        setShowDeleteConfirm(false);
      },
    });
  };

  const handleReorder = useCallback(
    (bannerId: string, direction: 'up' | 'down') => {
      const currentIndex = salesBanners.findIndex((s) => s.id === bannerId);
      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' && currentIndex === salesBanners.length - 1)
      ) {
        return;
      }

      const newOrder = [...salesBanners];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      const temp = newOrder[currentIndex].order;
      newOrder[currentIndex].order = newOrder[targetIndex].order;
      newOrder[targetIndex].order = temp;

      newOrder.sort((a, b) => a.order - b.order);
      const orders = newOrder.map((banner, index) => ({ id: banner.id, order: index }));
      reorderBanners.mutate(orders);
    },
    [salesBanners, reorderBanners],
  );

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      uploadImage.mutate(file, {
        onSuccess: (imageUrl) => handleFormChange('image', imageUrl),
      });
    };

    input.click();
  };

  return (
    <DashboardLayout title="Sales Banners">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black lastik">Sales Banners</h1>
            <p className="text-black text-lg mt-2">Manage promotional sales banners with CTAs</p>
          </div>
          <button
            type="button"
            onClick={openModal}
            className="flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#C4A030] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Banner
          </button>
        </div>

        <SalesBannerGrid
          banners={salesBanners}
          isLoading={isLoading}
          onEdit={openEditModal}
          onToggle={(banner) => toggleStatus.mutate(banner)}
          onDelete={(banner) => { setBannerToDelete(banner); setShowDeleteConfirm(true); }}
          onReorder={handleReorder}
          onAdd={openModal}
        />
      </div>

      <SalesBannerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editingBanner={editingBanner}
        form={form}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        isUploading={uploadImage.isPending}
        onImageUpload={handleImageUpload}
      />

      <SalesBannerDeleteAlert
        isOpen={showDeleteConfirm}
        banner={bannerToDelete}
        onConfirm={handleDelete}
        onClose={() => { setShowDeleteConfirm(false); setBannerToDelete(null); }}
      />
    </DashboardLayout>
  );
}
