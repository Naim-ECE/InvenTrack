import { motion } from 'framer-motion';
import { Plus, ArrowRightLeft } from 'lucide-react';
import { warehouses } from '@/data/mockData';

export default function Warehouses() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Warehouses</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 border border-[#2D3748] text-[#9CA3AF] text-sm rounded-lg hover:bg-[#1F2937]"><ArrowRightLeft className="w-4 h-4" /> Transfer</button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-[#22C55E] text-white text-sm rounded-lg hover:bg-[#16A34A]"><Plus className="w-4 h-4" /> Add Warehouse</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {warehouses.map((wh, i) => (
          <motion.div key={wh.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5 hover:border-[#374151] transition-colors">
            <h4 className="text-base font-semibold text-[#F9FAFB] font-[Poppins]">{wh.name}</h4>
            <p className="text-xs text-[#9CA3AF] mt-0.5">{wh.location}</p>
            <p className="text-xs text-[#64748B] mt-1">Manager: {wh.manager}</p>
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#1F2937]">
              <div className="text-center">
                <p className="text-lg font-bold text-[#F9FAFB] font-[Montserrat]">{wh.totalSkus}</p>
                <p className="text-[10px] text-[#9CA3AF] uppercase">SKUs</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#22C55E] font-[Montserrat]">${(wh.stockValue / 1000).toFixed(0)}K</p>
                <p className="text-[10px] text-[#9CA3AF] uppercase">Value</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#3B82F6] font-[Montserrat]">{wh.capacityUsed}%</p>
                <p className="text-[10px] text-[#9CA3AF] uppercase">Capacity</p>
              </div>
            </div>
            <div className="mt-3 bg-[#0B1220] rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-[#3B82F6] rounded-full transition-all" style={{ width: `${wh.capacityUsed}%` }} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
