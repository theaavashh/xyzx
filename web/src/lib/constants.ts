export const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-600',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-purple-50 text-purple-600',
  delivered: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-600',
  approved: 'bg-green-50 text-green-600',
  refunded: 'bg-blue-50 text-blue-600',
  rejected: 'bg-red-50 text-red-600',
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};
