'use client';

import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  BannerList,
  BannerModal,
  DeleteConfirmModal,
} from '@/components/Banner';
import { useTopBannerPage } from '@/features/top-banner';

export default function TopBannerPage() {
  const {
    banners,
    isLoading,
    isModalOpen,
    editingBanner,
    deleteConfirmOpen,
    bannerToDelete,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleDelete,
    handleToggle,
    isSubmitting,
    isDeleting,
    isTogglingId,
  } = useTopBannerPage();

  return (
    <DashboardLayout title="Top Banner Management">
      <div className="space-y-2 max-w-7xl">
        <div className="rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-black outer-sans">
                Top Banner Management
              </h1>
              <p className="text-black text-lg mt-2 ">
                Easily manage and update your top banners
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="bg-[#D4AF37] text-white px-4 py-2.5 outer-sans text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold"
            >
              <Plus className="w-4 h-4" />
              Add Banner
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-md border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-md p-4 animate-pulse"
                >
                  <div className="space-y-4">
                    <div className="h-20 bg-gray-200 rounded-md"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <div className="h-8 bg-gray-200 rounded-md flex-1"></div>
                      <div className="h-8 bg-gray-200 rounded-md flex-1"></div>
                      <div className="h-8 bg-gray-200 rounded-md flex-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <BannerList
            banners={banners}
            onEdit={openEditModal}
            onDelete={openDeleteConfirm}
            onToggle={handleToggle}
            isTogglingId={isTogglingId}
          />
        )}
      </div>

      <BannerModal
        isOpen={isModalOpen}
        banner={editingBanner}
        onSubmit={handleSubmit}
        onClose={closeModal}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirmOpen}
        banner={bannerToDelete}
        onConfirm={handleDelete}
        onCancel={closeDeleteConfirm}
        isDeleting={isDeleting}
      />
    </DashboardLayout>
  );
}
