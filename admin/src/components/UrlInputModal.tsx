'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Globe, X } from 'lucide-react';
import { useState } from 'react';

interface UrlInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
}

export function UrlInputModal({ isOpen, onClose, onSubmit }: UrlInputModalProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('URL is required');
      return;
    }

    // Basic URL validation
    try {
      new URL(trimmedUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    onSubmit(trimmedUrl);
    setUrl('');
  };

  const handleClose = () => {
    setUrl('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#D4AF37]/10 rounded-lg">
                  <Globe className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-semibold text-black">
                  Insert Link
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="url-input"
                    className="block text-md font-medium text-black mb-2"
                  >
                    Link URL
                  </label>
                  <input
                    id="url-input"
                    type="text"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter redirect url"
                    className={`w-full px-4 py-2.5 border rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent ${
                      error
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    autoFocus
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                       {error}
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                  <p className="text-sm text-black opacity-75">
                    💡 Tip: Select text in the editor first, then click Insert Link to create a link.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 text-sm font-medium text-black bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-[#D4AF37] rounded-md hover:bg-[#b8962e] transition-colors"
                >
                  Insert Link
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
