import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { purchaseOrders } from '@/data/mockData';

const statusColors: Record<string, string> = {
  draft: 'bg-[rgba(107,114,128,0.15)] text-[#9CA3AF]',
  sent: 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]',
  partial: 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]',
  received: 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]',
  cancelled: 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]',
};

const tabs = ['All', 'Draft', 'Sent', 'Partial', 'Received'];

export default function PurchaseRecords() {
  const [activeTab, setActiveTab] = useState('All');
  const filtered = activeTab === 'All' ? purchaseOrders : purchaseOrders.filter((po) => po.status === activeTab.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Purchase Orders</h2>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-[#22C55E] text-white text-sm rounded-lg hover:bg-[#16A34A]"><Plus className="w-4 h-4" /> Create PO</button>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-[#22C55E] text-white' : 'bg-[#111827] text-[#9CA3AF] border border-[#2D3748]'}`}>{tab}</button>
        ))}
      </div>

      <div className="bg-[#111827] border border-[#2D3748] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#9CA3AF] text-xs uppercase tracking-wider border-b border-[#1F2937]">
                <th className="text-left py-3 px-4">PO #</th>
                <th className="text-left py-3 px-4">Supplier</th>
                <th className="text-left py-3 px-4">Items</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Expected</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((po, i) => (
                <motion.tr key={po.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-[#1F2937] hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-3 px-4 text-[#F9FAFB] font-medium">{po.poNumber}</td>
                  <td className="py-3 px-4 text-[#F9FAFB]">{po.supplier}</td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{po.items.length} items</td>
                  <td className="py-3 px-4 text-[#F9FAFB] font-medium">${po.total.toLocaleString()}</td>
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[po.status]}`}>{po.status}</span></td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{new Date(po.expectedDate).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
