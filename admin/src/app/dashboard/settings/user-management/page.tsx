'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useToggleUserStatus,
} from '@/features/user-management';
import type { User, UserFormData } from '@/features/user-management';
import { UserTable, UserForm, UserDeleteAlert } from '@/features/user-management';

export default function UserManagementPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: 'asc' | 'desc';
  }>({
    key: 'createdAt',
    direction: 'desc',
  });

  const { data: users = [], isLoading: loading } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const toggleStatusMutation = useToggleUserStatus();

  const handleCreateUser = (data: UserFormData) => {
    createUserMutation.mutate(data);
  };

  const handleEditUser = (data: UserFormData) => {
    if (!editingUser) return;
    updateUserMutation.mutate({ id: editingUser.id, data });
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    deleteUserMutation.mutate(userToDelete.id);
  };

  const handleToggleStatus = (user: User) => {
    toggleStatusMutation.mutate(user.id);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const openDeleteConfirm = (user: User) => {
    setUserToDelete(user);
    setIsDeleteConfirmOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">
              User Management
            </h1>
            <p className="text-black text-lg mt-2">
              Manage admin panel users and their permissions
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-[#D4AF37] text-white px-4 py-2.5 text-lg rounded-md hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] flex items-center gap-2 transition-all font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add New User
          </button>
        </div>

        <UserTable
          users={users as User[]}
          loading={loading}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterRole={filterRole}
          onFilterRoleChange={setFilterRole}
          sortConfig={sortConfig}
          onSort={(key: keyof User) =>
            setSortConfig((prev) => ({
              key,
              direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
            }))
          }
          onEdit={openEditModal}
          onToggleStatus={handleToggleStatus}
          onDelete={openDeleteConfirm}
        />

        <UserForm
          isOpen={isCreateModalOpen}
          mode="create"
          user={null}
          onClose={closeCreateModal}
          onSubmit={handleCreateUser}
          isSubmitting={createUserMutation.isPending}
        />

        <UserForm
          isOpen={isEditModalOpen}
          mode="edit"
          user={editingUser}
          onClose={closeEditModal}
          onSubmit={handleEditUser}
          isSubmitting={updateUserMutation.isPending}
        />

        <UserDeleteAlert
          isOpen={isDeleteConfirmOpen}
          user={userToDelete}
          onClose={closeDeleteConfirm}
          onConfirm={handleDeleteUser}
        />
      </div>
    </DashboardLayout>
  );
}
