'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FolderTree,
  Link as LinkIcon,
  Menu,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import type { NavItem, NavigationFormData } from '../types';

interface NavigationItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: NavItem | null;
  defaultOrder?: number;
  isSaving: boolean;
  onSubmit: (formData: NavigationFormData) => void;
}

export function NavigationItemModal({
  isOpen,
  onClose,
  editingItem,
  defaultOrder = 0,
  isSaving,
  onSubmit,
}: NavigationItemModalProps) {
  const [form, setForm] = useState<NavigationFormData>({
    name: '',
    href: '',
    order: 0,
    isActive: true,
    columns: [],
  });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setForm(JSON.parse(JSON.stringify(editingItem)));
      } else {
        setForm({
          name: '',
          href: '',
          order: defaultOrder,
          isActive: true,
          columns: [],
        });
      }
    }
  }, [isOpen, editingItem, defaultOrder]);

  const addColumn = () => {
    setForm((prev) => ({
      ...prev,
      columns: [
        ...prev.columns,
        { title: '', href: '', order: prev.columns.length, links: [] },
      ],
    }));
  };

  const removeColumn = (columnIndex: number) => {
    setForm((prev) => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== columnIndex),
    }));
  };

  const updateColumn = (columnIndex: number, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      columns: prev.columns.map((col, i) =>
        i === columnIndex ? { ...col, [field]: value } : col,
      ),
    }));
  };

  const addLink = (columnIndex: number) => {
    setForm((prev) => ({
      ...prev,
      columns: prev.columns.map((col, i) =>
        i === columnIndex
          ? { ...col, links: [...col.links, { label: '', href: '', order: col.links.length }] }
          : col,
      ),
    }));
  };

  const removeLink = (columnIndex: number, linkIndex: number) => {
    setForm((prev) => ({
      ...prev,
      columns: prev.columns.map((col, i) =>
        i === columnIndex
          ? { ...col, links: col.links.filter((_, j) => j !== linkIndex) }
          : col,
      ),
    }));
  };

  const updateLink = (columnIndex: number, linkIndex: number, field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      columns: prev.columns.map((col, i) =>
        i === columnIndex
          ? {
              ...col,
              links: col.links.map((link, j) =>
                j === linkIndex ? { ...link, [field]: value } : link,
              ),
            }
          : col,
      ),
    }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSubmit(form);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full sm:max-w-3xl max-h-[95vh] sm:max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
              <div className="flex items-center gap-3">
                
                <div>
                  <h2 className="text-2xl font-semibold text-black lastik">
                    {editingItem ? 'Edit Navigation Item' : 'New Navigation Item'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {editingItem ? 'Update the navigation menu item' : 'Create a new menu item'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-black focus:outline-none text-black focus:ring-2 focus:ring-[#D4AF37] rounded-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Basic Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                     <input
                       type="text"
                       value={form.name}
                       onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                       placeholder="e.g. Men, Women, Kids"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">URL</label>
                      <input
                        type="text"
                        value={form.href}
                        onChange={(e) => setForm((prev) => ({ ...prev, href: e.target.value }))}
                        placeholder="e.g. /men, /women"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                       required
                     />
                   </div>
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div className={`relative w-10 h-5 rounded-full transition-colors ${form.isActive ? 'bg-[#D4AF37]' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${form.isActive ? 'translate-x-5' : ''}`} />
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                      className="sr-only"
                    />
                  </div>
                  <span className="text-sm text-gray-700">Active (visible in navigation)</span>
                </label>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Columns</h3>
                  <button
                    type="button"
                    onClick={addColumn}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Column
                  </button>
                </div>

                <div className="space-y-3">
                  {form.columns.map((column, columnIndex) => (
                    <div key={columnIndex} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-medium text-gray-500">Column Label</label>
                          <button
                            type="button"
                            onClick={() => removeColumn(columnIndex)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <FolderTree className="w-4 h-4 text-gray-400 shrink-0" />
                          <input
                            type="text"
                            value={column.title}
                            onChange={(e) => updateColumn(columnIndex, 'title', e.target.value)}
                            placeholder="e.g. New Arrivals"
                            className="flex-1 bg-white px-2 py-1.5 border border-gray-200 rounded text-sm text-black outline-none placeholder:text-gray-400"
                            required
                          />
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <input
                          type="text"
                          value={column.href}
                          onChange={(e) => updateColumn(columnIndex, 'href', e.target.value)}
                          placeholder="Column URL (e.g. /men/all)"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-black focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                        />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">Links</span>
                            <button
                              type="button"
                              onClick={() => addLink(columnIndex)}
                              className="text-xs font-medium text-gray-900 hover:text-gray-600 transition-colors"
                            >
                              + Add Link
                            </button>
                          </div>
                          {column.links.map((link, linkIndex) => (
                            <div key={linkIndex} className="flex items-center gap-2">
                              <LinkIcon className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                              <input
                                type="text"
                                value={link.label}
                                onChange={(e) => updateLink(columnIndex, linkIndex, 'label', e.target.value)}
                                placeholder="Label"
                                className="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm text-black focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none min-w-0"
                              />
                              <input
                                type="text"
                                value={link.href}
                                onChange={(e) => updateLink(columnIndex, linkIndex, 'href', e.target.value)}
                                placeholder="URL"
                                className="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm text-black focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none min-w-0"
                              />
                              <button
                                type="button"
                                onClick={() => removeLink(columnIndex, linkIndex)}
                                className="p-1 text-gray-300 hover:text-red-500 transition-colors shrink-0"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {form.columns.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                    <FolderTree className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 mb-3">No columns yet</p>
                    <button
                      type="button"
                      onClick={addColumn}
                      className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      + Add your first column
                    </button>
                  </div>
                )}
              </div>
            </form>

            <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none text-black focus:ring-2 focus:ring-[#D4AF37]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none text-black focus:ring-2 focus:ring-[#D4AF37]"
              >
                {isSaving ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : editingItem ? (
                  'Update'
                ) : (
                  'Create'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
