'use client';

import { useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  useShippingItems,
  useCreateShippingItem,
  useUpdateShippingItem,
  useDeleteShippingItem,
  useToggleShippingItem,
  useShippingSettings,
  useUpdateShippingSettings,
  ShippingMethodsSection,
  ShippingInfoSection,
  ShippingRegionsSection,
  ShippingSettingsForm,
  ShippingItemModal,
} from '@/features/shipping';
import type { ShippingItem, ShippingSettings } from '@/features/shipping';

type Tab = 'methods' | 'info' | 'regions' | 'settings';

export default function ShippingPage() {
  const [activeTab, setActiveTab] = useState<Tab>('methods');

  const { items: methodItems, refetch: refetchMethods } = useShippingItems('method');
  const { items: infoItems, refetch: refetchInfo } = useShippingItems('info');
  const { items: regionItems, refetch: refetchRegions } = useShippingItems('region');
  const { settings, setSettings, isLoading: settingsLoading } = useShippingSettings();

  const { create, isCreating } = useCreateShippingItem();
  const { update, isUpdating } = useUpdateShippingItem();
  const { remove, isDeleting } = useDeleteShippingItem();
  const { toggle, isToggling } = useToggleShippingItem();
  const { save: saveSettings, isSaving: isSavingSettings } = useUpdateShippingSettings();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShippingItem | null>(null);

  const currentType = activeTab === 'methods' ? 'method' : activeTab === 'info' ? 'info' : 'region';

  const openCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEdit = (item: ShippingItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const refetchCurrent = () => {
    if (activeTab === 'methods') refetchMethods();
    else if (activeTab === 'info') refetchInfo();
    else if (activeTab === 'regions') refetchRegions();
  };

  const handleSubmit = useCallback(async (payload: Partial<ShippingItem>) => {
    if (editingItem) {
      const updated = await update(editingItem.id, payload);
      if (updated) { setModalOpen(false); refetchCurrent(); }
    } else {
      const created = await create(payload);
      if (created) { setModalOpen(false); refetchCurrent(); }
    }
  }, [editingItem, update, create, refetchCurrent]);

  const handleDelete = useCallback(async (item: ShippingItem) => {
    if (!window.confirm(`Delete this ${currentType}?`)) return;
    const ok = await remove(item.id);
    if (ok) refetchCurrent();
  }, [remove, currentType, refetchCurrent]);

  const handleToggle = useCallback(async (item: ShippingItem) => {
    const updated = await toggle(item.id);
    if (updated) refetchCurrent();
  }, [toggle, refetchCurrent]);

  const handleSaveSettings = useCallback(async (data: Partial<ShippingSettings>) => {
    const result = await saveSettings(data);
    if (result) setSettings(result);
  }, [saveSettings, setSettings]);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'methods', label: 'Methods' },
    { key: 'info', label: 'How It Works' },
    { key: 'regions', label: 'Regions' },
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <DashboardLayout title="Shipping Management">
      <div className="space-y-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">Shipping Management</h1>

        <div className="flex gap-2 border-b border-gray-200 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#D4AF37] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'methods' && (
          <ShippingMethodsSection
            items={methodItems}
            onCreate={openCreate}
            onEdit={openEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        )}

        {activeTab === 'info' && (
          <ShippingInfoSection
            items={infoItems}
            onCreate={openCreate}
            onEdit={openEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        )}

        {activeTab === 'regions' && (
          <ShippingRegionsSection
            items={regionItems}
            onCreate={openCreate}
            onEdit={openEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        )}

        {activeTab === 'settings' && settings && (
          <ShippingSettingsForm
            settings={settings}
            onSave={handleSaveSettings}
            isSaving={isSavingSettings}
          />
        )}
      </div>

      <ShippingItemModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingItem(null); }}
        item={editingItem}
        itemType={currentType}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </DashboardLayout>
  );
}
