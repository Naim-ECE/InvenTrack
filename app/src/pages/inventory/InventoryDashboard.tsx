import { motion } from 'framer-motion';
import { Package, AlertTriangle, Warehouse, DollarSign, Plus } from 'lucide-react';
import { products, lowStockAlerts, chartData } from '@/data/mockData';
import DashboardCard from '@/components/ui/DashboardCard';
import BarChartComponent from '@/components/charts/BarChart';

export default function InventoryDashboard() {
  const totalSkus = products.length;
  const lowStockCount = lowStockAlerts.length;
  const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-[#111827] to-[#1F2937] rounded-xl p-6 border border-[#2D3748]">
        <h3 className="text-lg font-semibold text-[#F9FAFB] font-[Poppins]">Inventory Overview</h3>
        <p className="text-sm text-[#9CA3AF] mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard icon={Package} iconColor="text-[#22C55E]" iconBg="bg-[rgba(34,197,94,0.15)]" label="Total SKUs" value={`${totalSkus}`} index={0} />
        <DashboardCard icon={AlertTriangle} iconColor="text-[#F59E0B]" iconBg="bg-[rgba(245,158,11,0.15)]" label="Low Stock Items" value={`${lowStockCount}`} index={1} />
        <DashboardCard icon={Warehouse} iconColor="text-[#3B82F6]" iconBg="bg-[rgba(59,130,246,0.15)]" label="Warehouses" value="4" index={2} />
        <DashboardCard icon={DollarSign} iconColor="text-[#8B5CF6]" iconBg="bg-[rgba(139,92,246,0.15)]" label="Inventory Value" value={`$${(inventoryValue / 1000).toFixed(0)}K`} index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Stock Level Overview</h4>
          <div className="h-64">
            <BarChartComponent labels={chartData.stockLevels.labels} data={chartData.stockLevels.data} color="#22C55E" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-[#F9FAFB]">Low Stock Alerts</h4>
            <span className="px-2 py-0.5 bg-[rgba(245,158,11,0.15)] text-[#F59E0B] text-xs font-medium rounded-full">{lowStockCount} alerts</span>
          </div>
          <div className="space-y-3">
            {lowStockAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-3 p-3 bg-[#0B1220] rounded-lg border-l-4 border-[#F59E0B]">
                <img src={alert.productImage} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#F9FAFB] truncate">{alert.productName}</p>
                  <p className="text-xs text-[#9CA3AF]">{alert.sku} — {alert.warehouse}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-[#EF4444]">{alert.currentStock} left</p>
                  <p className="text-xs text-[#9CA3AF]">Min: {alert.threshold}</p>
                </div>
                <button className="px-3 py-1.5 bg-[#22C55E] text-white text-xs font-medium rounded-lg hover:bg-[#16A34A] transition-colors shrink-0">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
