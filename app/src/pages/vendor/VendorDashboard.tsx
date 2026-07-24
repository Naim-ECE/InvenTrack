import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import DashboardCard from '@/components/ui/DashboardCard';
import LineChartComponent from '@/components/charts/LineChart';
import DoughnutChartComponent from '@/components/charts/DoughnutChart';
import api from '@/lib/api';

type LiveProduct = {
  _id: string;
  name: string;
  image?: string;
  price: number;
  rating: number;
  reviewCount: number;
  stock: number;
  lowStockThreshold?: number;
};

type LiveOrder = {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  customer?: { name?: string } | string;
};

type VendorDashboardResponse = {
  stats: { products: number; activeProducts: number; orders: number; revenue: number; lowStock: number; totalSold: number };
};

export default function VendorDashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, lowStock: 0 });
  const [products, setProducts] = useState<LiveProduct[]>([]);
  const [orders, setOrders] = useState<LiveOrder[]>([]);

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      try {
        const [{ data: dashboard }, { data: earnings }, { data: liveProducts }, { data: liveOrders }] = await Promise.all([
          api.get<VendorDashboardResponse>('/api/vendors/dashboard'),
          api.get<{ earnings: { gross: number } }>('/api/vendors/earnings'),
          api.get<{ products: LiveProduct[] }>('/api/products/vendor/mine'),
          api.get<{ orders: LiveOrder[] }>('/api/orders/vendor'),
        ]);

        if (!active) return;

        setStats({
          revenue: earnings.earnings.gross,
          orders: dashboard.stats.orders,
          products: dashboard.stats.products,
          lowStock: dashboard.stats.lowStock,
        });
        setProducts(liveProducts.products);
        setOrders(liveOrders.orders);
      } catch {
        if (active) {
          setStats({ revenue: 0, orders: 0, products: 0, lowStock: 0 });
          setProducts([]);
          setOrders([]);
        }
      }
    };

    void loadStats();

    const refreshTimer = window.setInterval(() => {
      void loadStats();
    }, 30000);

    return () => {
      active = false;
      window.clearInterval(refreshTimer);
    };
  }, []);

  const lowStockCount = stats.lowStock || products.filter((p) => p.stock <= (p.lowStockThreshold || 10)).length;

  const recentOrders = orders.slice(0, 5);
  const topProducts = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-[#111827] to-[#1F2937] rounded-xl p-6 border border-[#2D3748]">
        <h3 className="text-lg font-semibold text-[#F9FAFB] font-[Poppins]">Welcome back, Vendor!</h3>
        <p className="text-sm text-[#9CA3AF] mt-1">Here's what's happening with your store today.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard icon={DollarSign} iconColor="text-[#22C55E]" iconBg="bg-[rgba(34,197,94,0.15)]" label="Total Revenue" value={`$${stats.revenue.toFixed(2)}`} change="Live" changeType="up" index={0} />
        <DashboardCard icon={ShoppingCart} iconColor="text-[#3B82F6]" iconBg="bg-[rgba(59,130,246,0.15)]" label="Total Orders" value={`${stats.orders}`} change="Live" changeType="up" index={1} />
        <DashboardCard icon={Package} iconColor="text-[#F59E0B]" iconBg="bg-[rgba(245,158,11,0.15)]" label="Products" value={`${stats.products || products.length}`} change="Live" changeType="neutral" index={2} />
        <DashboardCard icon={AlertTriangle} iconColor="text-[#EF4444]" iconBg="bg-[rgba(239,68,68,0.15)]" label="Low Stock" value={`${lowStockCount} items`} change="Live" changeType="down" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-[#F9FAFB]">Sales Trend</h4>
            <div className="flex gap-1">
              {['7D', '30D', '90D'].map((p) => <button key={p} className={`px-2.5 py-1 text-xs rounded-md ${p === '30D' ? 'bg-[#22C55E] text-white' : 'text-[#9CA3AF] hover:bg-[#1F2937]'}`}>{p}</button>)}
            </div>
          </div>
          <div className="h-64">
            <LineChartComponent labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} data={[1200, 1900, 1500, 2200, 1800, 2800, 2400]} previous={[1000, 1600, 1300, 1800, 1500, 2200, 2000]} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Revenue Breakdown</h4>
          <div className="h-64">
            <DoughnutChartComponent labels={['Electronics', 'Fashion', 'Groceries', 'Home', 'Accessories', 'Office']} data={[35, 25, 15, 10, 8, 7]} centerText={`$${stats.revenue.toFixed(1)}`} />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Recent Orders</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#9CA3AF] text-xs uppercase tracking-wider border-b border-[#1F2937]">
                  <th className="text-left py-3 px-2">Order</th>
                  <th className="text-left py-3 px-2">Customer</th>
                  <th className="text-left py-3 px-2">Total</th>
                  <th className="text-left py-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-[#1F2937] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-3 px-2 text-[#F9FAFB]">#{order.orderNumber}</td>
                    <td className="py-3 px-2 text-[#9CA3AF]">{typeof order.customer === 'string' ? order.customer : order.customer?.name || 'Customer'}</td>
                    <td className="py-3 px-2 text-[#F9FAFB]">${order.total.toFixed(2)}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]' : order.status === 'processing' ? 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]' : 'bg-[rgba(59,130,246,0.15)] text-[#3B82F6]'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Top Products</h4>
          <div className="space-y-3">
            {topProducts.map((product) => (
                <div key={product._id} className="flex items-center gap-3">
                <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#F9FAFB] truncate">{product.name}</p>
                  <p className="text-xs text-[#9CA3AF]">{product.reviewCount} reviews</p>
                </div>
                <span className="text-sm font-medium text-[#22C55E]">${product.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
