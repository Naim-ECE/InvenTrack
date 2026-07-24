import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Store, Package, AlertTriangle, CheckCircle, Plus, Info } from 'lucide-react';
import DashboardCard from '@/components/ui/DashboardCard';
import LineChartComponent from '@/components/charts/LineChart';
import DoughnutChartComponent from '@/components/charts/DoughnutChart';
import api from '@/lib/api';

type LiveProduct = {
  _id: string;
  name: string;
  price: number;
  status: string;
  image?: string;
  category?: { name?: string } | string;
  vendor?: { storeName?: string } | string;
};

type LiveOrder = {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  customer?: { name?: string } | string;
};

type LiveVendor = {
  _id: string;
  storeName: string;
  isApproved?: boolean;
  user?: { name?: string; email?: string } | string;
};

type LiveNotification = {
  _id: string;
  type: 'order' | 'stock' | 'approval' | 'system' | 'success' | 'vendor' | 'product';
  title: string;
  message: string;
  read: boolean;
};

type DashboardResponse = {
  stats: { users: number; products: number; orders: number; vendors: number; revenue: number; lowStock: number };
  recentProducts: LiveProduct[];
  recentOrders: LiveOrder[];
  recentVendors: LiveVendor[];
  recentNotifications: LiveNotification[];
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0, vendors: 0, revenue: 0, lowStock: 0 });
  const [recentProducts, setRecentProducts] = useState<LiveProduct[]>([]);
  const [recentOrders, setRecentOrders] = useState<LiveOrder[]>([]);
  const [recentVendors, setRecentVendors] = useState<LiveVendor[]>([]);
  const [notifications, setNotifications] = useState<LiveNotification[]>([]);

  useEffect(() => {
    let active = true;

    const loadStats = async () => {
      try {
        const { data } = await api.get<DashboardResponse>('/api/analytics/dashboard');
        if (active) {
          setStats(data.stats);
          setRecentProducts(data.recentProducts || []);
          setRecentOrders(data.recentOrders || []);
          setRecentVendors(data.recentVendors || []);
          setNotifications(data.recentNotifications || []);
        }
      } catch {
        if (active) {
          setStats({ users: 0, products: 0, orders: 0, vendors: 0, revenue: 0, lowStock: 0 });
          setRecentProducts([]);
          setRecentOrders([]);
          setRecentVendors([]);
          setNotifications([]);
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

  const pendingVendors = recentVendors.filter((vendor) => !vendor.isApproved).length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-[#111827] to-[#1F2937] rounded-xl p-6 border border-[#2D3748]">
        <h3 className="text-lg font-semibold text-[#F9FAFB] font-[Poppins]">Platform Overview</h3>
        <p className="text-sm text-[#9CA3AF] mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard icon={DollarSign} iconColor="text-[#22C55E]" iconBg="bg-[rgba(34,197,94,0.15)]" label="Total Revenue" value={`$${stats.revenue.toFixed(2)}`} change="Live" changeType="up" index={0} />
        <DashboardCard icon={ShoppingCart} iconColor="text-[#3B82F6]" iconBg="bg-[rgba(59,130,246,0.15)]" label="Total Orders" value={`${stats.orders}`} change="Live" changeType="up" index={1} />
        <DashboardCard icon={Store} iconColor="text-[#8B5CF6]" iconBg="bg-[rgba(139,92,246,0.15)]" label="Active Vendors" value={`${stats.vendors}`} change="Live" changeType="neutral" index={2} />
        <DashboardCard icon={Package} iconColor="text-[#F59E0B]" iconBg="bg-[rgba(245,158,11,0.15)]" label="Total Products" value={`${stats.products}`} change="Live" changeType="up" index={3} />
        <DashboardCard icon={AlertTriangle} iconColor="text-[#EF4444]" iconBg="bg-[rgba(239,68,68,0.15)]" label="Low Stock" value={`${stats.lowStock}`} change="Live" changeType="down" index={4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Platform Revenue Trend</h4>
          <div className="h-64"><LineChartComponent labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']} data={[45, 52, 48, 61, 55, 67, 72, 68, 75, 82].map((v) => v * 10)} /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Orders by Status</h4>
          <div className="h-64"><DoughnutChartComponent labels={['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled']} data={[18, 32, 45, 88, 280, 12]} /></div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Recent Orders</h4>
          <div className="space-y-3">
            {recentOrders.slice(0, 4).map((order) => (
              <div key={order._id} className="flex items-center justify-between py-2 border-b border-[#1F2937] last:border-0">
                <div>
                  <p className="text-sm text-[#F9FAFB]">{order.orderNumber}</p>
                  <p className="text-xs text-[#9CA3AF]">{typeof order.customer === 'string' ? order.customer : order.customer?.name || 'Customer'}</p>
                </div>
                <span className="text-sm font-medium text-[#F9FAFB]">${order.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Recent Vendors</h4>
          <div className="space-y-3">
            {recentVendors.slice(0, 4).map((vendor) => (
              <div key={vendor._id} className="flex items-center justify-between p-3 bg-[#0B1220] rounded-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[rgba(245,158,11,0.15)] flex items-center justify-center"><Store className="w-4 h-4 text-[#F59E0B]" /></div>
                  <div className="min-w-0">
                    <p className="text-sm text-[#F9FAFB] truncate">{vendor.storeName}</p>
                    <p className="text-xs text-[#9CA3AF] truncate">{typeof vendor.user === 'string' ? vendor.user : vendor.user?.name || 'Vendor user'}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${vendor.isApproved ? 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]' : 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]'}`}>
                  {vendor.isApproved ? 'approved' : 'pending'}
                </span>
              </div>
            ))}
            {pendingVendors > 0 && <p className="text-xs text-[#9CA3AF]">{pendingVendors} vendor approvals pending</p>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Activity Feed</h4>
          <div className="space-y-3">
            {notifications.slice(0, 5).map((n) => {
              const icons: Record<string, { icon: typeof Plus; color: string }> = {
                order: { icon: Plus, color: '#3B82F6' },
                stock: { icon: AlertTriangle, color: '#F59E0B' },
                approval: { icon: CheckCircle, color: '#8B5CF6' },
                system: { icon: Info, color: '#6B7280' },
                success: { icon: CheckCircle, color: '#22C55E' },
                vendor: { icon: Store, color: '#8B5CF6' },
                product: { icon: Package, color: '#3B82F6' },
              };
              const ic = icons[n.type] || icons.system;
              const Icon = ic.icon;
              return (
                <div key={n._id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${ic.color}20` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: ic.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-[#F9FAFB] truncate">{n.title}</p>
                    <p className="text-xs text-[#9CA3AF]">{n.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Recent Products</h4>
          <div className="space-y-3">
            {recentProducts.slice(0, 5).map((product) => (
              <div key={product._id} className="flex items-center gap-3 border-b border-[#1F2937] pb-3 last:border-0 last:pb-0">
                <img src={product.image || ''} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-[#F9FAFB] truncate">{product.name}</p>
                  <p className="text-xs text-[#9CA3AF] truncate">{typeof product.vendor === 'string' ? product.vendor : product.vendor?.storeName || 'Vendor'} · {typeof product.category === 'string' ? product.category : product.category?.name || 'Category'}</p>
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
