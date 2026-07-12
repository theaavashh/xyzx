'use client';

import { CheckCircle, Copy, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/Card';
import type { Coupon } from '../types';
import { getStatusInfo, formatCurrency } from '../types';

interface DiscountTableProps {
  coupons: Coupon[];
  onEdit: (coupon: Coupon) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DiscountTable({ coupons, onEdit, onToggleStatus, onDelete }: DiscountTableProps) {
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied!');
  };

  if (coupons.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-500">No coupons found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <Th>Coupon Code</Th>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Value</Th>
              <Th>Usage</Th>
              <Th>Valid Until</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => {
              const status = getStatusInfo(coupon);
              return (
                <tr key={coupon.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-black">
                        {coupon.code}
                      </code>
                      <button
                        onClick={() => copyCode(coupon.code)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{coupon.name}</div>
                    {coupon.description && (
                      <div className="text-sm text-gray-500">{coupon.description}</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        coupon.type === 'percentage'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {coupon.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">
                      {coupon.type === 'percentage'
                        ? `${coupon.value}%`
                        : formatCurrency(coupon.value)}
                    </div>
                    {coupon.minOrderAmount && coupon.minOrderAmount > 0 && (
                      <div className="text-sm text-gray-500">
                        Min: {formatCurrency(coupon.minOrderAmount)}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {coupon.usedCount} / {coupon.usageLimit || '∞'}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1 max-w-[120px]">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${coupon.usageLimit ? Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100) : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(coupon.endDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.text}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(coupon)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleStatus(coupon.id)}
                        className={
                          coupon.isActive
                            ? 'text-red-600 hover:text-red-700'
                            : 'text-green-600 hover:text-green-700'
                        }
                      >
                        {coupon.isActive ? <X className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => onDelete(coupon.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm outer-sans">{children}</th>
  );
}
