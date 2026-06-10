'use client';

import DeleteAlert from '@/components/DeleteAlert';
import { useDeleteProduct } from '../hooks/useProductsQueries';

interface ProductDeleteAlertProps {
  isOpen: boolean;
  productId: string;
  productName: string;
  productImage: string;
  onClose: () => void;
  onDeleted: () => void;
}

export default function ProductDeleteAlert({
  isOpen,
  productId,
  productName,
  productImage,
  onClose,
  onDeleted,
}: ProductDeleteAlertProps) {
  const deleteMutation = useDeleteProduct();

  const handleConfirm = async () => {
    if (!productId) return;
    await deleteMutation.mutateAsync(productId);
    onClose();
    onDeleted();
  };

  return (
    <DeleteAlert
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      productName={productName}
      productImage={productImage}
      isLoading={deleteMutation.isPending}
      title="Delete Product"
      message={`Are you sure you want to delete "${productName}"? This action cannot be undone.`}
    />
  );
}
