'use client';


import { clientLogger } from '@/lib/logger';
import { uploadFile } from '@/services/apiClient';

import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface MediaTabProps {
  formData: {
    images: string[];
    videos: string[];
    thumbnail: string;
  };
  errors: Record<string, string>;
  onImagesChange: (images: string[]) => void;
}

const validateMedia = (formData: MediaTabProps['formData']): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (formData.images.length === 0) {
    errors.images = 'At least one product image is required';
  }
  return errors;
};

const MediaTab: React.FC<MediaTabProps> = React.memo(({
  formData,
  errors,
  onImagesChange,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const currentImagesCount = formData.images.length;
    const remainingSlots = 12 - currentImagesCount;
    const filesToAdd = files.slice(0, remainingSlots);

    if (filesToAdd.length === 0) {
      toast.error('Maximum 12 images allowed');
      return;
    }

    setUploading(true);
    const uploadedPaths: string[] = [];

    for (const file of filesToAdd) {
      try {
        const result = await uploadFile<{
          success: boolean;
          data?: { url: string };
        }>('/api/v1/upload/product', file);

        if (result.success && result.data?.url) {
          uploadedPaths.push(result.data.url);
        }
      } catch (error: any) {
        const msg = error?.message || `Upload of "${file.name}" failed`;
        clientLogger.error(msg, error);
        toast.error(msg);
      }
    }

    if (uploadedPaths.length > 0) {
      onImagesChange([...formData.images, ...uploadedPaths]);
      toast.success(`${uploadedPaths.length} image(s) uploaded`);
    } else if (filesToAdd.length > 0) {
      toast.error('No images were uploaded. Please try again.');
    }

    setUploading(false);
  };

  const removeImage = (index: number) => {
    onImagesChange(formData.images.filter((_, i) => i !== index));
  };

  const getImageUrl = (image: string): string => {
    if (image.startsWith('/uploads/')) {
      return `${process.env.NEXT_PUBLIC_API_BASE_URL}${image}`;
    }
    return image;
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Product Images *
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            errors.images
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="media-upload"
            disabled={uploading}
          />
          <label
            htmlFor="media-upload"
            className="cursor-pointer inline-flex flex-col items-center justify-center"
          >
            <Camera className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-gray-700 font-medium">
              {uploading ? 'Uploading...' : 'Click to upload images'}
            </span>
            <p className="text-sm text-gray-500 mt-1">
              Or drag and drop images here
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supports JPG, PNG, WEBP (Max 5MB each)
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Maximum 12 images allowed
            </p>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            {formData.images.length}/12 images uploaded
          </p>
        </div>
        {errors.images && (
          <p className="mt-2 text-sm text-red-600">{errors.images}</p>
        )}

        {formData.images.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Uploaded Images
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formData.images.map((image: string, index: number) => (
                <div key={index} className="relative group">
                  <img
                    src={getImageUrl(image)}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-contain rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

MediaTab.displayName = 'MediaTab';

export { validateMedia };
export default MediaTab;
