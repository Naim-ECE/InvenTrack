import { motion } from 'framer-motion';
import { Star, Plus, FileText } from 'lucide-react';
import { suppliers } from '@/data/mockData';

export default function Suppliers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Suppliers</h2>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-[#22C55E] text-white text-sm rounded-lg hover:bg-[#16A34A]"><Plus className="w-4 h-4" /> Add Supplier</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-base font-semibold text-[#F9FAFB]">{s.name}</h4>
                <p className="text-xs text-[#9CA3AF]">{s.email}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                <span className="text-sm text-[#F9FAFB] font-medium">{s.rating}</span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#9CA3AF]">On-Time Delivery</span>
                  <span className="text-[#F9FAFB]">{s.onTimeDelivery}%</span>
                </div>
                <div className="bg-[#0B1220] rounded-full h-1.5">
                  <div className={`h-full rounded-full ${s.onTimeDelivery >= 90 ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'}`} style={{ width: `${s.onTimeDelivery}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#9CA3AF]">Avg Lead Time: <span className="text-[#F9FAFB]">{s.avgLeadTime} days</span></span>
                <span className="text-[#9CA3AF]">Orders: <span className="text-[#F9FAFB]">{s.totalOrders}</span></span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {s.categories.map((cat) => (
                <span key={cat} className="px-2 py-0.5 bg-[rgba(59,130,246,0.15)] text-[#3B82F6] text-[10px] font-medium rounded-full">{cat}</span>
              ))}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-[#22C55E] text-white text-xs font-medium rounded-lg hover:bg-[#16A34A]"><FileText className="w-3.5 h-3.5 inline mr-1" /> Create PO</button>
              <button className="px-3 py-2 border border-[#2D3748] text-[#9CA3AF] text-xs rounded-lg hover:bg-[#1F2937]">View</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
