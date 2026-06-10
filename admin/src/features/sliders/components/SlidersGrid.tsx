'use client';

import { ArrowDown, ArrowUp, Edit, Eye, EyeOff, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { clientLogger } from '@/lib/logger';
import type { SliderImage } from '../types';

interface SlidersGridProps {
  sliders: SliderImage[];
  onToggle: (id: string, isActive: boolean) => void;
  onEdit: (slider: SliderImage) => void;
  onDelete: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  onAdd: () => void;
}

export function SlidersGrid({ sliders, onToggle, onEdit, onDelete, onReorder, onAdd }: SlidersGridProps) {
  if (sliders.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2 custom-font">
          No sliders found
        </h3>
        <p className="text-gray-600 mb-4 custom-font">
          Get started by creating your first slider
        </p>
        <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors custom-font"
        >
          Add New Slider
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sliders.map((slider, index) => (
        <div
          key={slider.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="relative h-48 bg-gray-100">
            {slider.imageUrl ? (
              <img
                src={
                  slider.imageUrl.startsWith('http')
                    ? slider.imageUrl
                    : `${process.env.NEXT_PUBLIC_API_BASE_URL}${slider.imageUrl}`
                }
                alt={`Slider ${slider.order}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  clientLogger.error('Image load error:', slider.imageUrl);
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget
                    .nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="flex items-center justify-center h-full"
              style={{ display: slider.imageUrl ? 'none' : 'flex' }}
            >
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
            <div className="absolute top-2 right-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  slider.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {slider.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="absolute top-2 left-2">
              <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium custom-font">
                #{slider.order}
              </span>
            </div>
          </div>

          <div className="p-4">
            {slider.internalLink && (
              <p className="text-blue-600 text-sm mb-3 truncate">
                Link: {slider.internalLink}
              </p>
            )}
          </div>

          <div className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => onReorder(slider.id, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onReorder(slider.id, 'down')}
                  disabled={index === sliders.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onToggle(slider.id, slider.isActive)}
                  className={`p-1 rounded ${
                    slider.isActive
                      ? 'text-green-600 hover:bg-green-100'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {slider.isActive ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => onEdit(slider)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(slider.id)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
