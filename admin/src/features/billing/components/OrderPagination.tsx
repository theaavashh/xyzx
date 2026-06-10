interface OrderPaginationProps {
  pagination: { page: number; limit: number; total: number; totalPages: number };
  setPagination: (pagination: { page: number; limit: number; total: number; totalPages: number }) => void;
}

export default function OrderPagination({ pagination, setPagination }: OrderPaginationProps) {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
          disabled={pagination.page === 1}
          className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
          disabled={pagination.page === pagination.totalPages}
          className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
