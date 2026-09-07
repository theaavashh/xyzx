'use client';

import type { SVGProps } from 'react';
import {
  Shield,
  Users,
  Settings,
  Package,
  ShoppingCart,
  FileText,
  Globe,
  BarChart3,
  FolderOpen,
  Image,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Permission {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  category: string;
  subPermissions?: { id: string; label: string }[];
}

const allPermissions: Permission[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'View dashboard overview and analytics',
    icon: BarChart3,
    category: 'Main',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'View detailed analytics and reports',
    icon: BarChart3,
    category: 'Main',
  },
  {
    id: 'categories',
    label: 'Categories',
    description: 'Manage product categories',
    icon: FolderOpen,
    category: 'Catalog',
  },
  {
    id: 'products',
    label: 'Products',
    description: 'Manage products and inventory',
    icon: Package,
    category: 'Catalog',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    description: 'Track and manage stock levels',
    icon: Package,
    category: 'Catalog',
  },
  {
    id: 'orders',
    label: 'Orders',
    description: 'View and manage customer orders',
    icon: ShoppingCart,
    category: 'Orders',
  },
  {
    id: 'invoices',
    label: 'Invoices',
    description: 'View and manage invoices',
    icon: FileText,
    category: 'Orders',
  },
  {
    id: 'billing',
    label: 'Billing',
    description: 'Handle billing and payments',
    icon: ShoppingCart,
    category: 'Orders',
  },
  {
    id: 'content',
    label: 'Content Management',
    description: 'Manage website content',
    icon: FileText,
    category: 'Content',
  },
  {
    id: 'media',
    label: 'Media',
    description: 'Upload and manage media files',
    icon: Image,
    category: 'Content',
  },
  {
    id: 'seo',
    label: 'SEO',
    description: 'Manage SEO settings',
    icon: Search,
    category: 'SEO',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'System configuration',
    icon: Settings,
    category: 'Settings',
  },
  {
    id: 'staff',
    label: 'Staff Management',
    description: 'Manage staff and permissions',
    icon: Users,
    category: 'Users',
  },
];

function PermissionsContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(allPermissions.map((p) => p.category))];

  const filteredPermissions = allPermissions.filter((permission) => {
    const matchesSearch =
      permission.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || permission.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout title="Permissions">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black">Permissions</h1>
            <p className="text-black text-lg mt-2">
              Manage access permissions for staff members
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black placeholder:text-black"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-black"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#D4AF37]/10 rounded-lg">
              <Shield className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-black">
                Available Permissions
              </h2>
              <p className="text-black text-sm">
                All permission types that can be assigned to staff
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPermissions.map((permission) => {
              const Icon = permission.icon;
              return (
                <div
                  key={permission.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {permission.label}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {permission.description}
                      </p>
                      <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 text-black rounded">
                        {permission.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPermissions.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No permissions found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-black mb-4">
            Permission Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-black">
            <div>
              <h3 className="font-semibold mb-2">Role Types:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Super Admin</strong> - Full access to all features
                </li>
                <li>
                  <strong>Staff</strong> - Limited access based on permissions
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Best Practices:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Assign only necessary permissions to staff</li>
                <li>Regularly review and update permissions</li>
                <li>Use Super Admin role sparingly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function PermissionsPage() {
  return (
    <ProtectedRoute>
      <PermissionsContent />
    </ProtectedRoute>
  );
}
