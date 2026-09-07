'use client';


import { clientLogger } from '@/lib/logger';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Edit,
  Eye,
  EyeOff,
  Plus,
  Save,
  Search,
  Trash2,
  User,
  Users,
  X,
  Shield,
  Check,
  RefreshCw,
  CheckSquare,
  Square,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm, type UseFormRegister, type FieldErrors } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiRequest } from '@/utils/api';
import { getErrorMessage } from '@/types';

const staffSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type StaffFormData = z.infer<typeof staffSchema>;

export interface StaffMember {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

const availablePermissions = [
  { id: 'dashboard', label: 'Dashboard', category: 'Main' },
  { id: 'analytics', label: 'Analytics', category: 'Main' },
  { id: 'categories', label: 'Categories', category: 'Catalog' },
  { id: 'products', label: 'Products', category: 'Catalog' },
  { id: 'inventory', label: 'Inventory', category: 'Catalog' },
  { id: 'orders', label: 'Orders', category: 'Orders' },
  { id: 'invoices', label: 'Invoices', category: 'Orders' },
  { id: 'billing', label: 'Billing', category: 'Orders' },
  { id: 'shipped-delivered', label: 'Shipped/Delivered', category: 'Orders' },
  { id: 'returns', label: 'Returns', category: 'Orders' },
  { id: 'refunds', label: 'Refunds', category: 'Orders' },
  { id: 'cancellations', label: 'Cancellations', category: 'Orders' },
  { id: 'content', label: 'Content Management', category: 'Content' },
  { id: 'media', label: 'Media', category: 'Content' },
  { id: 'seo', label: 'SEO', category: 'SEO' },
  { id: 'settings', label: 'Settings', category: 'Settings' },
  { id: 'staff', label: 'Staff Management', category: 'Users' },
];

const permissionCategories = [
  ...new Set(availablePermissions.map((p) => p.category)),
];

const generatePassword = (): string => {
  const length = 12;
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  const allChars = lowercase + uppercase + numbers + special;

  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

function StaffManagementContent() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof StaffMember;
    direction: 'asc' | 'desc';
  }>({ key: 'createdAt', direction: 'desc' });

