'use client';

import DeleteAlert from '@/components/DeleteAlert';
import { useDeleteClient } from '../hooks/useClientDetailsQueries';

interface ClientDetailsDeleteAlertProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
}

export default function ClientDetailsDeleteAlert({
  isOpen,
  onClose,
  clientId,
  clientName,
}: ClientDetailsDeleteAlertProps) {
  const deleteClient = useDeleteClient();

  const handleConfirm = async () => {
    await deleteClient.mutateAsync(clientId);
  };

  return (
    <DeleteAlert
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      productName={clientName}
      title="Delete Client"
      message={`Delete "${clientName}"? This client account and all associated data will be permanently removed.`}
      isLoading={deleteClient.isPending}
    />
  );
}
