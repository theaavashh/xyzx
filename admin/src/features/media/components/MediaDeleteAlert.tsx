'use client';

import { X, AlertTriangle } from 'lucide-react';
import type { MediaItem } from '../types';

interface MediaDeleteAlertProps {
  item: MediaItem;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function MediaDeleteAlert({ item, onConfirm, onCancel, loading }: MediaDeleteAlertProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold custom-font flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Delete Media Item
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 custom-font mb-4">
            Are you sure you want to delete this media item? This action cannot be undone.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-gray-900 custom-font">
              {item.linkTo.replace('-', ' ')}
            </p>
            <p className="text-sm text-gray-500 truncate custom-font">
              {item.internalLink}
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-black bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors custom-font"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 custom-font"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
