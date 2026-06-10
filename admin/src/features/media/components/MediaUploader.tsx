'use client';

import { X, ImageIcon, Video } from 'lucide-react';
import Image from 'next/image';
import type { UseFormRegister, UseFormHandleSubmit, FieldErrors, UseFormWatch } from 'react-hook-form';
import type { MediaItem } from '../types';
import { linkToOptions } from '../types';

interface MediaFormData {
  linkTo: string;
  mediaType: 'image' | 'video';
  internalLink: string;
  file?: File;
}

interface MediaUploaderProps {
  show: boolean;
  editingItem: MediaItem | null;
  uploading: boolean;
  previewUrl: string | null;
  onClose: () => void;
  onSubmit: (data: MediaFormData) => Promise<void>;
  register: UseFormRegister<MediaFormData>;
  handleSubmit: UseFormHandleSubmit<MediaFormData>;
  errors: FieldErrors<MediaFormData>;
  watch: UseFormWatch<MediaFormData>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MediaUploader({
  show,
  editingItem,
  uploading,
  previewUrl,
  onClose,
  onSubmit,
  register,
  handleSubmit,
  errors,
  watch,
  onFileChange,
}: MediaUploaderProps) {
  if (!show) return null;

  const mediaType = watch('mediaType');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold custom-font">
            {editingItem ? 'Edit Media Item' : 'Add Media Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 custom-font">
              Media Type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center text-black custom-font">
                <input
                  type="radio"
                  value="image"
                  {...register('mediaType')}
                  className="mr-2"
                />
                <ImageIcon className="w-5 h-5 mr-2" />
                Image
              </label>
              <label className="flex items-center text-black custom-font">
                <input
                  type="radio"
                  value="video"
                  {...register('mediaType')}
                  className="mr-2"
                />
                <Video className="w-5 h-5 mr-2" />
                Video
              </label>
            </div>
            {errors.mediaType && (
              <p className="text-red-500 text-sm mt-1 custom-font">
                {String(errors.mediaType.message)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 custom-font">
              File *
            </label>
            <input
              type="file"
              accept={mediaType === 'video' ? 'video/*' : 'image/*'}
              {...register('file')}
              onChange={onFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            />
            {errors.file && (
              <p className="text-red-500 text-sm mt-1 custom-font">
                {String(errors.file.message)}
              </p>
            )}
          </div>

          {previewUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 custom-font">
                Preview
              </label>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {mediaType === 'video' ? (
                  <video
                    src={previewUrl}
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 custom-font">
              Link To *
            </label>
            <select
              {...register('linkTo')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black custom-font"
            >
              <option value="">Select destination</option>
              {linkToOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.linkTo && (
              <p className="text-red-500 text-sm mt-1 custom-font">
                {String(errors.linkTo.message)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 custom-font">
              Internal Link *
            </label>
            <input
              type="text"
              {...register('internalLink')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-gray-500 custom-font"
              placeholder="/products/category/item"
            />
            <p className="text-sm text-gray-500 mt-1 custom-font">
              Internal link should start with / (e.g., /products, /about)
            </p>
            {errors.internalLink && (
              <p className="text-red-500 text-sm mt-1 custom-font">
                {String(errors.internalLink.message)}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-black bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors custom-font"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 custom-font"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {editingItem ? 'Updating...' : 'Uploading...'}
                </>
              ) : editingItem ? (
                'Update Media'
              ) : (
                'Upload Media'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
