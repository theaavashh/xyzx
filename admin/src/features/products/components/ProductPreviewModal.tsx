'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Package, Sparkles, X } from 'lucide-react';
import type { Product, Variant } from '@/types';
import { getImageUrl } from '../hooks/useProductsQueries';
import { sanitizeHtml } from '@/utils/sanitize';

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
        active
          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
          : 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-300'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

function StockBadge({ quantity }: { quantity: number }) {
  const color =
    quantity > 10
      ? 'text-emerald-700 bg-emerald-50 ring-emerald-600/20'
      : quantity > 0
        ? 'text-amber-700 bg-amber-50 ring-amber-600/20'
        : 'text-red-700 bg-red-50 ring-red-600/20';

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${color}`}>
      <Package className="w-3 h-3" />
      {quantity}
    </span>
  );
}

interface ProductPreviewModalProps {
  product: Product | null;
  onClose: () => void;
  onEdit: (product: Product) => void;
}

export default function ProductPreviewModal({ product, onClose, onEdit }: ProductPreviewModalProps) {
  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h2>
                {product.isFeatured && <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge active={product.isActive} />
                <button
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                <div className="lg:col-span-2 p-6 bg-gray-50">
                  <div className="aspect-square rounded-xl overflow-hidden bg-white">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={getImageUrl(product.images[0])}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                        <Package className="w-16 h-16 mb-2" />
                        <span className="text-sm">No image</span>
                      </div>
                    )}
                  </div>
                  {product.images && product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {product.images.slice(0, 4).map((image, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden bg-white ring-1 ring-gray-200">
                          <img src={getImageUrl(image)} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Price</span>
                      <div className="text-right">
                        <span className="text-xl font-semibold text-gray-900">${product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-400 line-through ml-2">${product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Stock</span>
                      <StockBadge quantity={product.quantity} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">SKU</span>
                      <span className="text-sm font-mono text-gray-900">{product.sku || '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3 p-6 space-y-5">
                  {product.shortDescription && (
                    <p className="text-sm text-gray-600 leading-relaxed">{product.shortDescription}</p>
                  )}

                  {product.description && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</h4>
                      <div
                        className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category</span>
                      <span className="text-gray-900 font-medium">{product.category?.name || '—'}</span>
                    </div>
                    {product.gender && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gender</span>
                        <span className="text-gray-900 font-medium">{product.gender}</span>
                      </div>
                    )}
                    {product.season && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Season</span>
                        <span className="text-gray-900 font-medium">{product.season}</span>
                      </div>
                    )}
                    {product.material && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Material</span>
                        <span className="text-gray-900 font-medium">{product.material}</span>
                      </div>
                    )}
                    {product.fitType && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fit</span>
                        <span className="text-gray-900 font-medium">{product.fitType}</span>
                      </div>
                    )}
                    {product.occasion && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Occasion</span>
                        <span className="text-gray-900 font-medium">{product.occasion}</span>
                      </div>
                    )}
                    {product.pattern && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pattern</span>
                        <span className="text-gray-900 font-medium">{product.pattern}</span>
                      </div>
                    )}
                    {product.sleeveStyle && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sleeve</span>
                        <span className="text-gray-900 font-medium">{product.sleeveStyle}</span>
                      </div>
                    )}
                    {product.neckStyle && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Neck</span>
                        <span className="text-gray-900 font-medium">{product.neckStyle}</span>
                      </div>
                    )}
                    {product.washCare && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Wash Care</span>
                        <span className="text-gray-900 font-medium">{product.washCare}</span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Weight</span>
                        <span className="text-gray-900 font-medium">{product.weight} {product.weightUnit || 'kg'}</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Dimensions</span>
                        <span className="text-gray-900 font-medium">
                          {product.dimensions.length}×{product.dimensions.width}×{product.dimensions.height}{product.dimensions.unit || 'cm'}
                        </span>
                      </div>
                    )}
                    {product.barcode && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Barcode</span>
                        <span className="text-gray-900 font-mono text-xs">{product.barcode}</span>
                      </div>
                    )}
                    {product.upc && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">UPC</span>
                        <span className="text-gray-900 font-mono text-xs">{product.upc}</span>
                      </div>
                    )}
                    {product.ean && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">EAN</span>
                        <span className="text-gray-900 font-mono text-xs">{product.ean}</span>
                      </div>
                    )}
                  </div>

                  {product.variants && product.variants.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Variants ({product.variants.length})</h4>
                      <div className="overflow-x-auto rounded-lg ring-1 ring-gray-200">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Variant</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">SKU</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {product.variants.map((variant: Variant, idx: number) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-3 py-2 font-medium text-gray-900 text-xs">{variant.name || `Variant ${idx + 1}`}</td>
                                <td className="px-3 py-2 text-gray-500 font-mono text-xs">{variant.sku || '—'}</td>
                                <td className="px-3 py-2 font-semibold text-gray-900 text-xs">${typeof variant.price === 'number' ? variant.price : (variant.price?.usd ?? '—')}</td>
                                <td className="px-3 py-2"><StockBadge quantity={variant.stock ?? 0} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {product.tags.map((tag, i) => (
                        <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}

                  {product.materialCare && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Care</h4>
                      <div
                        className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.materialCare) }}
                      />
                    </div>
                  )}

                  {product.disclaimer && (
                    <div className="bg-amber-50 rounded-xl p-4">
                      <div
                        className="text-sm text-amber-800 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.disclaimer) }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-white shrink-0">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Created {new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>Updated {new Date(product.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Close
                </button>
                <button
                  onClick={() => { onClose(); onEdit(product); }}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#D4AF37] rounded-lg hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
