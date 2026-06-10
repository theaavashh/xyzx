'use client';

interface InventoryFiltersProps {
  selectedProduct: string;
  onSelectedProductChange: (value: string) => void;
  updateQty: string;
  onUpdateQtyChange: (value: string) => void;
  updateType: string;
  onUpdateTypeChange: (value: string) => void;
  updateReason: string;
  onUpdateReasonChange: (value: string) => void;
  onUpdateStock: () => void;
  onStoreSale: () => void;
}

export default function InventoryFilters({
  selectedProduct,
  onSelectedProductChange,
  updateQty,
  onUpdateQtyChange,
  updateType,
  onUpdateTypeChange,
  updateReason,
  onUpdateReasonChange,
  onUpdateStock,
  onStoreSale,
}: InventoryFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-black lastik mb-6">Update Stock</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-2">Product ID</label>
          <input
            type="text"
            placeholder="Enter product ID"
            value={selectedProduct}
            onChange={(e) => onSelectedProductChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">Quantity</label>
          <input
            type="number"
            placeholder="Enter quantity"
            value={updateQty}
            onChange={(e) => onUpdateQtyChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">Update Type</label>
          <select
            value={updateType}
            onChange={(e) => onUpdateTypeChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
          >
            <option value="STOCK_ADJUSTED">Set Exact</option>
            <option value="STOCK_ADDED">Add Stock</option>
            <option value="STOCK_DEDUCTED">Deduct Stock</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">Reason</label>
          <input
            type="text"
            placeholder="Optional reason"
            value={updateReason}
            onChange={(e) => onUpdateReasonChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={onUpdateStock}
          className="bg-[#D4AF37] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#b8962e] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-colors"
        >
          Update Stock
        </button>
        <button
          onClick={onStoreSale}
          className="bg-gray-100 text-black px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-colors"
        >
          Log Store Sale
        </button>
      </div>
    </div>
  );
}
