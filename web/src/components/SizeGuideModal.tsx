'use client';

import { useState } from 'react';
import type { Product } from '@/data/products';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function SizeGuideModal({
  isOpen,
  onClose,
  product,
}: SizeGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/50 transition-opacity duration-300 cursor-default"
        onClick={onClose}
        aria-label="Close size guide"
      />

      {/* Modal Panel - Right Side */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-out">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-zinc-600">
                Size Guide
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-zinc-600 hover:text-zinc-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close size guide"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <title>Close</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Measurement Chart */}
              <div>
                <h3 className="text-lg font-semibold text-zinc-600 mb-4 general-sans">
                  Size Chart
                </h3>

                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                          Size
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                          Chest (in)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                          Length (in)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size, index) => (
                        <tr
                          key={size}
                          className={
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-zinc-600">
                            {size}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-zinc-600">
                            {32 +
                              ['XS', 'S', 'M', 'L', 'XL', 'XXL'].indexOf(size) *
                                2}
                            "
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-zinc-600">
                            {24 +
                              ['XS', 'S', 'M', 'L', 'XL', 'XXL'].indexOf(size) *
                                0.5}
                            "
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tips Section */}
              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  Fitting Tips
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Measure around the fullest part of your chest</li>
                  <li>• Keep the measuring tape level and snug</li>
                  <li>• For a relaxed fit, size up</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
