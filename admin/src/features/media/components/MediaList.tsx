'use client';

import Image from 'next/image';
import {
  Edit,
  Eye,
  Image as ImageIcon,
  Link,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Video,
} from 'lucide-react';
import type { MediaItem } from '../types';

interface MediaListProps {
  items: MediaItem[];
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onEdit: (item: MediaItem) => void;
  onDelete: (item: MediaItem) => void;
}

function getMediaIcon(type: string) {
  return type === 'VIDEO' ? (
    <Video className="w-5 h-5" />
  ) : (
    <ImageIcon className="w-5 h-5" />
  );
}

export default function MediaList({ items, onToggleActive, onEdit, onDelete }: MediaListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-64 h-48 md:h-auto bg-gray-100 relative flex-shrink-0">
              {item.mediaType === 'IMAGE' ? (
                <Image
                  src={item.mediaUrl}
                  alt={item.linkTo.replace('-', ' ')}
                  fill
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <video
                  src={item.mediaUrl}
                  className="w-full h-full object-contain"
                  controls
                />
              )}
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded">
                {getMediaIcon(item.mediaType)}
              </div>
            </div>

            <div className="flex-1 p-4 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 capitalize custom-font mb-2">
                    {item.linkTo.replace('-', ' ')}
                  </h3>
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 custom-font">
                    <Link className="w-4 h-4" />
                    <span>{item.internalLink}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span
                      className={`px-2 py-1 rounded-full custom-font ${
                        item.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <button
                    onClick={() => onToggleActive(item.id, item.isActive)}
                    className={`p-1 rounded transition-colors ${
                      item.isActive
                        ? 'text-green-600 hover:text-green-700'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                    title={item.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {item.isActive ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        window.open(item.internalLink, '_blank')
                      }
                      className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-1 custom-font"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item)}
                      className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
