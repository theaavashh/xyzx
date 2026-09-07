'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { uploadFile } from '@/services/apiClient';
import {
  useFeatureConfigs,
  useCreateFeatureConfig,
  useUpdateFeatureConfig,
  useDeleteFeatureConfig,
  useToggleFeatureConfigStatus,
} from '@/hooks/useFeatureConfigQueries';
import type { FeatureConfig, FeatureConfigFormData } from '@/hooks/useFeatureConfigQueries';

export default function FeatureConfigsPage() {
  const { data: configs = [], isLoading } = useFeatureConfigs();
  const createMut = useCreateFeatureConfig();
  const updateMut = useUpdateFeatureConfig();
  const deleteMut = useDeleteFeatureConfig();
  const toggleMut = useToggleFeatureConfigStatus();

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<FeatureConfig | null>(null);
  const [deleting, setDeleting] = useState<FeatureConfig | null>(null);

  return (
    <DashboardLayout title="Feature Configuration">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-black">Feature Configuration</h1>
            <p className="text-gray-500 mt-1">Manage service/feature items shown on the homepage</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Feature
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
          </div>
        ) : configs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No feature configs yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {configs.map((config) => (
              <div key={config.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {config.icon && <span className="text-lg">{config.icon}</span>}
                    <h3 className="font-medium text-black">{config.title}</h3>
                  </div>
                  <button
                    onClick={() => toggleMut.mutate(config.id)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {config.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {config.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                {config.description && (
                  <p className="text-sm text-gray-500 mb-3">{config.description}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Order: {config.order}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditing(config)} className="p-1.5 hover:bg-gray-100 rounded">
                      <Pencil className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                    <button onClick={() => setDeleting(config)} className="p-1.5 hover:bg-red-50 rounded">
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showCreate && (
          <FeatureFormModal
            isOpen={showCreate}
            onClose={() => setShowCreate(false)}
            onSubmit={(data) => createMut.mutate(data, { onSuccess: () => setShowCreate(false) })}
            isPending={createMut.isPending}
          />
        )}

        {editing && (
          <FeatureFormModal
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
            title="Delete Feature"
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
            <p className="text-sm text-gray-600">Are you sure you want to delete this feature?</p>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
}

function FeatureFormModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  initial,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FeatureConfigFormData) => void;
  isPending: boolean;
  initial?: FeatureConfig;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FeatureConfigFormData>({
    defaultValues: initial
      ? {
          title: initial.title,
          description: initial.description ?? '',
          icon: initial.icon ?? '',
          image: initial.image ?? '',
          isActive: initial.isActive,
          order: initial.order,
        }
      : { title: '', description: '', icon: '', image: '', isActive: true, order: 0 },
  });

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
      title={initial ? 'Edit Feature' : 'Create Feature'}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" form="feature-form" disabled={isPending || uploading}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      }
    >
      <form id="feature-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">Title *</label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-1">Icon (lucide name or emoji)</label>
          <input
            {...register('icon')}
            placeholder="e.g. Truck, Shield, BadgeCheck..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Image Upload */}
        <div>
          <input type="hidden" {...register('image')} />
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
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">Order</label>
            <input
              type="number"
              {...register('order', { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" {...register('isActive')} id="isActive" className="rounded" />
            <label htmlFor="isActive" className="text-sm text-black">
              Active
            </label>
          </div>
        </div>
      </form>
    </Modal>
  );
}
