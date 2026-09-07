import { XCircle } from 'lucide-react';
import type { Order } from '../types';

interface OrderDetailsModalProps {
  order: Order | null;
  show: boolean;
  onClose: () => void;
  formatCurrency: (amount: number, currency?: string, symbol?: string) => string;
  formatDate: (dateString: string) => string;
  getStatusColor: (status: string) => string;
  getPaymentStatusColor: (status: string) => string;
}

export default function OrderDetailsModal({
  order,
  show,
  onClose,
  formatCurrency,
  formatDate,
  getStatusColor,
  getPaymentStatusColor,
}: OrderDetailsModalProps) {
  if (!show || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Order Details - {order.orderNumber}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close order details">
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Order Information</h3>
                <div className="text-sm space-y-1 text-gray-600">
                  <div>Order Number: {order.orderNumber}</div>
                  <div>
                    Status:{' '}
                    <span className={getStatusColor(order.status)}>{order.status}</span>
                  </div>
                  <div>Created: {formatDate(order.createdAt)}</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Payment Information</h3>
                <div className="text-sm space-y-1 text-gray-600">
                  <div>
                    Payment Status:{' '}
                    <span className={getPaymentStatusColor(order.paymentStatus ?? 'PENDING')}>
                      {order.paymentStatus ?? 'PENDING'}
                    </span>
                  </div>
                  {order.paymentMethod && <div>Payment Method: {order.paymentMethod}</div>}
                  {order.paidAt && <div>Paid At: {formatDate(order.paidAt)}</div>}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
              <div className="text-sm space-y-1 text-gray-600">
                <div>{order.user?.name ?? order.shippingName}</div>
                <div>{order.user?.email ?? order.shippingEmail}</div>
                {order.shippingPhone && <div>{order.shippingPhone}</div>}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
              <div className="text-sm space-y-1 text-gray-600">
                <div>{order.shippingAddress}</div>
                <div>{order.shippingCity}{order.shippingState ? `, ${order.shippingState}` : ''} {order.shippingZip}</div>
                <div>{order.shippingCountry}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
              <div className="space-y-2">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>{item.product.name} x {item.quantity}</div>
                    <div>{formatCurrency(item.price * item.quantity, order.currency)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    {formatCurrency(order.subtotal, order.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">
                    {formatCurrency(order.shipping, order.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">
                    {formatCurrency(order.tax, order.currency)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>
                    {formatCurrency(order.total, order.currency)}
                  </span>
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                <p className="text-sm text-gray-600">{order.notes}</p>
              </div>
            )}

            {order.adminNotes && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Admin Notes</h3>
                <p className="text-sm text-gray-600">{order.adminNotes}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
