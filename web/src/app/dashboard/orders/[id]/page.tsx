'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Package,
  Copy,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BadgeCheck,
  Undo2,
  RefreshCw,
  MapPin,
  CreditCard,
  Truck,
} from 'lucide-react';
import { useOrderById, useUpdateOrderStatus } from '@/lib/dashboard/hooks';
import { useAuth } from '@/contexts/AuthContextTanStack';
import { ErrorState } from '@/components/dashboard/ErrorState';
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '@/lib/dashboard/types';
import type { Order, OrderItem, OrderStatus } from '@/lib/dashboard/types';

const STATUS_CONFIG = {
  pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Pending' },
  confirmed: { icon: BadgeCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Confirmed' },
  processing: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Processing' },
  shipped: { icon: Package, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Shipped' },
  delivered: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', label: 'Delivered' },
  cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Cancelled' },
  refunded: { icon: Undo2, color: 'text-rose-600', bg: 'bg-rose-50', label: 'Refunded' },
  returned: { icon: RotateCcw, color: 'text-zinc-600', bg: 'bg-gray-50', label: 'Returned' },
};

function OrderDetailSkeleton() {
  return (
    <div className="space-y-6 mt-5">
      <div className="h-10 w-56 bg-gray-200 rounded animate-pulse" />
      <div className="h-28 bg-gray-100 rounded-xl animate-pulse" />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-80 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

function Thumb({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="80px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Package className="h-7 w-7 text-zinc-600/40" />
        </div>
      )}
    </div>
  );
}

function AddressCard({ title, order }: { title: string; order: Order }) {
  const address = title === 'Shipping Address' ? order.shippingAddress : order.billingAddress;
  const isBlank = !address.street && !address.city;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-4 w-4 text-[#D4AF37]" />
        <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">{title}</h3>
      </div>
      {isBlank ? (
        <p className="text-sm text-zinc-600">Not provided</p>
      ) : (
        <div className="text-sm text-zinc-600 leading-relaxed">
          <p className="font-semibold text-zinc-600">{address.name || '—'}</p>
          {address.phone && <p className="mt-0.5">{address.phone}</p>}
          <p className="mt-2">{address.street}</p>
          <p>
            {[address.city, address.state, address.zip].filter(Boolean).join(', ')}
          </p>
          {address.country && <p>{address.country}</p>}
          {order.email && <p className="mt-2 break-all">{order.email}</p>}
        </div>
      )}
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = params?.id ?? '';
  const { data: order, isLoading, error, refetch } = useOrderById(orderId);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const updateStatus = useUpdateOrderStatus();
  const [draft, setDraft] = useState<{
    orderId: string;
    status: OrderStatus;
    note: string;
  } | null>(null);

  const activeDraft = draft && draft.orderId === orderId ? draft : null;
  const selectedStatus = activeDraft?.status ?? order?.status ?? 'pending';
  const statusNote = activeDraft?.note ?? '';

  const handleStatusChange = (status: OrderStatus) =>
    setDraft({ orderId, status, note: statusNote });

  const handleStatusNoteChange = (note: string) =>
    setDraft({ orderId, status: selectedStatus, note });

  const handleSaveStatus = () => {
    if (!order || selectedStatus === order.status) return;
    updateStatus.mutate({
      id: order.id,
      status: selectedStatus,
      adminNotes: statusNote,
    });
  };

  const copyOrderNumber = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      toast.success('Order number copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Unable to copy order number');
    }
  };

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        message="Unable to load this order. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    );
  }

  if (!order) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-12 text-center mt-5">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8 text-zinc-600" />
        </div>
        <h3 className="text-xl font-medium text-zinc-600 mb-2">Order not found</h3>
        <p className="text-base text-zinc-600 mb-8">
          We couldn&apos;t find this order, or you don&apos;t have access to it.
        </p>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
      </div>
    );
  }

  const status =
    STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;
  const itemsSubtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subtotal = order.subtotal ?? itemsSubtotal;
  const shipping = order.shipping ?? Math.max(0, order.total - subtotal - (order.tax ?? 0));
  const tax = order.tax ?? 0;
  const hasBillingAddress = Boolean(order.billingAddress.street || order.billingAddress.city);

  const copyNumberLabel = copied ? 'Copied' : 'Copy';

  return (
    <div className="space-y-6 mt-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/orders"
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-zinc-600 hover:bg-gray-50 transition-colors"
            aria-label="Back to orders"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="bound-regular text-2xl font-medium text-zinc-600 uppercase">Order Details</h1>
            <p className="text-xl text-zinc-600 mt-1">Track items, shipping and payment</p>
          </div>
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full self-start sm:self-auto ${status.bg} ${status.color}`}>
          <StatusIcon className="h-4 w-4" />
          <span className="text-sm font-bold uppercase tracking-wider">{status.label}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 p-6 bg-gray-50/50 border border-gray-100 rounded-xl">
        <div>
          <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">Order Placed</p>
          <p className="text-sm font-semibold text-zinc-600">
            {new Date(order.date).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">Total</p>
          <p className="text-sm font-semibold text-zinc-600">${order.total.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">Items</p>
          <p className="text-sm font-semibold text-zinc-600">{order.itemCount}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-1">Order #</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-zinc-600">{order.orderNumber}</p>
            <button
              type="button"
              onClick={copyOrderNumber}
              className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#D4AF37] hover:opacity-70 transition-opacity"
            >
              <Copy className="h-3.5 w-3.5" />
              {copyNumberLabel}
            </button>
          </div>
        </div>
      </div>

      {order.adminNotes && (
        <div
          className={`rounded-xl p-4 text-sm ${
            order.status === 'cancelled'
              ? 'bg-red-50 border border-red-100 text-red-700'
              : 'bg-amber-50 border border-amber-100 text-amber-800'
          }`}
        >
          <span className="font-semibold uppercase tracking-wider text-[11px] mr-2">Note</span>
          {order.adminNotes}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
              Products ({order.items.length})
            </h2>
          </div>

          {order.items.length === 0 ? (
            <p className="p-6 text-sm text-zinc-600">No products found for this order.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {order.items.map((item: OrderItem) => (
                <div key={item.id} className="flex items-center gap-4 p-6">
                  <Thumb src={item.productImage} alt={item.productName} />
                  <div className="flex-1 min-w-0">
                    {item.productId ? (
                      <Link
                        href={`/product/${item.productId}`}
                        className="text-sm font-semibold text-zinc-600 hover:text-[#D4AF37] transition-colors line-clamp-2"
                      >
                        {item.productName}
                      </Link>
                    ) : (
                      <h4 className="text-sm font-semibold text-zinc-600 line-clamp-2">
                        {item.productName}
                      </h4>
                    )}
                    <p className="text-xs text-zinc-600 mt-1 uppercase tracking-wider">
                      {item.sku ? `SKU: ${item.sku}` : ''}
                      {item.sku && (item.size || item.color) ? ' • ' : ''}
                      {[item.size, item.color].filter(Boolean).join(' / ')}
                    </p>
                    <p className="text-xs text-zinc-600 mt-1">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-zinc-600 whitespace-nowrap">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {isAdmin && (
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw className="h-4 w-4 text-[#D4AF37]" />
                <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                  Update Status
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="order-status"
                    className="block text-[11px] font-bold text-zinc-600 uppercase tracking-wider"
                  >
                    Status
                  </label>
                  <select
                    id="order-status"
                    value={selectedStatus}
                    onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-zinc-600 outline-none focus:border-black transition-colors bg-white"
                  >
                    {ORDER_STATUSES.map((value) => (
                      <option key={value} value={value}>
                        {ORDER_STATUS_LABELS[value]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="status-note"
                    className="block text-[11px] font-bold text-zinc-600 uppercase tracking-wider"
                  >
                    Note to customer
                  </label>
                  <textarea
                    id="status-note"
                    value={statusNote}
                    onChange={(e) => handleStatusNoteChange(e.target.value)}
                    maxLength={1000}
                    rows={3}
                    placeholder="e.g. Packed and ready for dispatch"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-zinc-600 outline-none focus:border-black transition-colors resize-none placeholder:text-zinc-600/60"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveStatus}
                  disabled={updateStatus.isPending || selectedStatus === order.status}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-white rounded-lg text-sm font-semibold hover:bg-[#C4A030] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateStatus.isPending ? 'Saving...' : 'Save Status'}
                </button>

                <p className="text-xs text-zinc-600">
                  Notes are visible to the customer on this page.
                </p>
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-4 w-4 text-[#D4AF37]" />
              <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                Order Summary
              </h3>
            </div>
            <dl className="space-y-2 text-sm text-zinc-600">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd>{shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Tax</dt>
                <dd>${tax.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between pt-3 mt-1 border-t border-gray-100 font-semibold text-zinc-600">
                <dt>Total</dt>
                <dd>${order.total.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-zinc-600">
              <p>
                <span className="text-[11px] font-bold uppercase tracking-wider mr-2">
                  Payment
                </span>
                {order.paymentMethod}
              </p>
              {order.paymentStatus && (
                <p className="mt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider mr-2">
                    Status
                  </span>
                  {order.paymentStatus}
                </p>
              )}
            </div>
          </div>

          <AddressCard title="Shipping Address" order={order} />
          {hasBillingAddress && <AddressCard title="Billing Address" order={order} />}

          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-4 w-4 text-[#D4AF37]" />
              <h3 className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider">
                Delivery
              </h3>
            </div>
            {order.trackingNumber || order.trackingUrl ? (
              <div className="text-sm text-zinc-600">
                {order.trackingNumber && <p className="font-semibold">{order.trackingNumber}</p>}
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D4AF37] hover:opacity-70 transition-opacity"
                  >
                    Track package
                  </a>
                )}
              </div>
            ) : (
              <p className="text-sm text-zinc-600">
                Tracking will appear here once your order ships.
              </p>
            )}
          </div>

          <Link
            href="/dashboard/orders"
            className="inline-flex w-full items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-zinc-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
