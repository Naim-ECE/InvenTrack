import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Printer } from 'lucide-react';
import api from '@/lib/api';

const tabs = ['All', 'New', 'Processing', 'Shipped', 'Delivered'];
const statusColors: Record<string, string> = {
  pending: 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]',
  processing: 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]',
  shipped: 'bg-[rgba(139,92,246,0.15)] text-[#8B5CF6]',
  delivered: 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]',
  cancelled: 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]',
};

type LiveOrder = {
  _id: string;
  id?: string;
  orderNumber: string;
  createdAt: string;
  customer: { name?: string } | string;
  items: { _id?: string; quantity: number }[];
  total: number;
  status: string;
};

export default function VendorOrders() {
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState<LiveOrder[]>([]);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      try {
        const { data } = await api.get<{ orders: LiveOrder[] }>('/api/orders/vendor');
        if (active) {
          setOrders(data.orders);
        }
      } catch {
        if (active) {
          setOrders([]);
        }
      }
    };

    void loadOrders();

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === 'All') return orders;
    return orders.filter((order) => {
      const normalized = order.status.toLowerCase();
      if (activeTab === 'New') return normalized === 'pending' || normalized === 'confirmed';
      if (activeTab === 'Processing') return normalized === 'packed';
      if (activeTab === 'Shipped') return normalized === 'shipped';
      if (activeTab === 'Delivered') return normalized === 'delivered';
      return true;
    });
  }, [activeTab, orders]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Orders</h2>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-[#22C55E] text-white' : 'bg-[#111827] text-[#9CA3AF] border border-[#2D3748] hover:bg-[#1F2937]'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-[#111827] border border-[#2D3748] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#9CA3AF] text-xs uppercase tracking-wider border-b border-[#1F2937]">
                <th className="text-left py-3 px-4">Order #</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Items</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <motion.tr key={order._id || order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-[#1F2937] hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-3 px-4 text-[#F9FAFB] font-medium">{order.orderNumber}</td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-[#F9FAFB]">{typeof order.customer === 'string' ? order.customer : order.customer?.name || 'Customer'}</td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{order.items.length} items</td>
                  <td className="py-3 px-4 text-[#F9FAFB] font-medium">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span></td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button className="p-1.5 text-[#9CA3AF] hover:text-[#3B82F6] hover:bg-[rgba(59,130,246,0.1)] rounded-lg"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-[#9CA3AF] hover:text-[#F9E0B] hover:bg-[rgba(245,158,11,0.1)] rounded-lg"><Printer className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
