'use client';

import { Mail, MailOpen, Eye, RefreshCw, Trash2 } from 'lucide-react';
import type { ContactSubmission } from '../types';

interface ContactSubmissionListProps {
  submissions: ContactSubmission[];
  isLoading: boolean;
  onView: (submission: ContactSubmission) => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export function ContactSubmissionList({
  submissions,
  isLoading,
  onView,
  onMarkAsRead,
  onDelete,
  onRefresh,
}: ContactSubmissionListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white rounded-lg border border-gray-200">
        <Mail className="w-12 h-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Submissions Yet</h2>
        <p className="text-gray-500">Contact form submissions will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Showing {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={onRefresh}
          className="flex items-center px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-1.5" /> Refresh
        </button>
      </div>

      {submissions.map((submission) => (
        <div
          key={submission.id}
          className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow ${!submission.isRead ? 'border-l-4 border-l-blue-500' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 min-w-0">
              <div className={`p-2 rounded-full ${submission.isRead ? 'bg-gray-100' : 'bg-blue-100'} flex-shrink-0`}>
                {submission.isRead ? <MailOpen className="w-4 h-4 text-gray-500" /> : <Mail className="w-4 h-4 text-blue-600" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 truncate">{submission.name}</span>
                  {!submission.isRead && (
                    <span className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">New</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">{submission.subject}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {submission.email} &middot; {new Date(submission.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0 ml-4">
              <button onClick={() => onView(submission)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View details">
                <Eye className="w-4 h-4" />
              </button>
              {!submission.isRead && (
                <button onClick={() => onMarkAsRead(submission.id)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Mark as read">
                  <MailOpen className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => onDelete(submission.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete submission">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
