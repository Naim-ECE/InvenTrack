import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, CreditCard, Truck, Mail, Shield } from 'lucide-react';

const tabs = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Platform Settings</h2>

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
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#F9FAFB] mb-4">General Settings</h3>
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1.5">Platform Name</label>
              <input type="text" defaultValue="InvenTrack" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] focus:border-[#22C55E] outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs text-[#9CA3AF] mb-1.5">Default Currency</label><select className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] outline-none"><option>USD ($)</option><option>EUR</option><option>GBP</option></select></div>
              <div><label className="block text-xs text-[#9CA3AF] mb-1.5">Timezone</label><select className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] outline-none"><option>UTC-5 (Eastern)</option><option>UTC-8 (Pacific)</option></select></div>
            </div>
            <label className="flex items-center gap-3 py-3">
              <span className="text-sm text-[#F9FAFB]">Maintenance Mode</span>
              <div className="w-11 h-6 rounded-full bg-[#E2E8F0] relative cursor-pointer"><div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow" /></div>
            </label>
            <button className="px-6 py-2.5 bg-[#22C55E] text-white text-sm font-medium rounded-lg hover:bg-[#16A34A]">Save Changes</button>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#F9FAFB] mb-4">Payment Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs text-[#9CA3AF] mb-1.5">Commission Rate (%)</label><input type="number" defaultValue="10" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] outline-none" /></div>
              <div><label className="block text-xs text-[#9CA3AF] mb-1.5">Tax Rate (%)</label><input type="number" defaultValue="8" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] outline-none" /></div>
            </div>
            <button className="px-6 py-2.5 bg-[#22C55E] text-white text-sm font-medium rounded-lg hover:bg-[#16A34A]">Save Changes</button>
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#F9FAFB] mb-4">Shipping Settings</h3>
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1.5">Free Shipping Threshold</label>
              <input type="number" defaultValue="50" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] outline-none" />
            </div>
            <button className="px-6 py-2.5 bg-[#22C55E] text-white text-sm font-medium rounded-lg hover:bg-[#16A34A]">Save Changes</button>
          </div>
        )}

        {activeTab === 'email' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#F9FAFB] mb-4">Email Configuration</h3>
            <div><label className="block text-xs text-[#9CA3AF] mb-1.5">SMTP Host</label><input type="text" defaultValue="smtp.example.com" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] outline-none" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs text-[#9CA3AF] mb-1.5">Port</label><input type="text" defaultValue="587" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] outline-none" /></div>
              <div><label className="block text-xs text-[#9CA3AF] mb-1.5">From Email</label><input type="email" defaultValue="noreply@inventrack.com" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] outline-none" /></div>
            </div>
            <button className="px-6 py-2.5 bg-[#22C55E] text-white text-sm font-medium rounded-lg hover:bg-[#16A34A]">Save Changes</button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[#F9FAFB] mb-4">Security Settings</h3>
            {['Require 2FA for admins', 'Enforce strong passwords', 'Limit login attempts', 'Enable audit logging'].map((label, i) => (
              <label key={i} className="flex items-center justify-between py-3 border-b border-[#1F2937]">
                <span className="text-sm text-[#F9FAFB]">{label}</span>
                <div className={`w-11 h-6 rounded-full relative cursor-pointer ${i < 2 ? 'bg-[#22C55E]' : 'bg-[#E2E8F0]'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${i < 2 ? 'left-[22px]' : 'left-0.5'}`} />
                </div>
              </label>
            ))}
            <button className="px-6 py-2.5 bg-[#22C55E] text-white text-sm font-medium rounded-lg hover:bg-[#16A34A]">Save Changes</button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
