'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Code2,
  Copy,
  Menu,
  Plus,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/components/DashboardLayout';
import {
  useNavigationItems,
  useCreateNavigationItem,
  useUpdateNavigationItem,
  useDeleteNavigationItem,
  useToggleNavigationItem,
  useReorderNavigationItems,
} from '@/features/navigation';
import { NavigationTree } from '@/features/navigation/components/NavigationTree';
import { NavigationItemModal } from '@/features/navigation/components/NavigationItemModal';
import { NavigationDeleteAlert } from '@/features/navigation/components/NavigationDeleteAlert';
import type { NavItem, NavigationFormData } from '@/features/navigation/types';

export default function NavigationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NavItem | null>(null);
  const [jsonViewItem, setJsonViewItem] = useState<NavItem | null>(null);
  const [jsonCopied, setJsonCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'json'>('list');
  const [showAllJson, setShowAllJson] = useState(false);

  const { data: navItems = [], isLoading } = useNavigationItems();
  const createMutation = useCreateNavigationItem();
  const updateMutation = useUpdateNavigationItem();
  const deleteMutation = useDeleteNavigationItem();
  const toggleMutation = useToggleNavigationItem();
  const reorderMutation = useReorderNavigationItems();

  const isSaving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (jsonViewItem) setJsonViewItem(null);
        if (isModalOpen) setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jsonViewItem, isModalOpen]);

  const openModal = (item?: NavItem) => {
    setEditingItem(item ?? null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = async (formData: NavigationFormData) => {
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      closeModal();
    } catch {
      /* error toast handled in mutation */
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      /* error toast handled in mutation */
    }
  };

  const handleToggleStatus = (id: string) => {
    toggleMutation.mutate(id);
  };

  const handleReorder = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const currentIndex = navItems.findIndex((item) => item.id === id);
      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' && currentIndex === navItems.length - 1)
      ) return;

      const newOrder = [...navItems];
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const tempOrder = newOrder[currentIndex].order;
      newOrder[currentIndex].order = newOrder[targetIndex].order;
      newOrder[targetIndex].order = tempOrder;
      newOrder.sort((a, b) => a.order - b.order);

      const orders = newOrder.map((item, index) => ({ id: item.id, order: index }));
      reorderMutation.mutate(orders);
    },
    [navItems, reorderMutation],
  );

  const copyJson = (item: NavItem) => {
    navigator.clipboard.writeText(JSON.stringify(item, null, 2));
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
    toast.success('JSON copied to clipboard');
  };

  return (
    <DashboardLayout title="Navigation">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black outer-sans">Navigation Menu</h1>
            <p className="text-black text-lg mt-2">
              Manage your storefront navigation structure
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'json'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                JSON
              </button>
            </div>
            <button
              type="button"
              onClick={() => openModal()}
              className="bg-[#D4AF37] text-white px-4 py-2.5 outer-sans text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold"
            >
              <Plus className="w-4 h-4" />
              New Item
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'json' ? (
          <JsonView
            navItems={navItems}
            showAll={showAllJson}
            setShowAll={setShowAllJson}
          />
        ) : (
          <NavigationTree
            items={navItems}
            isLoading={isLoading}
            onEdit={openModal}
            onDelete={(id) => {
              const item = navItems.find((n) => n.id === id);
              if (item) setDeleteTarget(item);
            }}
            onToggleStatus={handleToggleStatus}
            onReorder={handleReorder}
            onViewJson={setJsonViewItem}
            onCreateNew={() => openModal()}
          />
        )}
      </div>

      {/* JSON View Modal */}
      <AnimatePresence>
        {jsonViewItem && (
          <JsonViewModal
            item={jsonViewItem}
            onClose={() => setJsonViewItem(null)}
            onCopy={copyJson}
            jsonCopied={jsonCopied}
          />
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <NavigationItemModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editingItem={editingItem}
        defaultOrder={navItems.length}
        isSaving={isSaving}
        onSubmit={handleSave}
      />

      {/* Delete Confirmation */}
      <NavigationDeleteAlert
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        itemName={deleteTarget?.name}
        isPending={deleteMutation.isPending}
      />
    </DashboardLayout>
  );
}

function JsonViewModal({
  item,
  onClose,
  onCopy,
  jsonCopied,
}: {
  item: NavItem;
  onClose: () => void;
  onCopy: (item: NavItem) => void;
  jsonCopied: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: '100%', scale: 0.95 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full sm:max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
              <p className="text-xs text-gray-500">JSON representation</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onCopy(item)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {jsonCopied ? 'Copied!' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-5">
          <pre className="text-sm text-gray-800 font-mono whitespace-pre overflow-x-auto">
            {JSON.stringify(item, null, 2)}
          </pre>
        </div>
      </motion.div>
    </motion.div>
  );
}

function JsonView({
  navItems,
  showAll,
  setShowAll,
}: {
  navItems: NavItem[];
  showAll: boolean;
  setShowAll: (v: boolean) => void;
}) {
  const fullData = { count: navItems.length, items: navItems };
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-gray-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Full Navigation JSON</h2>
            <p className="text-xs text-gray-500">{navItems.length} items</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
              className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
            />
            Show full response
          </label>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(fullData, null, 2));
              toast.success('Full JSON copied');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy All
          </button>
        </div>
      </div>
      <div className="overflow-auto max-h-[60vh] p-5">
        <pre className="text-sm text-gray-800 font-mono whitespace-pre">
          {JSON.stringify(showAll ? { success: true, data: navItems } : fullData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
