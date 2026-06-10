'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { ClientDetailsForm } from '@/features/client-details';

export default function ClientDetailsPage() {
  return (
    <DashboardLayout title="Client Details" showBackButton={true}>
      <ClientDetailsForm />
    </DashboardLayout>
  );
}
