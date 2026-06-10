import { Eye } from 'lucide-react';
import type { Order } from '../types';

interface OrderTableProps {
  orders: Order[];
  formatCurrency: (amount: number, currency?: string, symbol?: string) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  getPaymentStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactElement;
  viewOrderDetails: (order: Order) => void;
}

export default function OrderTable({
  orders,
  formatCurrency,
  formatDate,
  getStatusColor,
  getPaymentStatusColor,
  getStatusIcon,
  viewOrderDetails,
}: OrderTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Order #</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Items</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Payment</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{order.orderNumber}</div>
                    <div className="text-sm text-gray-500">ID: {order.id.substring(0, 8)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {order.user.firstName} {order.user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{order.user.email}</div>
                      <div className="text-sm text-gray-500">{order.user.phone}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-600">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(order.totalAmount, order.currency, order.currencySymbol)}
                    </div>
                    {order.nprTotalAmount && order.currency !== 'NPR' && (
                      <div className="text-sm text-gray-500">
                        NPR {order.nprTotalAmount.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status.toLowerCase()}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}
                    >
                      {order.paymentStatus.toLowerCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <div className="text-sm">{formatDate(order.createdAt)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="text-blue-600 hover:text-blue-700"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
