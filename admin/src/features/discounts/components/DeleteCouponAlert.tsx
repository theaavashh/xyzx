'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteCouponAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  couponCode?: string;
  isPending?: boolean;
}

export function DeleteCouponAlert({ isOpen, onClose, onConfirm, couponCode, isPending }: DeleteCouponAlertProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fixed inset-0 bg-black/50" onMouseDown={(e) => { if (e.target === e.currentTarget && !isPending) onClose(); }} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Delete Coupon</h2>
                    <p className="text-sm text-red-600">This action is permanent</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  disabled={isPending}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Trash2 className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Coupon: {couponCode}</p>
                      <p className="text-sm text-gray-500">To be permanently deleted</p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">
                  Are you sure you want to delete this coupon? This action cannot be undone.
                </p>

                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Important</p>
                      <ul className="mt-2 text-sm text-amber-700 space-y-1">
                        <li>• Coupon will be permanently deleted</li>
                        <li>• This action cannot be undone</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={isPending}
                    className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={onConfirm}
                    disabled={isPending}
                    className="flex-1 flex items-center justify-center px-4 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                    whileHover={!isPending ? { scale: 1.02 } : {}}
                    whileTap={!isPending ? { scale: 0.98 } : {}}
                  >
                    {isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Coupon
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
