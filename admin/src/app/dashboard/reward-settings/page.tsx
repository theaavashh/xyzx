'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  RewardSettingsForm,
  useRewardSettings,
  useSaveRewardSettings,
} from '@/features/reward-settings';

export default function RewardSettingsPage() {
  const { settings, loading } = useRewardSettings();
  const { save, saving } = useSaveRewardSettings();

  const [formData, setFormData] = useState({
    amountUnit: 100,
    rewardValue: 1,
    isActive: true,
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        amountUnit: settings.amountUnit,
        rewardValue: settings.rewardValue,
        isActive: settings.isActive,
      });
    }
  }, [settings]);

  const handleFormChange = (field: string, value: number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const result = await save(formData);
    if (result) {
      setFormData({
        amountUnit: result.amountUnit,
        rewardValue: result.rewardValue,
        isActive: result.isActive,
      });
    }
  };

  const handleReset = () => {
    if (settings) {
      setFormData({
        amountUnit: settings.amountUnit,
        rewardValue: settings.rewardValue,
        isActive: settings.isActive,
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Reward Settings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Reward Settings">
      <RewardSettingsForm
        formData={formData}
        saving={saving}
        onFormChange={handleFormChange}
        onSave={handleSave}
        onReset={handleReset}
      />
    </DashboardLayout>
  );
}
