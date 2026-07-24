import { motion } from 'framer-motion';
import { Package, AlertTriangle, Warehouse, ArrowRightLeft } from 'lucide-react';
import { warehouses, products } from '@/data/mockData';
import DashboardCard from '@/components/ui/DashboardCard';

export default function AdminInventory() {
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const lowStock = products.filter((p) => p.stock <= (p.lowStockThreshold || 10)).length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Platform Inventory</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard icon={Package} iconColor="text-[#22C55E]" iconBg="bg-[rgba(34,197,94,0.15)]" label="Total SKUs" value={`${products.length * 12}`} index={0} />
        <DashboardCard icon={AlertTriangle} iconColor="text-[#F59E0B]" iconBg="bg-[rgba(245,158,11,0.15)]" label="Low Stock" value={`${lowStock * 8}`} index={1} />
        <DashboardCard icon={Warehouse} iconColor="text-[#3B82F6]" iconBg="bg-[rgba(59,130,246,0.15)]" label="Warehouses" value="4" index={2} />
        <DashboardCard icon={ArrowRightLeft} iconColor="text-[#8B5CF6]" iconBg="bg-[rgba(139,92,246,0.15)]" label="Total Value" value={`$${(totalValue * 12 / 1000).toFixed(0)}K`} index={3} />
      </div>

      <div className="bg-[#111827] border border-[#2D3748] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#9CA3AF] text-xs uppercase tracking-wider border-b border-[#1F2937]">
                <th className="text-left py-3 px-4">Warehouse</th>
                <th className="text-left py-3 px-4">Location</th>
                <th className="text-left py-3 px-4">Manager</th>
                <th className="text-left py-3 px-4">SKUs</th>
                <th className="text-left py-3 px-4">Value</th>
                <th className="text-left py-3 px-4">Capacity</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((w, i) => (
                <motion.tr key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-[#1F2937] hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-3 px-4 text-[#F9FAFB] font-medium">{w.name}</td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{w.location}</td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{w.manager}</td>
                  <td className="py-3 px-4 text-[#F9FAFB]">{w.totalSkus}</td>
                  <td className="py-3 px-4 text-[#22C55E]">${(w.stockValue / 1000).toFixed(0)}K</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-[#0B1220] rounded-full h-1.5">
                        <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: `${w.capacityUsed}%` }} />
                      </div>
                      <span className="text-xs text-[#9CA3AF]">{w.capacityUsed}%</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
