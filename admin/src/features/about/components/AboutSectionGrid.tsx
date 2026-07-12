'use client';

import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { AboutSection } from '../types';

interface Props {
  sections: AboutSection[];
  isLoading: boolean;
  onEdit: (section: AboutSection) => void;
  onToggle: (section: AboutSection) => void;
  onDelete: (section: AboutSection) => void;
  onAdd: () => void;
}

export function AboutSectionGrid({ sections, isLoading, onEdit, onToggle, onDelete, onAdd }: Props) {
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">No about sections</h3>
        <p className="text-gray-500 mb-4">Add your first about section to get started</p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2.5 outer-sans text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all font-semibold"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative rounded-lg border border-gray-200 overflow-hidden p-4"
        >
          <p className="text-sm text-gray-700 italic mb-3 line-clamp-3">&ldquo;{section.quote}&rdquo;</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            {section.ctaText && <span>{section.ctaText}</span>}
            {section.ctaText && section.ctaUrl && <span>→</span>}
            {section.ctaUrl && <span className="truncate">{section.ctaUrl}</span>}
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              section.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {section.isActive ? 'Active' : 'Inactive'}
            </span>
            <div className="flex gap-1">
              <button type="button" onClick={() => onEdit(section)} className="px-2.5 py-1 text-xs font-medium text-[#D4AF37] bg-[#D4AF37]/10 rounded-md hover:bg-[#D4AF37]/20 transition-colors">Edit</button>
              <button type="button" onClick={() => onToggle(section)} className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                section.isActive ? 'text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
              }`}>{section.isActive ? 'Deactivate' : 'Activate'}</button>
              <button type="button" onClick={() => onDelete(section)} className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors">Delete</button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
