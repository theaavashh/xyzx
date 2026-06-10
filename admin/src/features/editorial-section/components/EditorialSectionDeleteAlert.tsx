'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { EditorialSection } from '../types';

interface EditorialSectionDeleteAlertProps {
  show: boolean;
  section: EditorialSection | null;
  onConfirm: (section: EditorialSection) => void;
  onCancel: () => void;
}

export function EditorialSectionDeleteAlert({
  show,
  section,
  onConfirm,
  onCancel,
}: EditorialSectionDeleteAlertProps) {
  return (
    <AnimatePresence>
      {show && section && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Section</h3>
            <p className="text-gray-500 text-center mb-6 text-sm">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => onConfirm(section)}
                className="flex-1 bg-red-600 text-white px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm">Delete</button>
              <button type="button" onClick={onCancel}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">Cancel</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
