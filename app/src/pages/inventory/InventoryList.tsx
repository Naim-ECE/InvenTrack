import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Download, Upload } from 'lucide-react';
import { products } from '@/data/mockData';

export default function InventoryList() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all') {
      const isLow = p.stock <= (p.lowStockThreshold || 10);
      const isOut = p.stock === 0;
      if (statusFilter === 'in' && (isLow || isOut)) return false;
      if (statusFilter === 'low' && !isLow) return false;
      if (statusFilter === 'out' && !isOut) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Inventory</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-[#22C55E] text-white text-sm rounded-lg hover:bg-[#16A34A]"><Plus className="w-4 h-4" /> Add Stock</button>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-[#2D3748] text-[#9CA3AF] text-sm rounded-lg hover:bg-[#1F2937]"><Download className="w-4 h-4" /></button>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-[#2D3748] text-[#9CA3AF] text-sm rounded-lg hover:bg-[#1F2937]"><Upload className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or SKU..." className="w-full pl-9 pr-4 py-2.5 bg-[#111827] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#22C55E] outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 bg-[#111827] border border-[#2D3748] rounded-lg text-sm text-[#9CA3AF] focus:border-[#22C55E] outline-none">
          <option value="all">All Status</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      <div className="bg-[#111827] border border-[#2D3748] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#9CA3AF] text-xs uppercase tracking-wider border-b border-[#1F2937]">
                <th className="text-left py-3 px-4">SKU</th>
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Warehouse</th>
                <th className="text-left py-3 px-4">Qty</th>
                <th className="text-left py-3 px-4">Threshold</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const isLow = p.stock <= (p.lowStockThreshold || 10);
                const isOut = p.stock === 0;
                return (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-[#1F2937] hover:bg-[rgba(255,255,255,0.02)]">
                    <td className="py-3 px-4 text-[#9CA3AF] font-mono text-xs">{p.sku}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-8 h-8 object-cover rounded" />
                        <span className="text-[#F9FAFB] font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#9CA3AF]">{p.category}</td>
                    <td className="py-3 px-4 text-[#9CA3AF]">Warehouse A</td>
                    <td className={`py-3 px-4 font-semibold ${isOut ? 'text-[#EF4444]' : isLow ? 'text-[#F59E0B]' : 'text-[#F9FAFB]'}`}>{p.stock}</td>
                    <td className="py-3 px-4 text-[#9CA3AF]">{p.lowStockThreshold || 10}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isOut ? 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]' : isLow ? 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]' : 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]'}`}>
                        {isOut ? 'Out' : isLow ? 'Low' : 'OK'}
                      </span>
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
