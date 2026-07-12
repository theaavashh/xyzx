'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Loader2, Trash2, X } from 'lucide-react';

interface DeleteAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  productName?: string;
  productImage?: string;
  isLoading?: boolean;
  title?: string;
  message?: string;
}

export default function DeleteAlert({
  isOpen,
  onClose,
  onConfirm,
  productName,
  productImage,
  isLoading = false,
  title = 'Delete',
  message,
}: DeleteAlertProps) {
  const handleConfirm = async () => {
    await onConfirm();
    if (!isLoading) {
      onClose();
    }
  };

  const defaultMessage = productName
    ? `Are you sure you want to delete "${productName}"? This action cannot be undone.`
    : 'Are you sure you want to delete this item? This action cannot be undone.';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="fixed inset-0 bg-gray-900/30"
            onClick={isLoading ? undefined : onClose}
          />

          <div className="relative min-h-screen flex items-center justify-center p-4">
            <motion.div
              className="relative bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-50 rounded-lg ring-1 ring-red-100">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 outer-sans">
                        {title}
                      </h2>
                      <p className="text-sm text-red-500 font-medium">
                        This action is permanent
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {productName && (
                  <div className="mb-4 p-3.5 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-3">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={productName}
                          className="w-10 h-10 rounded-lg object-cover ring-1 ring-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center">
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {productName}
                        </p>
                        <p className="text-xs text-gray-400">
                          Item to be deleted
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {message || defaultMessage}
                  </p>
                </div>

                <div className="mb-5 p-3.5 bg-amber-50 border border-amber-100 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-amber-800">
                        This action cannot be undone
                      </p>
                      <p className="text-xs text-amber-600 mt-0.5">
                        All associated data will be permanently removed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>

                  <motion.button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isLoading ? { scale: 1.01 } : {}}
                    whileTap={!isLoading ? { scale: 0.99 } : {}}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
