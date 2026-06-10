'use client';

import { useState, useCallback } from 'react';
import {
  useBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
  useToggleBannerStatus,
} from '@/hooks/useBannerQueries';
import { useSettingsQuery } from '@/features/settings/hooks/useSettings';
import type { Banner, BannerFormData } from '@/types/banner.types';

export function useTopBannerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  const { data: banners = [], isLoading } = useBanners();
  const { data: settings } = useSettingsQuery();

  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();
  const toggleBannerStatus = useToggleBannerStatus();

  const openCreateModal = useCallback(() => {
    setEditingBanner(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((banner: Banner) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingBanner(null);
  }, []);

  const handleSubmit = useCallback(
    (data: BannerFormData) => {
      const plainText = data.title.replace(/<[^>]*>/g, '').trim();
      if (!plainText) return;

      if (editingBanner) {
        updateBanner.mutate(
          { id: editingBanner.id, data },
          { onSuccess: closeModal },
        );
      } else {
        createBanner.mutate(data, { onSuccess: closeModal });
      }
    },
    [editingBanner, updateBanner, createBanner, closeModal],
  );

  const closeDeleteConfirm = useCallback(() => {
    setDeleteConfirmOpen(false);
    setBannerToDelete(null);
  }, []);

  const openDeleteConfirm = useCallback((banner: Banner) => {
    setBannerToDelete(banner);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (bannerToDelete) {
      deleteBanner.mutate(bannerToDelete.id, {
        onSuccess: () => {
          setDeleteConfirmOpen(false);
          setBannerToDelete(null);
        },
      });
    }
  }, [bannerToDelete, deleteBanner]);

  const handleToggle = useCallback(
    (id: string) => {
      toggleBannerStatus.mutate(id);
    },
    [toggleBannerStatus],
  );

  const handleBannerClick = useCallback((_banner: Banner) => {
    // no-op — reserved for future navigation or preview
  }, []);

  return {
    banners,
    isLoading,
    settings,
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
    handleBannerClick,
    isSubmitting: createBanner.isPending || updateBanner.isPending,
    isDeleting: deleteBanner.isPending,
    isTogglingId: toggleBannerStatus.variables,
  };
}
