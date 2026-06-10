'use client';

import type { LowStockProduct, InventoryLogEntry } from '../types';
import { sourceColors, changeTypeLabels } from '../types';

interface InventoryTableProps {
  lowStock: LowStockProduct[];
  logs: InventoryLogEntry[];
}

export default function InventoryTable({ lowStock, logs }: InventoryTableProps) {
  return (
    <>
      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-black lastik mb-6">
            Low Stock Alerts ({lowStock.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-amber-200 text-left">
                  <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Product</th>
                  <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">SKU</th>
                  <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Current</th>
                  <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Threshold</th>
                  <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id} className="border-b border-amber-100">
                    <td className="py-3 text-black font-medium">{p.name}</td>
                    <td className="py-3 text-gray-600">{p.sku || '-'}</td>
                    <td className="py-3 font-mono text-black">{p.quantity}</td>
                    <td className="py-3 text-black">{p.lowStockThreshold}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        p.quantity === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {p.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-black lastik mb-6">Recent Stock Changes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Product</th>
                <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Type</th>
                <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Qty</th>
                <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Change</th>
                <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Source</th>
                <th className="pb-3 font-semibold text-gray-500 uppercase tracking-wider text-xs">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-amber-50/30">
                  <td className="py-3 text-black font-medium">{log.product?.name || log.productId}</td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      log.changeType.includes('DEDUCTED') ? 'bg-red-100 text-red-700' :
                      log.changeType.includes('ADDED') ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {changeTypeLabels[log.changeType] || log.changeType}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-black">{log.quantity}</td>
                  <td className="py-3 font-mono text-xs text-gray-600">
                    {log.previousQuantity} → {log.newQuantity}
                  </td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${sourceColors[log.source] || 'bg-gray-100 text-gray-700'}`}>
                      {log.source}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