  const [createPermissions, setCreatePermissions] = useState<string[]>([]);
  const [editPermissions, setEditPermissions] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
  });

  const password = watch('password');

  const fetchStaff = useCallback(async () => {
    try {
      const response = await apiRequest<{
        success: boolean;
        data: StaffMember[];
      }>('/api/v1/staff');
      if (response.success && response.data) {
        setStaff(response.data);
      }
    } catch (error) {
      clientLogger.error('Error fetching staff:',error);
      toast.error('Failed to fetch staff members');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleCreateStaff = async (data: StaffFormData) => {
    try {
      const response = await apiRequest<{ success: boolean }>('/api/v1/staff', 'POST', {
        email: data.email,
        name: data.name,
        password: data.password,
        permissions: createPermissions,
      });

      if (response.success) {
        toast.success('Staff member created successfully');
        setIsCreateModalOpen(false);
        setCreatePermissions([]);
        reset();
        fetchStaff();
      }
    } catch (error: unknown) {
      clientLogger.error('Error creating staff:',error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleEditStaff = async (data: StaffFormData) => {
    if (!editingStaff) return;

    try {
      const response = await apiRequest<{ success: boolean }>(
        `/api/v1/staff/${editingStaff.id}`,
        'PUT',
        {
          email: data.email,
          name: data.name,
          password: data.password || undefined,
          permissions: editPermissions,
        },
      );

      if (response.success) {
        toast.success('Staff member updated successfully');
        setIsEditModalOpen(false);
        setEditingStaff(null);
        setEditPermissions([]);
        reset();
        fetchStaff();
      }
    } catch (error: unknown) {
      clientLogger.error('Error updating staff:',error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;

    try {
      const response = await apiRequest<{ success: boolean }>(
        `/api/v1/staff/${staffToDelete.id}`,
        'DELETE',
      );

      if (response.success) {
        toast.success('Staff member deleted successfully');
        setIsDeleteConfirmOpen(false);
        setStaffToDelete(null);
        fetchStaff();
      }
    } catch (error: unknown) {
      clientLogger.error('Error deleting staff:',error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleToggleStatus = async (staffMember: StaffMember) => {
    try {
      const response = await apiRequest<{ success: boolean }>(
        `/api/v1/staff/${staffMember.id}/toggle`,
        'PATCH',
      );

      if (response.success) {
        toast.success(
          `Staff member ${staffMember.isActive ? 'deactivated' : 'activated'} successfully`,
        );
        fetchStaff();
      }
    } catch (error: unknown) {
      clientLogger.error('Error toggling status:',error);
      toast.error(getErrorMessage(error));
    }
  };

  const handleUpdatePermissions = async (permissions: string[]) => {
    if (!selectedStaff) return;

    try {
      const response = await apiRequest<{ success: boolean }>(
        `/api/v1/staff/${selectedStaff.id}/permissions`,
        'PUT',
        { permissions },
      );

      if (response.success) {
        toast.success('Permissions updated successfully');
        setIsPermissionsModalOpen(false);
        setSelectedStaff(null);
        fetchStaff();
      }
    } catch (error: unknown) {
      clientLogger.error('Error updating permissions:',error);
      toast.error(getErrorMessage(error));
    }
  };

  const openCreateModal = () => {
    reset({
      email: '',
      name: '',
      password: '',
    });
    setCreatePermissions([]);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (staffMember: StaffMember) => {
    reset({
      email: staffMember.email,
      name: staffMember.name,
      password: '',
    });
    setEditPermissions(staffMember.permissions || []);
    setEditingStaff(staffMember);
    setIsEditModalOpen(true);
  };

  const openPermissionsModal = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setIsPermissionsModalOpen(true);
  };

  const openDeleteConfirm = (staffMember: StaffMember) => {
    setStaffToDelete(staffMember);
    setIsDeleteConfirmOpen(true);
  };

  const filteredStaff = staff
    .filter((member) => {
      const email = member.email ?? '';
      const name = member.name ?? '';
      const matchesSearch =
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

  const handleSort = (key: keyof StaffMember) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleGeneratePassword = (isEdit: boolean) => {
    const newPassword = generatePassword();
    setValue('password', newPassword);
  };

  if (loading) {
    return (
      <DashboardLayout title="Staff Management">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#D4AF37]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Staff Management">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">
              Staff Management
            </h1>
            <p className="text-black text-lg mt-2">
              Manage staff members and their permissions
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="bg-[#D4AF37] text-white px-4 py-2.5 text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Staff
          </button>
        </div>

        <div className="bg-white rounded-md border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search staff by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center gap-1">
                      Email{' '}
                      {sortConfig.key === 'email' &&
                        (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Name{' '}
                      {sortConfig.key === 'name' &&
                        (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Permissions
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    onClick={() => handleSort('isActive')}
                  >
                    <div className="flex items-center gap-1">
                      Status{' '}
                      {sortConfig.key === 'isActive' &&
                        (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="w-10 h-10 text-gray-400 mb-3" />
                          <h3 className="text-lg font-semibold text-black">
                            No staff members found
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                          Get started by adding a new staff member
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((member) => (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {member.name}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => openPermissionsModal(member)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          {(member.permissions?.length ?? 0)} permissions
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-md ${member.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(member)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(member)}
                            className={`p-1.5 rounded ${member.isActive ? 'text-gray-500 hover:text-orange-600 hover:bg-orange-50' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'}`}
                            title={member.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {member.isActive ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => openDeleteConfirm(member)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <AnimatePresence>
          {isDeleteConfirmOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-lg shadow-xl max-w-sm w-full"
              >
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">
                    Delete Staff Member
                  </h3>
                </div>
                <div className="px-4 py-3">
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete{' '}
                    <span className="font-medium">{staffToDelete?.name}</span>?
                    This action cannot be undone.
                  </p>
                </div>
                <div className="px-4 py-3 bg-gray-50 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDeleteConfirmOpen(false)}
            className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteStaff}
            className="px-4 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCreateModalOpen && (
            <StaffModal
              title="Create Staff Member"
              isOpen={isCreateModalOpen}
              onClose={() => {
                setIsCreateModalOpen(false);
                setCreatePermissions([]);
              }}
              onSubmit={handleSubmit(handleCreateStaff)}
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              permissions={createPermissions}
              setPermissions={setCreatePermissions}
              password={password}
              onGeneratePassword={() => handleGeneratePassword(false)}
              isEdit={false}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isEditModalOpen && editingStaff && (
            <StaffModal
              title="Edit Staff Member"
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setEditingStaff(null);
                setEditPermissions([]);
              }}
              onSubmit={handleSubmit(handleEditStaff)}
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              permissions={editPermissions}
              setPermissions={setEditPermissions}
              password={password}
              onGeneratePassword={() => handleGeneratePassword(true)}
              isEdit={true}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isPermissionsModalOpen && selectedStaff && (
            <PermissionsModal
              staff={selectedStaff}
              availablePermissions={availablePermissions}
              onClose={() => {
                setIsPermissionsModalOpen(false);
                setSelectedStaff(null);
              }}
              onSave={handleUpdatePermissions}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

interface StaffModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  register: UseFormRegister<StaffFormData>;
  errors: FieldErrors<StaffFormData>;
  isSubmitting: boolean;
  permissions: string[];
  setPermissions: React.Dispatch<React.SetStateAction<string[]>>;
  password: string;
  onGeneratePassword: () => void;
  isEdit: boolean;
}

function StaffModal({
  title,
  isOpen,
  onClose,
  onSubmit,
  register,
  errors,
  isSubmitting,
  permissions,
  setPermissions,
  password,
  onGeneratePassword,
  isEdit,
}: StaffModalProps) {
  const [showPermissionsPanel, setShowPermissionsPanel] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    setSelectAll(permissions.length === availablePermissions.length);
  }, [permissions]);

  const toggleSelectAll = () => {
    if (selectAll) {
      setPermissions([]);
    } else {
      setPermissions(availablePermissions.map((p) => p.id));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <AnimatePresence>
        {showPermissionsPanel && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-[448px] top-0 h-[100vh] w-80 bg-white shadow-xl flex flex-col z-30"
          >
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900">
                  Select Permissions
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPermissionsPanel(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-4 py-3 overflow-y-auto flex-1 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-medium text-gray-700">
                  Category
                </span>
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  {selectAll ? 'Clear All' : 'Select All'}
                </button>
              </div>
              {permissionCategories.map((category) => {
                const categoryPermissions = availablePermissions.filter(
                  (p) => p.category === category,
                );
                const selectedCount = categoryPermissions.filter((p) =>
                  permissions.includes(p.id),
                ).length;
                const allSelected =
                  selectedCount === categoryPermissions.length;

                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">
                        {category}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (allSelected) {
                            setPermissions((prev) =>
                              prev.filter(
                                (p) =>
                                  !categoryPermissions
                                    .map((c) => c.id)
                                    .includes(p),
                              ),
                            );
                          } else {
                            setPermissions((prev) => [
                              ...new Set([
                                ...prev,
                                ...categoryPermissions.map((c) => c.id),
                              ]),
                            ]);
                          }
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        {allSelected ? 'Clear' : 'Select All'}
                      </button>
                    </div>
                    <div className="space-y-1">
                      {categoryPermissions.map((permission) => (
                        <label
                          key={permission.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={permissions.includes(permission.id)}
                            onChange={() => {
                              if (permissions.includes(permission.id)) {
                                setPermissions((prev) =>
                                  prev.filter((p) => p !== permission.id),
                                );
                              } else {
                                setPermissions((prev) => [
                                  ...prev,
                                  permission.id,
                                ]);
                              }
                            }}
                            className="w-3.5 h-3.5 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
                          />
                          <span className="text-xs text-gray-700">
                            {permission.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowPermissionsPanel(false)}
                className="w-full px-3 py-1.5 text-sm bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e]"
              >
                Done ({permissions.length} selected)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 h-[100vh] w-full max-w-md bg-white shadow-xl flex flex-col z-50"
      >
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              <h3 className="text-xl font-semibold text-black">{title}</h3>
            </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="px-4 py-3 space-y-3 overflow-y-auto flex-1">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                {...register('name')}
                id="name"
                type="text"
                className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.name.message as string}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.email.message as string}
                </p>
              )}
            </div>

            {!isEdit && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      {...register('password')}
                      id="password"
                      type="text"
                      className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter password"
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.password.message as string}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={onGeneratePassword}
                    className="px-3 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 flex items-center gap-1.5 text-xs whitespace-nowrap"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Generate
                  </button>
                </div>
              </div>
            )}

            {isEdit && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  New Password{' '}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      {...register('password')}
                      id="password"
                      type="text"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              placeholder="Enter new password"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={onGeneratePassword}
                    className="px-3 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 flex items-center gap-1.5 text-xs whitespace-nowrap"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Generate
                  </button>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-medium text-gray-900">
                    Access Permissions
                  </h4>
                  <span className="text-xs text-gray-500">
                    ({permissions.length})
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="w-full border border-gray-200 rounded-md p-3 cursor-pointer hover:bg-gray-50 transition-colors text-left"
                onClick={() => setShowPermissionsPanel(true)}
              >
                <div className="flex items-center gap-2">
                  {permissions.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-xs text-gray-700">
                    {permissions.length > 0
                      ? `${permissions.length} permissions selected`
                      : 'Click to select permissions'}
                  </span>
                </div>
                {permissions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {permissionCategories.map((category) => {
                      const categoryPermissions = availablePermissions.filter(
                        (p) => p.category === category,
                      );
                      const selectedInCategory = categoryPermissions.filter(
                        (p) => permissions.includes(p.id),
                      );
                      if (selectedInCategory.length === 0) return null;
                      return (
                        <span
                          key={category}
                          className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded"
                        >
                          {category}: {selectedInCategory.length}
                        </span>
                      );
                    })}
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 flex justify-end gap-2 border-t border-gray-200 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3 h-3" />
                  {isEdit ? 'Update' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

interface PermissionsModalProps {
  staff: StaffMember;
  availablePermissions: { id: string; label: string; category: string }[];
  onClose: () => void;
  onSave: (permissions: string[]) => void;
}

function PermissionsModal({
  staff,
  availablePermissions,
  onClose,
  onSave,
}: PermissionsModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    staff.permissions || [],
  );
  const [saving, setSaving] = useState(false);

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId],
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(selectedPermissions);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-70 flex">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 h-[100vh] w-full max-w-md bg-white shadow-xl flex flex-col z-50"
      >
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">
                Permissions
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{staff.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-3 overflow-y-auto flex-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500">
              {selectedPermissions.length} selected
            </span>
            <button
              type="button"
              onClick={() =>
                setSelectedPermissions(availablePermissions.map((p) => p.id))
              }
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Select All
            </button>
          </div>

          <div className="space-y-4">
            {permissionCategories.map((category) => {
              const categoryPermissions = availablePermissions.filter(
                (p) => p.category === category,
              );
              const selectedCount = categoryPermissions.filter((p) =>
                selectedPermissions.includes(p.id),
              ).length;
              const allSelected = selectedCount === categoryPermissions.length;

              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs font-medium text-gray-700">
                      {category}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedPermissions((prev) => {
                          const categoryIds = categoryPermissions.map(
                            (p) => p.id,
                          );
                          return allSelected
                            ? prev.filter((p) => !categoryIds.includes(p))
                            : [...new Set([...prev, ...categoryIds])];
                        })
                      }
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      {allSelected ? 'Clear' : 'Select All'}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {categoryPermissions.map((permission) => (
                      <button
                        key={permission.id}
                        type="button"
                        onClick={() => togglePermission(permission.id)}
                        className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                          selectedPermissions.includes(permission.id)
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {permission.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 flex justify-end gap-2 border-t border-gray-200 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-black bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2.5 bg-[#D4AF37] text-white rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-1.5 disabled:opacity-50"
            >
            {saving ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Check className="w-3 h-3" />
                Save
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function StaffManagementPage() {
  return (
    <ProtectedRoute>
      <StaffManagementContent />
    </ProtectedRoute>
  );
}
