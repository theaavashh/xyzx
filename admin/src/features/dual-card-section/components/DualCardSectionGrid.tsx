'use client';

import { ArrowDown, ArrowUp, ImageIcon, Plus, X, XCircle } from 'lucide-react';
import type { DualCardSection } from '../types';

interface DualCardSectionGridProps {
  sections: DualCardSection[];
  isLoading: boolean;
  onEdit: (section: DualCardSection) => void;
  onToggle: (section: DualCardSection) => void;
  onDelete: (section: DualCardSection) => void;
  onReorder: (id: string, dir: 'up' | 'down') => void;
  onAdd: () => void;
}

export function DualCardSectionGrid({
  sections,
  isLoading,
  onEdit,
  onToggle,
  onDelete,
  onReorder,
  onAdd,
}: DualCardSectionGridProps) {
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">No dual card sections</h3>
        <p className="text-gray-500 mb-4">Add your first dual card showcase</p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg hover:bg-[#C4A030] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div key={section.id} className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{section.cards.length} cards</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  section.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {section.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onReorder(section.id, 'up')}
                disabled={index === 0}
                className="p-1.5 bg-white border border-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onReorder(section.id, 'down')}
                disabled={index === sections.length - 1}
                className="p-1.5 bg-white border border-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onEdit(section)}
                className="p-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50"
                title="Edit"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onToggle(section)}
                className={`p-1.5 border rounded ${
                  section.isActive
                    ? 'bg-white border-gray-200 hover:bg-gray-50'
                    : 'bg-[#D4AF37] border-[#D4AF37] text-white hover:bg-[#C4A030]'
                }`}
                title={section.isActive ? 'Deactivate' : 'Activate'}
              >
                {section.isActive ? (
                  <XCircle className="w-3.5 h-3.5" />
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={() => onDelete(section)}
                className="p-1.5 bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100"
                title="Delete"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.cards.map((card) => (
              <div key={card.id} className="relative">
                <div className="aspect-[4/5] rounded overflow-hidden bg-gray-100">
                  {card.src ? (
                    <img src={card.src} alt={card.alt} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-gray-900">{card.label}</p>
                  {card.buttonText && (
                    <p className="text-xs text-gray-500">{card.buttonText}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
