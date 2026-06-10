'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  ContactSubmissionList,
  ContactSubmissionDetail,
  useContactSubmissions,
  useDeleteSubmission,
  useMarkAsRead,
} from '@/features/contact';
import type { ContactSubmission } from '@/features/contact';

export default function ContactPage() {
  const { submissions, isLoading, refetch } = useContactSubmissions();
  const { remove } = useDeleteSubmission();
  const { markAsRead } = useMarkAsRead();

  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  const handleView = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
  };

  const handleMarkAsRead = async (id: string) => {
    const success = await markAsRead(id);
    if (success) refetch();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) return;
    const success = await remove(id);
    if (success) {
      if (selectedSubmission?.id === id) setSelectedSubmission(null);
      refetch();
    }
  };

  return (
    <DashboardLayout title="Contact Submissions">
      <ContactSubmissionList
        submissions={submissions}
        isLoading={isLoading}
        onView={handleView}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
        onRefresh={refetch}
      />

      {selectedSubmission && (
        <ContactSubmissionDetail
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
        />
      )}
    </DashboardLayout>
  );
}
