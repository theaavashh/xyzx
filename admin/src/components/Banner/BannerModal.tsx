import { AnimatePresence, motion } from 'framer-motion';
import { X, Package } from 'lucide-react';
import BannerForm from './BannerForm';
import type { Banner, BannerFormData } from '@/types/banner.types';
import { bricolage } from '@/app/fonts';

interface BannerModalProps {
  isOpen: boolean;
  banner?: Banner | null;
  onSubmit: (data: BannerFormData) => void;
  onClose: () => void;
  isSubmitting?: boolean;
}

export default function BannerModal({
  isOpen,
  banner,
  onSubmit,
  onClose,
  isSubmitting = false,
}: BannerModalProps) {
  const isEditMode = !!banner;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center p-4"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-t-lg sm:rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
          >
            {/* Fixed Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-2xl font-semibold text-black outer-sans ">
                {isEditMode ? 'Edit Banner' : 'Create New Banner'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              <BannerForm
                banner={banner}
                onSubmit={onSubmit}
                onCancel={onClose}
                isSubmitting={isSubmitting}
                showActions={false}
              />
            </div>

            {/* Fixed Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => (window as Window & { __bannerFormSubmit?: () => void }).__bannerFormSubmit?.()}
                disabled={isSubmitting}
                className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Package className="w-4 h-4" />
                    {isEditMode ? 'Update Banner' : 'Create Banner'}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
