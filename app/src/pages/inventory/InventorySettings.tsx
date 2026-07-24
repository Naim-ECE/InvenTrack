import { motion } from 'framer-motion';
import { Bell, Sliders } from 'lucide-react';

export default function InventorySettings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Settings</h2>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-[#22C55E]" />
          <h3 className="text-sm font-semibold text-[#F9FAFB]">Notification Rules</h3>
        </div>
        <div className="space-y-4">
          {['Email alerts for low stock', 'SMS alerts for critical stock', 'Notify on purchase order updates', 'Weekly inventory summary'].map((label, i) => (
            <label key={i} className="flex items-center justify-between py-3 border-b border-[#1F2937] last:border-0">
              <span className="text-sm text-[#F9FAFB]">{label}</span>
              <div className={`w-11 h-6 rounded-full relative cursor-pointer ${i < 3 ? 'bg-[#22C55E]' : 'bg-[#E2E8F0]'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${i < 3 ? 'left-[22px]' : 'left-0.5'}`} />
              </div>
            </label>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sliders className="w-5 h-5 text-[#3B82F6]" />
          <h3 className="text-sm font-semibold text-[#F9FAFB]">Default Thresholds</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#9CA3AF] mb-1.5">Low Stock Default</label>
            <input type="number" defaultValue="10" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] focus:border-[#22C55E] outline-none" />
          </div>
          <div>
            <label className="block text-xs text-[#9CA3AF] mb-1.5">Critical Stock Default</label>
            <input type="number" defaultValue="3" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] focus:border-[#22C55E] outline-none" />
          </div>
        </div>
        <button className="mt-4 px-6 py-2.5 bg-[#22C55E] text-white text-sm font-medium rounded-lg hover:bg-[#16A34A]">Save Settings</button>
      </motion.div>
    </div>
  );
}
