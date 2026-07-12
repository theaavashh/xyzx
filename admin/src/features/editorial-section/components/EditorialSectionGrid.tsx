'use client';

import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  ImageIcon,
  Layers,
  Package,
  Plus,
  ShoppingBag,
  Tag,
} from 'lucide-react';
import { FEATURE_LABELS } from '../types';
import type { EditorialSection } from '../types';

const featureIcon = (type: string) => {
  const icons: Record<string, React.ReactNode> = {
    isFeatured: <Tag className="w-3.5 h-3.5" />,
    isNew: <Package className="w-3.5 h-3.5" />,
    isOnSale: <ShoppingBag className="w-3.5 h-3.5" />,
    isBestSeller: <Layers className="w-3.5 h-3.5" />,
    isNewSeller: <Package className="w-3.5 h-3.5" />,
    isFestivalOffer: <Tag className="w-3.5 h-3.5" />,
  };
  return icons[type] || null;
};

interface EditorialSectionGridProps {
  sections: EditorialSection[];
  isLoading: boolean;
  onOpenModal: () => void;
  onEdit: (section: EditorialSection) => void;
  onToggleStatus: (section: EditorialSection) => void;
  onReorder: (sectionId: string, direction: 'up' | 'down') => void;
  onDeleteRequest: (section: EditorialSection) => void;
}

export function EditorialSectionGrid({
  sections,
  isLoading,
  onOpenModal,
  onEdit,
  onToggleStatus,
  onReorder,
  onDeleteRequest,
}: EditorialSectionGridProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]" />
        </div>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="text-center py-16 px-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No editorial sections</h3>
          <p className="text-gray-500 mb-6">Create your first seasonal showcase to feature products.</p>
          <button type="button" onClick={onOpenModal}
            className="inline-flex items-center gap-2 bg-[#D4AF37] text-white px-5 py-2.5 outer-sans text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all font-semibold">
            <Plus className="w-4 h-4" /> Add Section
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="divide-y divide-gray-100">
        {sections.map((section, index) => {
          const featureLabel = section.featureType ? FEATURE_LABELS[section.featureType] || section.featureType : null;
          const productCount = section.productIds?.length || 0;
          return (
            <div key={section.id} className="p-5 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wider uppercase ${
                      section.isActive ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {section.season}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      section.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {section.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {section.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{section.title}</h3>
                  {section.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-1">{section.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    {featureLabel && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                        {featureIcon(section.featureType!)}
                        {featureLabel}
                      </span>
                    )}
                    {section.ctaText && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                        CTA: {section.ctaText}
                      </span>
                    )}
                    {productCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md text-xs font-medium">
                        <ShoppingBag className="w-3 h-3" />
                        {productCount} product{productCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" onClick={() => onReorder(section.id, 'up')} disabled={index === 0}
                    className="p-1.5 text-gray-400 hover:text-gray-900 rounded disabled:opacity-20 disabled:cursor-not-allowed">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => onReorder(section.id, 'down')} disabled={index === sections.length - 1}
                    className="p-1.5 text-gray-400 hover:text-gray-900 rounded disabled:opacity-20 disabled:cursor-not-allowed">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-6 bg-gray-200 mx-1" />
                  <button type="button" onClick={() => onEdit(section)}
                    className="px-2.5 py-1 text-xs font-medium text-[#D4AF37] bg-[#D4AF37]/10 rounded-md hover:bg-[#D4AF37]/20 transition-colors">
                    Edit
                  </button>
                  <button type="button" onClick={() => onToggleStatus(section)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      section.isActive
                        ? 'text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20'
                        : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                    }`}>
                    {section.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button type="button" onClick={() => onDeleteRequest(section)}
                    className="px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
