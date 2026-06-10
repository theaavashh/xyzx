'use client';

import DashboardLayout from '@/components/DashboardLayout';
import {
  AboutForm,
  useAboutData,
  useSaveAboutData,
} from '@/features/about';
import type { AboutUsData } from '@/features/about';
import { useState } from 'react';

export default function AboutUsPage() {
  const { aboutData, setAboutData, isLoading } = useAboutData();
  const { save, isSaving } = useSaveAboutData();

  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleInputChange = (field: keyof AboutUsData, value: string | boolean) => {
    setAboutData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!aboutData) return;
    try {
      const updated = await save(aboutData);
      setAboutData(updated);
      setIsEditing(false);
    } catch {
      // Error toast is handled in the hook
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewMode(false);
  };

  if (isLoading || !aboutData) {
    return (
      <DashboardLayout title="About Us">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="About Us">
      <AboutForm
        aboutData={aboutData}
        isEditing={isEditing}
        isSaving={isSaving}
        previewMode={previewMode}
        onInputChange={handleInputChange}
        onSave={handleSave}
        onCancel={handleCancel}
        onTogglePreview={() => setPreviewMode(!previewMode)}
        onToggleEdit={() => setIsEditing(true)}
      />
    </DashboardLayout>
  );
}
