import { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Bell, Truck, CreditCard } from 'lucide-react';

const tabs = [
  { id: 'store', label: 'Store Profile', icon: Store },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'payout', label: 'Payout', icon: CreditCard },
];

export default function VendorSettings() {
  const [activeTab, setActiveTab] = useState('store');

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Settings</h2>

      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-[#22C55E] text-white' : 'bg-[#111827] text-[#9CA3AF] border border-[#2D3748]'}`}>
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-6 max-w-2xl">
        {activeTab === 'store' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#F9FAFB] mb-4">Store Profile</h3>
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1.5">Store Name</label>
              <input type="text" defaultValue="TechHub Store" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] focus:border-[#22C55E] outline-none" />
            </div>
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1.5">Description</label>
              <textarea rows={3} defaultValue="Premium electronics and tech accessories" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] focus:border-[#22C55E] outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1.5">Return Policy</label>
              <textarea rows={2} defaultValue="30-day return policy. Items must be in original condition." className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] focus:border-[#22C55E] outline-none resize-none" />
            </div>
            <button className="px-6 py-2.5 bg-[#22C55E] text-white text-sm font-medium rounded-lg hover:bg-[#16A34A] transition-colors">Save Changes</button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#F9FAFB] mb-4">Notification Preferences</h3>
            {['Order notifications', 'Low stock alerts', 'Review notifications', 'Payout notifications'].map((label, i) => (
              <label key={i} className="flex items-center justify-between py-3 border-b border-[#1F2937]">
                <span className="text-sm text-[#F9FAFB]">{label}</span>
                <div className={`w-11 h-6 rounded-full relative cursor-pointer ${i < 3 ? 'bg-[#22C55E]' : 'bg-[#E2E8F0]'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${i < 3 ? 'left-[22px]' : 'left-0.5'}`} />
                </div>
              </label>
            ))}
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#F9FAFB] mb-4">Shipping Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs text-[#9CA3AF] mb-1.5">Default Rate</label><input type="text" defaultValue="5.99" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] focus:border-[#22C55E] outline-none" /></div>
              <div><label className="block text-xs text-[#9CA3AF] mb-1.5">Free Shipping Threshold</label><input type="text" defaultValue="50.00" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] focus:border-[#22C55E] outline-none" /></div>
            </div>
            <div><label className="block text-xs text-[#9CA3AF] mb-1.5">Processing Time</label><input type="text" defaultValue="1-2 business days" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] focus:border-[#22C55E] outline-none" /></div>
            <button className="px-6 py-2.5 bg-[#22C55E] text-white text-sm font-medium rounded-lg hover:bg-[#16A34A] transition-colors">Save Changes</button>
          </div>
        )}

        {activeTab === 'payout' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#F9FAFB] mb-4">Payout Settings</h3>
            <div><label className="block text-xs text-[#9CA3AF] mb-1.5">Payout Method</label><select className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] focus:border-[#22C55E] outline-none"><option>Bank Transfer</option><option>PayPal</option></select></div>
            <div><label className="block text-xs text-[#9CA3AF] mb-1.5">Payout Schedule</label><select className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] focus:border-[#22C55E] outline-none"><option>Weekly</option><option>Bi-weekly</option><option>Monthly</option></select></div>
            <button className="px-6 py-2.5 bg-[#22C55E] text-white text-sm font-medium rounded-lg hover:bg-[#16A34A] transition-colors">Save Changes</button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
