'use client';

import { X } from 'lucide-react';
import type { ContactSubmission } from '../types';

interface ContactSubmissionDetailProps {
  submission: ContactSubmission;
  onClose: () => void;
}

export function ContactSubmissionDetail({ submission, onClose }: ContactSubmissionDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        className="relative w-full max-w-lg bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Submission Details</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Name</label>
              <p className="text-gray-900 font-medium">{submission.name}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date</label>
              <p className="text-gray-900">{new Date(submission.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email</label>
            <p className="text-gray-900">{submission.email}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Subject</label>
            <p className="text-gray-900 font-medium">{submission.subject}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Message</label>
            <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-200">{submission.message}</p>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <div className={`w-2 h-2 rounded-full ${submission.isRead ? 'bg-green-500' : 'bg-blue-500'}`} />
            <span className="text-sm text-gray-600">{submission.isRead ? 'Read' : 'Unread'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
