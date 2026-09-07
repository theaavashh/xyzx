'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Edit3, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  usePopupBanner,
  useUpdatePopupBanner,
  PopupBannerPreview,
  PopupBannerForm,
} from '@/features/popup-banner';
import type { PopupBannerData } from '@/features/popup-banner';

export default function PopupBannerPage() {
  const { data: initialData, isLoading } = usePopupBanner();
  const { mutate: saveBanner, isPending: isSaving } = useUpdatePopupBanner();

  const [bannerData, setBannerData] = useState<PopupBannerData>({
    image: '',
    isActive: false,
    position: 'center',
    size: 'medium',
    lastUpdated: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (initialData) setBannerData(initialData);
  }, [initialData]);

  const handleFieldChange = useCallback(
    (field: keyof PopupBannerData, value: string | boolean) => {
      setBannerData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSave = useCallback(() => {
    saveBanner(bannerData, {
      onSuccess: (saved) => {
        setBannerData(saved);
        setIsEditing(false);
        toast.success('Popup banner updated successfully!');
      },
    });
  }, [saveBanner, bannerData]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setPreviewMode(false);
    if (initialData) setBannerData(initialData);
  }, [initialData]);

  if (isLoading) {
    return (
      <DashboardLayout title="Pop-up Banner">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Pop-up Banner">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">
              Pop-up Banner Management
            </h1>
            <p className="text-black text-lg mt-2">
              Create and manage pop-up banners for your website
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-black rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              <Eye className="w-4 h-4" />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
            {!isEditing && !previewMode && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#D4AF37] text-white px-4 py-2.5 text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${bannerData.isActive ? 'bg-green-500' : 'bg-red-500'}`}
                />
                <span className="text-sm font-medium text-gray-700">
                  {bannerData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Last updated:{' '}
                {bannerData.lastUpdated
                  ? new Date(bannerData.lastUpdated).toLocaleString()
                  : 'Never'}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  handleFieldChange('isActive', !bannerData.isActive)
                }
                disabled={!isEditing}
                className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
                  bannerData.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                } ${!isEditing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'}`}
              >
                {bannerData.isActive ? (
                  <ToggleRight className="w-4 h-4" />
                ) : (
                  <ToggleLeft className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">
                  {bannerData.isActive ? 'Active' : 'Inactive'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {previewMode ? (
          <PopupBannerPreview image={bannerData.image} size={bannerData.size} />
        ) : (
          <PopupBannerForm
            image={bannerData.image}
            isActive={bannerData.isActive}
            position={bannerData.position}
            size={bannerData.size}
            isEditing={isEditing}
            isSaving={isSaving}
            onFieldChange={handleFieldChange}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
