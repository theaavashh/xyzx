'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  Edit3,
  FolderOpen,
  Link as LinkIcon,
  PanelBottom,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from 'lucide-react';
import type { FooterSection } from '../types';

interface FooterSectionListProps {
  sections: FooterSection[];
  isLoading: boolean;
  expandedItems: Set<string>;
  onToggleExpand: (id: string) => void;
  onEdit: (item: FooterSection) => void;
  onToggleStatus: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  onDeleteRequest: (item: FooterSection) => void;
  onAdd: () => void;
}

export function FooterSectionList({
  sections,
  isLoading,
  expandedItems,
  onToggleExpand,
  onEdit,
  onToggleStatus,
  onReorder,
  onDeleteRequest,
  onAdd,
}: FooterSectionListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="text-center py-12">
            <RotateCcw className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading footer sections...</p>
          </div>
        </div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="text-center py-12">
            <PanelBottom className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No footer sections found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first footer section
            </p>
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Section
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="space-y-4">
          {sections.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="p-4 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleExpand(item.id)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    {expandedItems.has(item.id) ? (
                      <X className="w-5 h-5 text-gray-500" />
                    ) : (
                      <FolderOpen className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.links.length} links
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => onReorder(item.id, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onReorder(item.id, 'down')}
                      disabled={index === sections.length - 1}
                      className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleStatus(item.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      item.isActive
                        ? 'text-orange-600 hover:bg-orange-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={item.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {item.isActive ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteRequest(item)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedItems.has(item.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-4 bg-white">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Links ({item.links.length})
                      </h4>
                      {item.links.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          No links added yet
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {item.links.map((link, linkIndex) => (
                            <li
                              key={link.id || linkIndex}
                              className="flex items-center gap-2 text-sm text-gray-600"
                            >
                              <LinkIcon className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{link.name}</span>
                              <span className="text-gray-400">&rarr;</span>
                              <span className="text-gray-500">{link.href}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
