'use client';

import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Image as ImageIcon, Save, X } from 'lucide-react';
import type { PopupBannerData } from '../types';

interface PopupBannerFormProps {
  image: string;
  isActive: boolean;
  position: 'top' | 'center' | 'bottom';
  size: 'small' | 'medium' | 'large';
  isEditing: boolean;
  isSaving: boolean;
  onFieldChange: (
    field: keyof PopupBannerData,
    value: string | boolean,
  ) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function PopupBannerForm({
  image,
  isActive,
  position,
  size,
  isEditing,
  isSaving,
  onFieldChange,
  onSave,
  onCancel,
}: PopupBannerFormProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size must be less than 5MB');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onFieldChange('image', result);
          toast.success('Image uploaded successfully!');
        };
        reader.readAsDataURL(file);
      }
    },
    [onFieldChange],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            onFieldChange('image', result);
            toast.success('Image uploaded successfully!');
          };
          reader.readAsDataURL(file);
        } else {
          toast.error('Please upload an image file');
        }
      }
    },
    [onFieldChange],
  );

  const removeImage = useCallback(() => {
    onFieldChange('image', '');
    toast.success('Image removed');
  }, [onFieldChange]);

  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Banner Photo
          </h2>
          <p className="text-sm text-gray-600">
            Choose an image for your pop-up banner. Recommended size: 600x400px
          </p>
        </div>
        <div className="space-y-4">
          {image ? (
            <div className="relative">
              <img
                src={image}
                alt="Banner preview"
                className="w-full max-w-md h-48 object-cover rounded-lg"
              />
              <button
                onClick={removeImage}
                disabled={!isEditing}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300'
              } ${isEditing ? 'hover:border-gray-400' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Banner Photo
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop an image here, or
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={!isEditing}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Choose File
              </button>
              <p className="text-xs text-gray-500 mt-3">
                PNG, JPG, GIF up to 5MB • Recommended: 600x400px
              </p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={!isEditing}
          />
        </div>
      </div>

      {/* Display Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Display Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <select
              value={position}
              onChange={(e) =>
                onFieldChange(
                  'position',
                  e.target.value as 'top' | 'center' | 'bottom',
                )
              }
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 text-black"
            >
              <option value="top">Top</option>
              <option value="center">Center</option>
              <option value="bottom">Bottom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size
            </label>
            <select
              value={size}
              onChange={(e) =>
                onFieldChange(
                  'size',
                  e.target.value as 'small' | 'medium' | 'large',
                )
              }
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 text-black"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex items-center justify-end space-x-3 bg-gray-50 rounded-lg p-4">
          <button
            onClick={onCancel}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={isSaving || !image}
            className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  );
}
