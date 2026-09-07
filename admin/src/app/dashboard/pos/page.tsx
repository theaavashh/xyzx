'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import toast from 'react-hot-toast';
import {
  Search, Plus, Minus, Trash2, ShoppingCart, User, Receipt,
  CheckCircle, Printer, X, CreditCard, Wallet, Smartphone,
  Banknote, Percent, Clock, RefreshCw, ChevronLeft,
} from 'lucide-react';
import { usePosQueries, ReceiptPreviewModal } from '@/features/pos';
import type { Product, CartItem, PaymentMethod, SaleData, SaleRecord } from '@/features/pos';

export default function POSPage() {
  const [tab, setTab] = useState<'new-sale' | 'history'>('new-sale');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saleData, setSaleData] = useState<SaleData | null>(null);
  const [showReceiptPreview, setShowReceiptPreview] = useState(false);
  const [pendingSale, setPendingSale] = useState<SaleData | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [salesHistory, setSalesHistory] = useState<SaleRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historySearch, setHistorySearch] = useState('');

  const { loading, processing, fetchProducts, fetchSalesHistory, createSale, getSaleDetail } = usePosQueries();

  useEffect(() => {
    if (tab === 'new-sale') {
      searchInputRef.current?.focus();
    }
  }, [tab]);

  useEffect(() => {
    (async () => {
      const result = await fetchProducts(searchQuery);
      setProducts(result);
    })();
  }, [fetchProducts, searchQuery]);

  const loadSalesHistory = useCallback(async () => {
    setHistoryLoading(true);
    const result = await fetchSalesHistory(historyPage, historySearch);
    setSalesHistory(result.data);
    setHistoryLoading(false);
  }, [fetchSalesHistory, historyPage, historySearch]);

  useEffect(() => {
    if (tab === 'history') loadSalesHistory();
  }, [tab, loadSalesHistory]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error('Not enough stock');
          return prev;
        }
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev
      .map(item => {
        if (item.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return item;
          if (newQty > item.stock) {
            toast.error('Not enough stock');
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter(item => item.quantity > 0),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscountValue(0);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = discountType === 'percent'
    ? subtotal * (discountValue / 100)
    : Math.min(discountValue, subtotal);
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * 0.13;
  const total = taxableAmount + tax;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    const order = await createSale({
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || undefined,
      subtotal,
      tax,
      discount: discountAmount,
      total,
      paymentMethod,
    });

    if (!order) return;

    const items: CartItem[] = cart.map(ci => ({ ...ci }));
    const sale: SaleData = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '',
      subtotal,
      tax,
      discount: discountAmount,
      total,
      paymentMethod,
      items,
      createdAt: order.createdAt,
    };

    setPendingSale(sale);
    setShowReceiptPreview(true);
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscountValue(0);
    fetchProducts(searchQuery);
    toast.success('Sale completed');
  };

  const generateReceiptHTML = (sale: SaleData) => `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt ${sale.orderNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Courier New', monospace;
            padding: 20px;
            max-width: 320px;
            margin: 0 auto;
            font-size: 12px;
            line-height: 1.4;
          }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 2px dashed #000; padding-bottom: 15px; }
          .store-name { font-size: 20px; font-weight: bold; margin-bottom: 5px; }
          .store-address { font-size: 11px; color: #555; }
          .receipt-info { margin: 15px 0; font-size: 11px; }
          .receipt-info div { display: flex; justify-content: space-between; margin: 3px 0; }
          .customer-info { margin: 10px 0; padding: 8px; background: #f5f5f5; border-radius: 4px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th { text-align: left; font-size: 10px; text-transform: uppercase; border-bottom: 1px solid #000; padding: 5px 0; }
          th:last-child, td:last-child { text-align: right; }
          td { padding: 6px 0; border-bottom: 1px dotted #ccc; }
          .item-name { font-weight: 500; }
          .item-details { font-size: 10px; color: #666; }
          .totals { margin: 15px 0; border-top: 2px dashed #000; padding-top: 10px; }
          .totals-row { display: flex; justify-content: space-between; margin: 5px 0; }
          .totals-row.discount { color: #dc2626; }
          .totals-row.grand-total { font-size: 16px; font-weight: bold; border-top: 1px solid #000; padding-top: 8px; margin-top: 8px; }
          .payment-info { margin: 10px 0; padding: 8px; background: #f0f9ff; border-radius: 4px; text-align: center; font-weight: 500; }
          .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 2px dashed #000; }
          .footer p { margin: 5px 0; color: #666; }
          .thank-you { font-size: 14px; font-weight: bold; color: #000; margin-bottom: 10px; }
          @media print { body { padding: 0; } @page { margin: 10mm; size: 80mm auto; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="store-name">RAPHARCH STORE</div>
          <div class="store-address">Kathmandu, Nepal</div>
          <div class="store-address">Phone: +977-1-XXXXXXX</div>
        </div>
        <div class="receipt-info">
          <div><span>Receipt #:</span><span>${sale.orderNumber}</span></div>
          <div><span>Date:</span><span>${new Date(sale.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>
          <div><span>Time:</span><span>${new Date(sale.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span></div>
        </div>
        ${sale.customerName !== 'Walk-in Customer' ? `
        <div class="customer-info">
          <strong>Customer:</strong> ${sale.customerName}<br>
          ${sale.customerPhone ? `<strong>Phone:</strong> ${sale.customerPhone}` : ''}
        </div>` : ''}
        <table>
          <thead>
            <tr>
              <th style="width:45%" className="">Item</th>
              <th style="width:15%;text-align:center" className="">Qty</th>
              <th style="width:20%;text-align:right" className="">Price</th>
              <th style="width:20%" className="">Total</th>
            </tr>
          </thead>
          <tbody>
            ${sale.items.map(item => `
              <tr>
                <td>
                  <div class="item-name">${item.name}</div>
                  <div class="item-details">NPR ${item.price.toLocaleString()} each</div>
                </td>
                <td style="text-align:center">${item.quantity}</td>
                <td style="text-align:right">${item.price.toLocaleString()}</td>
                <td style="text-align:right;font-weight:500">NPR ${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="totals">
          <div class="totals-row"><span>Subtotal:</span><span>NPR ${sale.subtotal.toLocaleString()}</span></div>
          ${sale.discount > 0 ? `<div class="totals-row discount"><span>Discount:</span><span>- NPR ${sale.discount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>` : ''}
          <div class="totals-row"><span>Tax (13%):</span><span>NPR ${sale.tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
          <div class="totals-row grand-total"><span>TOTAL:</span><span>NPR ${sale.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
        </div>
        <div class="payment-info">Payment: ${sale.paymentMethod.toUpperCase()}</div>
        <div class="footer">
          <p class="thank-you">Thank you for your purchase!</p>
          <p>For queries: info@rapharch.com</p>
        </div>
      </body>
    </html>`;

  const handlePrintReceipt = () => {
    if (!pendingSale) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generateReceiptHTML(pendingSale));
      printWindow.document.close();
      printWindow.print();
    } else {
      toast.error('Please allow popups to print receipt');
    }
  };

  const handleCompleteSale = () => {
    setShowReceiptPreview(false);
    setPendingSale(null);
    setShowSuccess(true);
    setSaleData(pendingSale);
  };

  const resetSuccess = () => {
    setShowSuccess(false);
    setSaleData(null);
  };

  const handleReprint = async (saleId: string) => {
    const order = await getSaleDetail(saleId);
    if (!order) return;

    const items: CartItem[] = order.orderItems.map((oi) => ({
      id: oi.productId,
      name: oi.product.name,
      sku: oi.product.sku || '',
      price: oi.price,
      stock: 0,
      images: oi.product.images || [],
      quantity: oi.quantity,
    }));

    let discount = 0;
    try {
      const notes = JSON.parse(order.notes || '{}');
      discount = notes.discount || 0;
    } catch { /* ignore */ }

    const sale: SaleData = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.shippingName,
      customerPhone: order.shippingPhone || '',
      subtotal: order.subtotal,
      tax: order.tax,
      discount,
      total: order.total,
      paymentMethod: order.paymentMethod || 'cash',
      items,
      createdAt: order.createdAt,
    };

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generateReceiptHTML(sale));
      printWindow.document.close();
    } else {
      toast.error('Please allow popups to print receipt');
    }
  };

  const paymentMethods: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { value: 'cash', label: 'Cash', icon: <Banknote className="w-4 h-4" /> },
    { value: 'card', label: 'Card', icon: <CreditCard className="w-4 h-4" /> },
    { value: 'esewa', label: 'eSewa', icon: <Smartphone className="w-4 h-4" /> },
    { value: 'khalti', label: 'Khalti', icon: <Wallet className="w-4 h-4" /> },
    { value: 'bank_transfer', label: 'Bank', icon: <Banknote className="w-4 h-4" /> },
  ];

  if (showSuccess) {
    return (
      <DashboardLayout title="Point of Sale">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">Sale Complete!</h2>
            <p className="text-black mb-2">Order: <span className="font-mono font-semibold">{saleData?.orderNumber}</span></p>
            <p className="text-black mb-2">Total: <span className="font-bold">NPR {saleData?.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></p>
            <p className="text-black mb-8">Payment: <span className="font-medium capitalize">{saleData?.paymentMethod}</span></p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { if (saleData) { setPendingSale(saleData); setShowReceiptPreview(true); } }}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button onClick={resetSuccess} className="bg-[#D4AF37] text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-[#b8962e] transition-colors">
                New Sale
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (tab === 'history') {
    return (
      <DashboardLayout title="Point of Sale">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setTab('new-sale')} className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#D4AF37] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to POS
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-black">Sales History</h2>
          <button onClick={loadSalesHistory} disabled={historyLoading} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className={`w-4 h-4 ${historyLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        <div className="mb-4 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="Search by order number or customer..."
              value={historySearch}
              onChange={(e) => { setHistorySearch(e.target.value); setHistoryPage(1); }}
              onKeyDown={(e) => e.key === 'Enter' && loadSalesHistory()}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {historyLoading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">Loading sales...</td></tr>
              ) : salesHistory.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <span className="text-lg font-semibold text-black">No sales found</span>
                </td></tr>
              ) : (
                salesHistory.map(sale => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono font-semibold text-black">{sale.orderNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(sale.createdAt).toLocaleDateString()}<br />
                      <span className="text-xs">{new Date(sale.createdAt).toLocaleTimeString()}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-black">
                      {sale.shippingName || 'Walk-in'}
                      {sale.shippingPhone && <div className="text-xs text-gray-500">{sale.shippingPhone}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-black text-right">
                      NPR {sale.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full capitalize">
                        {sale.paymentMethod || 'cash'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleReprint(sale.id)} className="p-2 text-gray-500 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-lg transition-colors" title="Reprint Receipt">
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button onClick={() => setHistoryPage(p => Math.max(1, p - 1))} disabled={historyPage === 1}
            className="px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">
            Previous
          </button>
          <span className="text-sm text-gray-500">Page {historyPage}</span>
          <button onClick={() => setHistoryPage(p => p + 1)} disabled={salesHistory.length < 20}
            className="px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors">
            Next
          </button>
        </div>

        {showReceiptPreview && pendingSale && (
          <ReceiptPreviewModal
            sale={pendingSale}
            onClose={() => setShowReceiptPreview(false)}
            onPrint={handlePrintReceipt}
          />
        )}
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Point of Sale">
      <div className="flex gap-3 mb-4">
          <button onClick={() => setTab('new-sale')}
          className={`px-4 py-2.5 text-lg rounded-md transition-all ${tab === 'new-sale' ? 'bg-[#D4AF37] text-white' : 'bg-white text-black border border-gray-200 hover:bg-gray-50'}`}>
          New Sale
        </button>
        <button onClick={() => setTab('history')}
          className="px-4 py-2.5 text-lg rounded-md bg-white text-black border border-gray-200 hover:bg-gray-50 transition-all">
          <Clock className="w-4 h-4 inline mr-1" /> Sales History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-10rem)]">
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 flex flex-col">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black">Products</h2>
              <span className="text-sm text-gray-500">{Array.isArray(products) ? products.length : 0} items</span>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input ref={searchInputRef} type="text" placeholder="Search by name or SKU..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-[#D4AF37]" />
              </div>
            ) : !Array.isArray(products) || products.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No products found</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {Array.isArray(products) && products.map(product => (
                  <button key={product.id} onClick={() => addToCart(product)} disabled={product.stock === 0}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-left hover:border-[#D4AF37] hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden">
                      {product.images?.[0]
                        ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain" />
                        : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>}
                    </div>
                    <h3 className="font-medium text-black text-sm mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">SKU: {product.sku}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#D4AF37]">NPR {product.price.toLocaleString()}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 flex flex-col">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-black flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Bill</h2>
              {cart.length > 0 && <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-sm font-semibold">{totalItems} items</span>}
            </div>
          </div>

          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="flex items-center gap-2 text-black font-medium text-sm"><User className="w-4 h-4" /> Customer</div>
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Name (optional)" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]" />
              <input type="tel" placeholder="Phone (optional)" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Cart is empty</p>
                <p className="text-xs text-gray-400 mt-1">Click products to add</p>
              </div>
            ) : (
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-black text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-gray-500">NPR {item.price.toLocaleString()}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 rounded-md bg-white border border-gray-300 flex items-center justify-center hover:border-[#D4AF37]"><Minus className="w-3.5 h-3.5 text-black" /></button>
                        <span className="w-8 text-center font-semibold text-black text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 rounded-md bg-white border border-gray-300 flex items-center justify-center hover:border-[#D4AF37]"><Plus className="w-3.5 h-3.5 text-black" /></button>
                      </div>
                      <span className="font-bold text-black">NPR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-2"><Percent className="w-4 h-4 text-gray-500" /> <span className="text-sm font-medium text-black">Discount</span></div>
              <div className="flex gap-2">
                <div className="flex gap-1">
                  <button onClick={() => setDiscountType('percent')}
                    className={`px-3 py-1.5 text-sm rounded-md ${discountType === 'percent' ? 'bg-[#D4AF37] text-white' : 'bg-gray-100 text-black border border-gray-300'}`}>%</button>
                  <button onClick={() => setDiscountType('fixed')}
                    className={`px-3 py-1.5 text-sm rounded-md ${discountType === 'fixed' ? 'bg-[#D4AF37] text-white' : 'bg-gray-100 text-black border border-gray-300'}`}>NPR</button>
                </div>
                <input type="number" placeholder="0" value={discountValue || ''}
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]" min="0" />
              </div>
            </div>
          )}

          {cart.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200">
              <span className="text-sm font-medium text-black mb-2 block">Payment Method</span>
              <div className="grid grid-cols-5 gap-2">
                {paymentMethods.map(method => (
                  <button key={method.value} onClick={() => setPaymentMethod(method.value)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${paymentMethod === method.value ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {method.icon}<span className="text-xs font-medium">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {cart.length > 0 && (
            <div className="p-5 border-t border-gray-200 space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-black"><span>Subtotal</span><span>NPR {subtotal.toLocaleString()}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-red-600"><span>Discount</span><span>- NPR {discountAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>}
                <div className="flex justify-between text-black"><span>Tax (13%)</span><span>NPR {tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
                <div className="flex justify-between text-xl font-bold text-black pt-2 border-t border-gray-200"><span>Total</span><span>NPR {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
              </div>
              <div className="flex gap-2">
                <button onClick={clearCart} className="px-4 py-4 bg-gray-100 text-black rounded-lg font-medium hover:bg-gray-200"><X className="w-5 h-5" /></button>
                <button onClick={handleCheckout} disabled={cart.length === 0 || processing}
                  className="flex-1 bg-[#D4AF37] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#b8962e] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <Receipt className="w-5 h-5" />
                  {processing ? 'Processing...' : `Charge NPR ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showReceiptPreview && pendingSale && (
        <ReceiptPreviewModal
          sale={pendingSale}
          onClose={() => setShowReceiptPreview(false)}
          onPrint={handlePrintReceipt}
          onComplete={handleCompleteSale}
        />
      )}
    </DashboardLayout>
  );
}
