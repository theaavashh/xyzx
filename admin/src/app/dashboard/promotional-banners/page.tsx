'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { uploadFile } from '@/services/apiClient';
import {
  usePromotionalBanners,
  useCreatePromotionalBanner,
  useUpdatePromotionalBanner,
  useDeletePromotionalBanner,
  useTogglePromotionalBannerStatus,
} from '@/hooks/usePromotionalBannerQueries';
import type { PromotionalBanner, PromotionalBannerFormData } from '@/hooks/usePromotionalBannerQueries';

export default function PromotionalBannersPage() {
  const { data: banners = [], isLoading } = usePromotionalBanners();
  const createMut = useCreatePromotionalBanner();
  const updateMut = useUpdatePromotionalBanner();
  const deleteMut = useDeletePromotionalBanner();
  const toggleMut = useTogglePromotionalBannerStatus();

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<PromotionalBanner | null>(null);
  const [deleting, setDeleting] = useState<PromotionalBanner | null>(null);

  return (
    <DashboardLayout title="Promotional Banners">
      <div className="w-[80vw] bg-white rounded-lg p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Promotional Banners</h1>
            <p className="text-gray-500 mt-1">Manage homepage promotional banners</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Banner
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-12 text-black text-xl font-medium bg-white w-[80vw] rounded-lg">No promotional banners yet.</div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Text Color</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-500">{banner.order}</td>
                    <td className="px-4 py-3">
                      <div className="w-24 h-14 rounded overflow-hidden bg-gray-100">
                        <img src={banner.image} alt={banner.title} className="w-full h-full object-contain" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-black">{banner.title}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded border" style={{ backgroundColor: banner.textColor }} />
                        <span className="text-xs text-gray-500">{banner.textColor}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleMut.mutate(banner.id)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {banner.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setEditing(banner)} className="p-1.5 hover:bg-gray-100 rounded">
                          <Pencil className="w-4 h-4 text-gray-600" />
                        </button>
                        <button onClick={() => setDeleting(banner)} className="p-1.5 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showCreate && (
          <BannerFormModal
            isOpen={showCreate}
            onClose={() => setShowCreate(false)}
            onSubmit={(data) => createMut.mutate(data, { onSuccess: () => setShowCreate(false) })}
            isPending={createMut.isPending}
          />
        )}

        {editing && (
          <BannerFormModal
            isOpen={true}
            onClose={() => setEditing(null)}
            initial={editing}
            onSubmit={(data) => updateMut.mutate({ id: editing.id, data }, { onSuccess: () => setEditing(null) })}
            isPending={updateMut.isPending}
          />
        )}

        {deleting && (
          <Modal
            isOpen={true}
            onClose={() => setDeleting(null)}
            title="Delete Banner"
            size="sm"
            footer={
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDeleting(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteMut.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
                  disabled={deleteMut.isPending}
                >
                  {deleteMut.isPending ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            }
          >
            <p className="text-sm text-gray-600">Are you sure you want to delete this banner?</p>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
}

function BannerFormModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  initial,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PromotionalBannerFormData) => void;
  isPending: boolean;
  initial?: PromotionalBanner;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PromotionalBannerFormData>({
    defaultValues: initial
      ? {
          title: initial.title,
          subtitle: initial.subtitle ?? '',
          image: initial.image,
          textColor: initial.textColor,
          link: initial.link ?? '',
          isActive: initial.isActive,
          order: initial.order,
        }
      : { title: '', subtitle: '', image: '', textColor: '#ffffff', link: '', isActive: true, order: 0 },
  });

  const textColor = watch('textColor');
  const image = watch('image');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(initial?.image || '');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const res = await uploadFile<{ data: { url: string } }>('/api/v1/upload/file', file);
      const url = res?.data?.url;
      if (url) {
        setValue('image', url, { shouldValidate: true });
        setPreview(url);
      }
    } catch {
      setPreview(initial?.image || '');
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setValue('image', '', { shouldValidate: true });
    setPreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initial ? 'Edit Banner' : 'Create Banner'}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" form="banner-form" disabled={isPending || uploading}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      }
    >
      <form id="banner-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Title *</label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Subtitle</label>
          <input
            {...register('subtitle')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-black mb-1">Image *</label>
          <input
            type="hidden"
            {...register('image', { required: 'Image is required' })}
          />
          {preview ? (
            <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
              >
                <X className="w-4 h-4" />
              </button>
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-amber-400 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500">Click to upload image</span>
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Text Color</label>
            <div className="flex items-center gap-2">
              <input type="color" {...register('textColor')} className="w-10 h-10 rounded border cursor-pointer" />
              <input
                {...register('textColor')}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Order</label>
            <input
              type="number"
              {...register('order', { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Link URL</label>
          <input
            {...register('link')}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register('isActive')} id="isActive" className="rounded" />
          <label htmlFor="isActive" className="text-sm text-black">
            Active
          </label>
        </div>
        {textColor && preview && (
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#1a1a1a' }}>
            <p style={{ color: textColor }} className="text-lg font-medium">
              Preview: {watch('title') || 'Banner Title'}
            </p>
            {watch('subtitle') && (
              <p style={{ color: textColor }} className="text-sm opacity-80 mt-1">
                {watch('subtitle')}
              </p>
            )}
          </div>
        )}
      </form>
    </Modal>
  );
}
