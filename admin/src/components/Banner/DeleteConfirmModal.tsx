import { AnimatePresence, motion } from 'framer-motion';
import { X, XCircle } from 'lucide-react';
import type { Banner } from '@/types/banner.types';
import { sanitizeHtml } from '@/utils/sanitize';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  banner: Banner | null;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  banner,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-black">
                  Delete Banner
                </h2>
                <button
                  onClick={onCancel}
                  className="text-gray-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-black opacity-75 mb-4">
                  Are you sure you want to delete this banner? This action cannot
                  be undone.
                </p>
                {banner && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div
                      className="text-sm text-black"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(banner.title),
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onCancel}
                  disabled={isDeleting}
                  className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {isDeleting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Delete Banner
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
