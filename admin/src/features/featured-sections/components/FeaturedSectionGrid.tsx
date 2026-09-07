'use client';

import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  ImageIcon,
  Plus,
} from 'lucide-react';
import type { FeaturedSection } from '../types';

interface Props {
  sections: FeaturedSection[];
  isLoading: boolean;
  onEdit: (section: FeaturedSection) => void;
  onToggle: (section: FeaturedSection) => void;
  onDelete: (section: FeaturedSection) => void;
  onReorder: (sectionId: string, direction: 'up' | 'down') => void;
  onAdd: () => void;
}

export function FeaturedSectionGrid({
  sections,
  isLoading,
  onEdit,
  onToggle,
  onDelete,
  onReorder,
  onAdd,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No featured sections</h3>
        <p className="text-gray-500 mb-4">Add your first promotional banner to get started</p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2.5 text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map((section, index) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative rounded-lg border border-gray-200 overflow-hidden"
        >
          <div className="aspect-[16/9] bg-gray-100 relative">
            {section.image ? (
              <img
                src={section.image}
                alt={section.ctaText || 'Featured'}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="w-8 h-8 text-gray-300" />
              </div>
            )}
            <div className="absolute top-2 left-2 flex gap-1">
              <button
                type="button"
                onClick={() => onReorder(section.id, 'up')}
                disabled={index === 0}
                className="p-1 bg-black/50 text-white rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/70"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => onReorder(section.id, 'down')}
                disabled={index === sections.length - 1}
                className="p-1 bg-black/50 text-white rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/70"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="p-3 space-y-2">
            {section.title && (
              <h3 className="text-sm font-bold text-gray-900 truncate">{section.title}</h3>
            )}
            {section.subtitle && (
              <p className="text-xs text-gray-500 truncate">{section.subtitle}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {section.ctaText && (
                  <span className="text-sm font-medium text-gray-900">{section.ctaText}</span>
                )}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    section.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {section.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {section.ctaUrl && (
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              )}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onReorder(section.id, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-900 rounded disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onReorder(section.id, 'down')}
                  disabled={index === sections.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-900 rounded disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(section)}
                  className="px-2.5 py-1 text-xs font-medium text-[#D4AF37] bg-[#D4AF37]/10 rounded-md hover:bg-[#D4AF37]/20 transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onToggle(section)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    section.isActive
                      ? 'text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20'
                      : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                  }`}
                >
                  {section.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(section)}
                  className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
