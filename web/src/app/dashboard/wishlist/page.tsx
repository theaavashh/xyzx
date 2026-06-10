'use client';

import { useCallback, useMemo, useState } from 'react';
import { Heart, ShoppingBag, X, Plus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist, useRemoveFromWishlist } from '@/lib/dashboard/hooks';
import { ErrorState } from '@/components/dashboard/ErrorState';

function WishlistSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-gray-100 rounded-xl h-32 animate-pulse" />
      ))}
    </div>
  );
}

export default function WishlistPage() {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const { data: wishlistData, isLoading, error, refetch } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  if (isLoading) {
    return <WishlistSkeleton />;
  }

  if (error) {
    return <ErrorState message="Unable to load your wishlist." onRetry={() => refetch()} />;
  }

  const items = useMemo(() => wishlistData?.data ?? [], [wishlistData?.data]);

  const toggleItem = useCallback((id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedItems((prev) => {
      if (prev.size === items.length) {
        return new Set();
      }
      return new Set(items.map((item) => item.id));
    });
  }, [items.length]);

  const deleteSelected = useCallback(async () => {
    await Promise.all(Array.from(selectedItems).map((id) => removeFromWishlist.mutateAsync(id)));
    setSelectedItems(new Set());
  }, [selectedItems, removeFromWishlist]);

  const removeItem = useCallback((id: string) => {
    removeFromWishlist.mutate(id);
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, [removeFromWishlist]);

  const isAllSelected = useMemo(
    () => items.length > 0 && selectedItems.size === items.length,
    [items.length, selectedItems.size],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`lastik text-4xl font-medium text-gray-900 uppercase`}>Wishlist</h1>
          <p className="text-base text-gray-400 mt-1">{items.length} items saved</p>
        </div>
        <Link href="/products" className="flex items-center gap-2 text-base font-medium text-gray-900 hover:text-[#D4AF37] transition-colors">
          <ShoppingBag className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>

      {selectedItems.size > 0 && (
        <div className="bg-white border border-gray-100 rounded-lg p-4 flex items-center justify-between">
          <p className="text-base text-gray-600">{selectedItems.size} item{selectedItems.size > 1 ? 's' : ''} selected</p>
          <button onClick={deleteSelected} className="flex items-center justify-center w-10 h-10 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors" aria-label="Delete selected items">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      )}

      {items.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="flex items-center gap-6 px-6 py-4 bg-gray-50/50 border-b border-gray-100">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" checked={isAllSelected} onChange={toggleAll} className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-offset-0 cursor-pointer" aria-label="Select all items" />
            </label>
            <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Select all</span>
          </div>

          <div className="divide-y divide-gray-50">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-6 p-6 hover:bg-gray-50/50 transition-colors group">
                <label className="flex items-center cursor-pointer flex-shrink-0">
                  <input type="checkbox" checked={selectedItems.has(item.id)} onChange={() => toggleItem(item.id)} className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-offset-0 cursor-pointer" aria-label={`Select ${item.name}`} />
                </label>

                <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                  {item.image && <Image src={item.image} alt={item.name || 'Product image'} fill className="object-cover" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-400 mb-1">{item.category}</p>
                  <h3 className="text-lg font-medium text-gray-900 truncate">{item.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-lg font-semibold text-gray-900">${item.price.toFixed(2)}</span>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <>
                        <span className="text-base text-gray-400 line-through">${item.originalPrice.toFixed(2)}</span>
                        <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs font-medium rounded">Sale</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-white rounded-lg text-base font-medium hover:bg-[#C4A030] transition-colors">
                    <Plus className="h-4 w-4" />
                    Add to Cart
                  </button>
                  <button onClick={() => removeItem(item.id)} className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors" aria-label={`Remove ${item.name} from wishlist`}>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-12">
          <div className="text-center max-w-sm mx-auto">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-gray-300" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-base text-gray-400 mb-6">Tap the heart icon on any product to save it here</p>
            <Link href="/products" className="inline-flex items-center gap-2 text-base font-medium text-gray-900 hover:text-[#D4AF37] transition-colors">
              Discover products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
