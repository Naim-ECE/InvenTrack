import { motion } from 'framer-motion';
import { AlertTriangle, Plus, SlidersHorizontal } from 'lucide-react';
import { lowStockAlerts } from '@/data/mockData';

export default function LowStockAlerts() {
  return (
    <div className="space-y-6">
      <div className="bg-[#1F2937] border-l-4 border-[#F59E0B] rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
          <div>
            <p className="text-sm font-semibold text-[#F9FAFB]">{lowStockAlerts.length} items below minimum threshold</p>
            <p className="text-xs text-[#9CA3AF]">Review and reorder to avoid stockouts</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-[#22C55E] text-white text-sm font-medium rounded-lg hover:bg-[#16A34A]">Generate Reorder List</button>
      </div>

      <div className="space-y-3">
        {lowStockAlerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#111827] border border-[#2D3748] rounded-xl p-5"
          >
            <div className="flex flex-wrap items-center gap-4">
              <img src={alert.productImage} alt="" className="w-14 h-14 object-cover rounded-xl shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-[#F9FAFB]">{alert.productName}</h4>
                <p className="text-xs text-[#9CA3AF]">{alert.sku} — {alert.warehouse}</p>
              </div>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-xs text-[#9CA3AF]">Current</p>
                  <p className="text-lg font-bold text-[#EF4444] font-[Montserrat]">{alert.currentStock}</p>
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Threshold</p>
                  <p className="text-lg font-bold text-[#F59E0B] font-[Montserrat]">{alert.threshold}</p>
                </div>
                <div>
                  <p className="text-xs text-[#9CA3AF]">Reorder</p>
                  <p className="text-lg font-bold text-[#22C55E] font-[Montserrat]">{alert.suggestedReorder}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button className="flex items-center gap-1.5 px-4 py-2 bg-[#22C55E] text-white text-xs font-medium rounded-lg hover:bg-[#16A34A]"><Plus className="w-3.5 h-3.5" /> Create PO</button>
                <button className="flex items-center gap-1.5 px-4 py-2 border border-[#2D3748] text-[#9CA3AF] text-xs rounded-lg hover:bg-[#1F2937]"><SlidersHorizontal className="w-3.5 h-3.5" /> Adjust</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
