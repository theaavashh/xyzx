'use client';

import { useState } from 'react';
import { Plus, Edit3, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';
import {
  useThreeImageGridQueries,
  ThreeImageGridModal,
  ThreeImageGridDeleteAlert,
} from '@/features/three-image-grid';
import type { ThreeImageGridSection, ThreeImageGridColumnItem } from '@/features/three-image-grid';

export default function ThreeImageGridPage() {
  const { sections, isLoading, isUploading, createOrUpdate, remove, toggleStatus, uploadImage } =
    useThreeImageGridQueries();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ThreeImageGridSection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ThreeImageGridSection | null>(null);

  const handleSubmit = async (columns: ThreeImageGridColumnItem[], isActive: boolean, order: number) => {
    const ok = await createOrUpdate(columns, editingItem, isActive, order);
    if (ok) {
      setIsModalOpen(false);
      setEditingItem(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await remove(deleteTarget);
    if (ok) setDeleteTarget(null);
  };

  return (
    <DashboardLayout title="Three Image Grid">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Three Image Grid</h1>
            <p className="text-black text-lg mt-2">Manage the three image grid section on the homepage</p>
          </div>
          <button
            type="button"
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="bg-[#D4AF37] text-white px-4 py-2.5 text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </div>

        <div className="bg-white rounded-xl">
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-8 h-0.5 bg-gray-200 rounded-full overflow-hidden mx-auto mb-4">
                  <div className="w-full h-full bg-gray-900 animate-pulse" />
                </div>
                <p className="text-gray-600">Loading sections...</p>
              </div>
            ) : sections.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sections found</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first section</p>
                <button
                  type="button"
                  onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                  className="inline-flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#C4A030] transition-colors"
                >
                  <Plus className="w-4 h-4" /> Create Section
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            section.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {section.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-sm text-gray-500">Order: {section.order}</span>
                        <span className="text-sm text-gray-500">{section.columns.length} columns</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleStatus(section)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {section.isActive ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEditingItem(section); setIsModalOpen(true); }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(section)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {section.columns.map((col) => (
                        <div key={col.id} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                          {col.imageSrc && (
                            <Image src={col.imageSrc} alt={col.imageAlt} fill className="object-contain" unoptimized />
                          )}
                          {col.productName && (
                            <div className="absolute bottom-2 left-2 right-2 bg-white p-2 rounded shadow-sm">
                              <p className="text-xs font-medium text-gray-900 truncate">{col.productName}</p>
                              {col.productPrice != null && (
                                <p className="text-xs text-gray-600">${col.productPrice.toFixed(2)}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ThreeImageGridModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingItem(null); }}
        onSubmit={handleSubmit}
        isSaving={false}
        isUploading={isUploading}
        onUploadImage={uploadImage}
        editingItem={editingItem}
      />

      <ThreeImageGridDeleteAlert
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </DashboardLayout>
  );
}
