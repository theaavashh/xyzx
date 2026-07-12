import { CheckCircle, Printer, X } from 'lucide-react';
import type { SaleData } from '../types';

export default function ReceiptPreviewModal({
  sale,
  onClose,
  onPrint,
  onComplete,
}: {
  sale: SaleData;
  onClose: () => void;
  onPrint: () => void;
  onComplete?: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/50 cursor-default" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg font-bold text-black">Receipt Preview</h3>
          <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm">
            <div className="text-center mb-4 pb-4 border-b-2 border-dashed border-gray-300">
              <div className="text-xl font-bold text-black">RAPHARCH STORE</div>
              <div className="text-xs text-gray-500">Kathmandu, Nepal</div>
            </div>
            <div className="space-y-1 mb-4 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Receipt #:</span><span className="font-medium">{sale.orderNumber}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date:</span><span>{new Date(sale.createdAt).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Time:</span><span>{new Date(sale.createdAt).toLocaleTimeString()}</span></div>
            </div>
            {sale.customerName !== 'Walk-in Customer' && (
              <div className="bg-white rounded p-3 mb-4 text-xs">
                <div className="font-medium mb-1">Customer</div>
                <div>{sale.customerName}</div>
                {sale.customerPhone && <div>{sale.customerPhone}</div>}
              </div>
            )}
            <div className="bg-white rounded p-3 mb-4">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-gray-200"><th className="text-left py-2 font-medium text-gray-500 outer-sans">Item</th><th className="text-center py-2 font-medium text-gray-500 outer-sans">Qty</th><th className="text-right py-2 font-medium text-gray-500 outer-sans">Total</th></tr></thead>
                <tbody>
                  {sale.items.map(item => (
                    <tr key={item.id} className="border-b border-dotted border-gray-200">
                      <td className="py-2"><div className="font-medium">{item.name}</div><div className="text-gray-500">{item.quantity} x NPR {item.price.toLocaleString()}</div></td>
                      <td className="py-2 text-center">{item.quantity}</td>
                      <td className="py-2 text-right font-medium">NPR {(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white rounded p-3 space-y-2">
              <div className="flex justify-between text-xs"><span className="text-gray-500">Subtotal</span><span>NPR {sale.subtotal.toLocaleString()}</span></div>
              {sale.discount > 0 && <div className="flex justify-between text-xs text-red-600"><span>Discount</span><span>- NPR {sale.discount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>}
              <div className="flex justify-between text-xs"><span className="text-gray-500">Tax (13%)</span><span>NPR {sale.tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-dashed border-gray-300"><span>TOTAL</span><span>NPR {sale.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
            </div>
            <div className="bg-amber-50 rounded p-3 mt-4 text-center text-xs font-medium">Payment: {sale.paymentMethod.toUpperCase()}</div>
            <div className="text-center mt-4 pt-4 border-t-2 border-dashed border-gray-300 text-xs text-gray-500">
              <div className="font-bold text-black mb-1">Thank you for your purchase!</div>
              <div>For queries: info@rapharch.com</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={onPrint} className="px-4 py-2.5 text-white bg-gray-800 rounded-lg hover:bg-gray-900 flex items-center gap-2"><Printer className="w-4 h-4" /> Print</button>
          {onComplete && (
            <button onClick={onComplete} className="px-6 py-2.5 bg-amber-600 text-black rounded-lg font-medium hover:bg-amber-700 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Complete</button>
          )}
        </div>
      </div>
    </div>
  );
}
