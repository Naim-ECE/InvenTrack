import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, HelpCircle, Store } from 'lucide-react';

const mockVendors = [
  { id: '1', storeName: 'TechHub Store', owner: 'Sarah Chen', email: 'sarah@example.com', products: 47, status: 'approved' },
  { id: '2', storeName: 'StyleVault', owner: 'James Miller', email: 'james@example.com', products: 23, status: 'pending' },
  { id: '3', storeName: 'GreenGrocer', owner: 'Lisa Wang', email: 'lisa@example.com', products: 89, status: 'approved' },
  { id: '4', storeName: 'HomeDecor Pro', owner: 'Robert Kim', email: 'robert@example.com', products: 15, status: 'pending' },
  { id: '5', storeName: 'AudioMax', owner: 'David Lee', email: 'david@example.com', products: 12, status: 'rejected' },
];

const statusColors: Record<string, string> = {
  approved: 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]',
  pending: 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]',
  rejected: 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]',
};

const tabs = ['All', 'Pending Approval', 'Approved', 'Rejected'];

export default function AdminVendors() {
  const [activeTab, setActiveTab] = useState('All');
  const filtered = activeTab === 'All' ? mockVendors : mockVendors.filter((v) => v.status === activeTab.toLowerCase().replace(' approval', ''));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Vendors</h2>
        {mockVendors.filter((v) => v.status === 'pending').length > 0 && (
          <span className="px-3 py-1 bg-[rgba(245,158,11,0.15)] text-[#F59E0B] text-xs font-medium rounded-full">
            {mockVendors.filter((v) => v.status === 'pending').length} pending
          </span>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-[#22C55E] text-white' : 'bg-[#111827] text-[#9CA3AF] border border-[#2D3748]'}`}>{tab}</button>)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((vendor, i) => (
          <motion.div key={vendor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(34,197,94,0.15)] flex items-center justify-center"><Store className="w-5 h-5 text-[#22C55E]" /></div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[vendor.status]}`}>{vendor.status}</span>
            </div>
            <h4 className="text-sm font-semibold text-[#F9FAFB]">{vendor.storeName}</h4>
            <p className="text-xs text-[#9CA3AF] mt-0.5">{vendor.owner}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{vendor.email}</p>
            <p className="text-xs text-[#9CA3AF] mt-2">{vendor.products} products</p>

            {vendor.status === 'pending' && (
              <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-1 py-2 bg-[#22C55E] text-white text-xs font-medium rounded-lg hover:bg-[#16A34A]"><CheckCircle className="w-3.5 h-3.5" /> Approve</button>
                <button className="flex-1 flex items-center justify-center gap-1 py-2 bg-[#EF4444] text-white text-xs font-medium rounded-lg hover:bg-[#DC2626]"><XCircle className="w-3.5 h-3.5" /> Reject</button>
                <button className="px-3 py-2 border border-[#2D3748] text-[#9CA3AF] text-xs rounded-lg hover:bg-[#1F2937]"><HelpCircle className="w-3.5 h-3.5" /></button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
