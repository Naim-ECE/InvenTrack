import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Eye } from 'lucide-react';
import { orders } from '@/data/mockData';

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-[rgba(59,130,246,0.15)]', text: 'text-[#3B82F6]' },
  processing: { bg: 'bg-[rgba(245,158,11,0.15)]', text: 'text-[#F59E0B]' },
  shipped: { bg: 'bg-[rgba(139,92,246,0.15)]', text: 'text-[#8B5CF6]' },
  delivered: { bg: 'bg-[rgba(34,197,94,0.15)]', text: 'text-[#22C55E]' },
  cancelled: { bg: 'bg-[rgba(239,68,68,0.15)]', text: 'text-[#EF4444]' },
};

const tabs = ['All', 'Processing', 'Shipped', 'Delivered'];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const filtered = activeTab === 'All' ? orders : orders.filter((o) => o.status.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#0F172A] font-[Poppins] mb-6">My Orders</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-[#22C55E] text-white' : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'}`}>
            {tab}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((order, i) => {
            const statusStyle = statusColors[order.status] || statusColors.pending;
            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-sm font-semibold text-[#0F172A]">#{order.orderNumber}</span>
                    <span className="text-xs text-[#94A3B8] ml-3">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>{order.status}</span>
                </div>
                <div className="px-5 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <img key={idx} src={item.product.image} alt="" className="w-12 h-12 object-cover rounded-lg" />
                    ))}
                    {order.items.length > 3 && <span className="text-xs text-[#64748B]">+{order.items.length - 3} more</span>}
                  </div>
                </div>
                <div className="px-5 py-3 border-t border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#0F172A]">${order.total.toFixed(2)}</span>
                  <div className="flex gap-2">
                    <Link to={`/orders/${order.id}/track`} className="flex items-center gap-1 px-3 py-1.5 bg-[#22C55E] text-white text-xs font-medium rounded-lg hover:bg-[#16A34A] transition-colors">
                      <Eye className="w-3.5 h-3.5" /> Track
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-[#E2E8F0] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#0F172A] mb-2">No orders yet</h3>
          <p className="text-sm text-[#64748B]">Start shopping to see your orders here</p>
          <Link to="/shop" className="inline-block mt-4 px-6 py-2.5 bg-[#22C55E] text-white font-medium rounded-lg hover:bg-[#16A34A] transition-colors">Start Shopping</Link>
        </div>
      )}
    </div>
  );
}
