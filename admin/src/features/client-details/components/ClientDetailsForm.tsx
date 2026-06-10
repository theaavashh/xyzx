'use client';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Trash2,
  User,
  Users,
  UserCheck,
  UserX,
} from 'lucide-react';
import { useState } from 'react';
import { FilterDrawer } from '@/components/ui/FilterDrawer';
import {
  useClientsQuery,
  useToggleClientStatus,
} from '../hooks/useClientDetailsQueries';
import ClientDetailsDeleteAlert from './ClientDetailsDeleteAlert';
import type { Client } from '../types';

export default function ClientDetailsForm() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [previewClient, setPreviewClient] = useState<Client | null>(null);
  const [deleteAlert, setDeleteAlert] = useState({
    isOpen: false,
    clientId: '',
    clientName: '',
  });

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const { data, isLoading, error } = useClientsQuery({
    page: currentPage,
    limit: itemsPerPage,
    searchQuery,
    statusFilter,
    sortBy,
    sortOrder,
  });

  const toggleStatus = useToggleClientStatus();

  const clients = data?.clients ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  };

  const activeCount = clients.filter((c) => c.isActive).length;
  const inactiveCount = clients.filter((c) => !c.isActive).length;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (client: Client) => {
    setDeleteAlert({
      isOpen: true,
      clientId: client.id,
      clientName: client.name,
    });
  };

  const cancelDelete = () => {
    setDeleteAlert({ isOpen: false, clientId: '', clientName: '' });
  };

  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(
    pagination.page * pagination.limit,
    pagination.total,
  );

  const statCards = [
    {
      label: 'Total Clients',
      value: pagination.total,
      icon: Users,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Active',
      value: activeCount,
      icon: UserCheck,
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Inactive',
      value: inactiveCount,
      icon: UserX,
      bg: 'bg-gray-50',
      iconColor: 'text-gray-600',
    },
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black lastik">
            Client Details
          </h1>
          <p className="text-black text-lg mt-2">
            Manage your clients ({pagination.total} total)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFilterDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] transition-colors text-sm font-semibold"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#D4AF37] border-t-transparent mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading clients...</p>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <motion.div
          className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Clients
          </h3>
          <p className="text-red-600 mb-4">
            {error instanceof Error
              ? error.message
              : 'Failed to load clients'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {!isLoading && !error && (
        <motion.div
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Account Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {clients.map((client, index) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-9 w-9 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-amber-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-[#D4AF37]" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {client.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            ID: {client.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {client.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(client.createdAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          },
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(client.createdAt).toLocaleTimeString(
                          'en-US',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
                          client.isActive
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                            : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            client.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                          }`}
                        />
                        {client.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setPreviewClient(client)}
                          className="p-2 text-gray-400 hover:text-[#D4AF37] hover:bg-amber-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(client)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            toggleStatus.mutate({
                              id: client.id,
                              wasActive: client.isActive,
                            })
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            client.isActive
                              ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                              : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={
                            client.isActive ? 'Deactivate' : 'Activate'
                          }
                        >
                          {client.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {pagination.pages > 1 && (
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-sm text-gray-500">
            Showing {startIndex} to {endIndex} of {pagination.total} clients
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: pagination.pages }, (_, i) => i + 1)
              .filter((page) => {
                return (
                  page === 1 ||
                  page === pagination.pages ||
                  Math.abs(page - pagination.page) <= 2
                );
              })
              .map((page, idx, arr) => {
                const prevPage = arr[idx - 1] ?? page;
                const showEllipsis = idx > 0 && page - prevPage > 1;
                return (
                  <span key={`page-${page}`} className="flex items-center">
                    {showEllipsis && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                        pagination.page === page
                          ? 'bg-[#D4AF37] text-white shadow-sm'
                          : 'text-gray-500 bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  </span>
                );
              })}

            <button
              type="button"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="p-2 text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {!isLoading && !error && clients.length === 0 && (
        <motion.div
          className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-gray-300" />
          </div>
          <p className="text-gray-600 text-lg font-medium">No clients found</p>
          <p className="text-gray-400 text-sm mt-1">
            {searchQuery || statusFilter
              ? 'Try adjusting your search or filter criteria'
              : 'No client accounts yet'}
          </p>
        </motion.div>
      )}

      <ClientDetailsDeleteAlert
        isOpen={deleteAlert.isOpen}
        onClose={cancelDelete}
        clientId={deleteAlert.clientId}
        clientName={deleteAlert.clientName}
      />

      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        title="Filters"
      >
        <div className="space-y-6">
          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
            >
              <option value="createdAt">Created Date</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="updatedAt">Updated Date</option>
            </select>
          </div>

          <div>
            <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-2">
              Sort Order
            </label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </FilterDrawer>

      {previewClient && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setPreviewClient(null)}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Client Details
                </h2>
                <button
                  type="button"
                  onClick={() => setPreviewClient(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <EyeOff className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-amber-100 flex items-center justify-center">
                    <User className="h-10 w-10 text-[#D4AF37]" />
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {previewClient.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {previewClient.email}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                      previewClient.isActive
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                        : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        previewClient.isActive ? 'bg-emerald-500' : 'bg-gray-400'
                      }`}
                    />
                    {previewClient.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Client ID</span>
                    <span className="font-mono text-gray-900 text-xs">
                      {previewClient.id.slice(0, 8)}...
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Role</span>
                    <span className="text-gray-900 capitalize font-medium">
                      {previewClient.role}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Account Created</span>
                    <span className="text-gray-900">
                      {new Date(previewClient.createdAt).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Updated</span>
                    <span className="text-gray-900">
                      {new Date(previewClient.updatedAt).toLocaleDateString(
                        'en-US',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        },
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewClient(null)}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
