import { motion } from 'framer-motion';
import { Pencil, Clock } from 'lucide-react';
import { products } from '@/data/mockData';

export default function VendorInventory() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Inventory</h2>
        <button className="px-4 py-2 border border-[#2D3748] text-[#9CA3AF] text-sm rounded-lg hover:bg-[#1F2937] transition-colors">Export</button>
      </div>

      <div className="bg-[#111827] border border-[#2D3748] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#9CA3AF] text-xs uppercase tracking-wider border-b border-[#1F2937]">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">SKU</th>
                <th className="text-left py-3 px-4">Current Stock</th>
                <th className="text-left py-3 px-4">Threshold</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => {
                const isLow = product.stock <= (product.lowStockThreshold || 10);
                const isOut = product.stock === 0;
                return (
                  <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-[#1F2937] hover:bg-[rgba(255,255,255,0.02)]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt="" className="w-10 h-10 object-cover rounded-lg" />
                        <span className="text-[#F9FAFB] font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#9CA3AF]">{product.sku}</td>
                    <td className="py-3 px-4 text-[#F9FAFB]">{product.stock}</td>
                    <td className="py-3 px-4 text-[#9CA3AF]">{product.lowStockThreshold || 10}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isOut ? 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]' : isLow ? 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]' : 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]'}`}>
                        {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <button className="p-1.5 text-[#9CA3AF] hover:text-[#22C55E] hover:bg-[rgba(34,197,94,0.1)] rounded-lg"><Pencil className="w-4 h-4" /></button>
                        <button className="p-1.5 text-[#9CA3AF] hover:text-[#3B82F6] hover:bg-[rgba(59,130,246,0.1)] rounded-lg"><Clock className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
