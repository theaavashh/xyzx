'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { clientLogger } from '@/lib/logger';
import { apiRequest, uploadFile } from '@/services/apiClient';
import type { MediaItem, MediaViewMode } from '../types';
import { linkToOptions } from '../types';

const mediaSchema = z.object({
  linkTo: z.string().min(1, 'Link destination is required'),
  mediaType: z.enum(['image', 'video']),
  internalLink: z
    .string()
    .min(1, 'Internal link is required')
    .regex(/^\/[a-zA-Z0-9/-]*$/, 'Internal link must start with /'),
  file: z.custom<File | undefined>().optional(),
});

type MediaFormData = z.infer<typeof mediaSchema>;

export function useMediaQueries() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<MediaViewMode>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const itemsPerPage = 12;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MediaFormData>({
    resolver: zodResolver(mediaSchema),
  });

  const mediaType = watch('mediaType');

  const fetchMediaItems = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiRequest<{ data: { mediaItems: MediaItem[] } }>('/api/v1/media');
      setMediaItems(data.data.mediaItems || []);
      setCurrentPage(1);
    } catch (error) {
      clientLogger.error('Error fetching media items:', error);
      toast.error('Failed to fetch media items');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMediaItems();
  }, [fetchMediaItems]);

  useEffect(() => {
    const totalPages = Math.ceil(mediaItems.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [mediaItems.length, currentPage, itemsPerPage]);

  const uploadMediaFile = async (file: File): Promise<string> => {
    const data = await uploadFile<{ data: { url: string } }>('/api/upload/media', file);
    return data.data.url;
  };

  const onSubmit = async (formData: MediaFormData) => {
    try {
      setUploading(true);

      let mediaUrl = '';

      if (formData.file) {
        mediaUrl = await uploadMediaFile(formData.file);
      } else if (editingItem) {
        mediaUrl = editingItem.mediaUrl;
      } else {
        throw new Error('Please select a file');
      }

      const payload = {
        linkTo: formData.linkTo,
        mediaType: formData.mediaType.toUpperCase(),
        mediaUrl,
        internalLink: formData.internalLink,
      };

      const url = editingItem
        ? `/api/v1/media/${editingItem.id}`
        : '/api/v1/media';

      const method = editingItem ? 'PUT' as const : 'POST' as const;

      await apiRequest(url, method, payload);

      toast.success(
        editingItem
          ? 'Media item updated successfully!'
          : 'Media item created successfully!',
      );
      setShowModal(false);
      setEditingItem(null);
      reset();
      setPreviewUrl(null);
      fetchMediaItems();
    } catch (error) {
      clientLogger.error('Error saving media item:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save media item',
      );
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: MediaItem) => {
    setEditingItem(item);
    setValue('linkTo', item.linkTo);
    setValue('mediaType', item.mediaType.toLowerCase() as 'image' | 'video');
    setValue('internalLink', item.internalLink);
    setPreviewUrl(item.mediaUrl);
    setShowModal(true);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await apiRequest(`/api/v1/media/${id}`, 'PUT', {
        isActive: !currentStatus,
      });

      toast.success(
        `Media item ${!currentStatus ? 'activated' : 'deactivated'} successfully!`,
      );
      fetchMediaItems();
    } catch (error) {
      clientLogger.error('Error updating media item status:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update media item status',
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      await apiRequest(`/api/v1/media/${deleteTarget.id}`, 'DELETE');
      toast.success('Media item deleted successfully!');
      setDeleteTarget(null);
      fetchMediaItems();
    } catch (error) {
      clientLogger.error('Error deleting media item:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete media item',
      );
    }
  };

  const handleDelete = (item: MediaItem) => {
    setDeleteTarget(item);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const openModal = () => {
    setEditingItem(null);
    reset();
    setPreviewUrl(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    reset();
    setPreviewUrl(null);
  };

  const totalPages = Math.ceil(mediaItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = mediaItems.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    mediaItems,
    loading,
    viewMode,
    setViewMode,
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    currentItems,
    showModal,
    editingItem,
    uploading,
    previewUrl,
    deleteTarget,
    setDeleteTarget,
    openModal,
    closeModal,
    handleEdit,
    handleToggleActive,
    handleDelete,
    handleDeleteConfirm,
    cancelDelete,
    handlePageChange,
    register,
    handleSubmit,
    errors,
    watch,
    handleFileChange,
    onSubmit,
    mediaType,
    linkToOptions,
    fetchMediaItems,
  };
}
