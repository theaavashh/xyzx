'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { StoreForm, useStore, useSaveStore } from '@/features/store';
import type { StoreSection } from '@/features/store';

export default function StorePage() {
  const { storeData, setStoreData, isLoading } = useStore();
  const { save, isSaving, uploadImage, isUploading } = useSaveStore();

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field: keyof StoreSection, value: string | boolean | StoreSection['hours']) => {
    setStoreData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!storeData) return;
    try {
      const updated = await save(storeData);
      setStoreData(updated);
      setIsEditing(false);
    } catch {
      // Error toast is handled in the hook
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !storeData) return;
      const url = await uploadImage(file);
      if (url) {
        setStoreData((prev) => prev ? { ...prev, image: url } : prev);
      }
    };
    input.click();
  };

  if (isLoading || !storeData) {
    return (
      <DashboardLayout title="Store">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Store">
      <StoreForm
        storeData={storeData}
        isEditing={isEditing}
        isSaving={isSaving}
        isUploading={isUploading}
        onInputChange={handleInputChange}
        onSave={handleSave}
        onCancel={handleCancel}
        onToggleEdit={() => setIsEditing(true)}
        onImageUpload={handleImageUpload}
      />
    </DashboardLayout>
  );
}
