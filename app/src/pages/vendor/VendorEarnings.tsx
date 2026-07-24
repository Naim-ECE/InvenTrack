import { motion } from 'framer-motion';
import { DollarSign, Wallet, Clock, TrendingUp } from 'lucide-react';
import DashboardCard from '@/components/ui/DashboardCard';
import LineChartComponent from '@/components/charts/LineChart';
import { chartData } from '@/data/mockData';

export default function VendorEarnings() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Earnings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard icon={DollarSign} iconColor="text-[#22C55E]" iconBg="bg-[rgba(34,197,94,0.15)]" label="Total Earnings" value="$45,280" change="+18.2%" changeType="up" index={0} />
        <DashboardCard icon={Wallet} iconColor="text-[#3B82F6]" iconBg="bg-[rgba(59,130,246,0.15)]" label="Available Balance" value="$3,420" index={1} />
        <DashboardCard icon={Clock} iconColor="text-[#F59E0B]" iconBg="bg-[rgba(245,158,11,0.15)]" label="Pending Clearance" value="$1,250" index={2} />
        <DashboardCard icon={TrendingUp} iconColor="text-[#8B5CF6]" iconBg="bg-[rgba(139,92,246,0.15)]" label="Lifetime Sales" value="1,247" change="+24.1%" changeType="up" index={3} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
        <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Revenue Overview</h4>
        <div className="h-72">
          <LineChartComponent labels={chartData.monthlySales.labels} data={chartData.monthlySales.data} color="#22C55E" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
        <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Recent Transactions</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#9CA3AF] text-xs uppercase tracking-wider border-b border-[#1F2937]">
                <th className="text-left py-3 px-4">Order</th>
                <th className="text-left py-3 px-4">Amount</th>
                <th className="text-left py-3 px-4">Fee</th>
                <th className="text-left py-3 px-4">Net</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {[{ order: '#INV-001247', amount: 234.98, fee: 23.50, net: 211.48, date: 'Oct 15, 2024' }, { order: '#INV-001198', amount: 263.43, fee: 26.34, net: 237.09, date: 'Oct 10, 2024' }, { order: '#INV-001056', amount: 55.96, fee: 5.60, net: 50.36, date: 'Oct 5, 2024' }].map((t, i) => (
              <tr key={i} className="border-b border-[#1F2937] hover:bg-[rgba(255,255,255,0.02)]">
                <td className="py-3 px-4 text-[#F9FAFB]">{t.order}</td>
                <td className="py-3 px-4 text-[#F9FAFB]">${t.amount.toFixed(2)}</td>
                <td className="py-3 px-4 text-[#EF4444]">-${t.fee.toFixed(2)}</td>
                <td className="py-3 px-4 text-[#22C55E] font-medium">${t.net.toFixed(2)}</td>
                <td className="py-3 px-4 text-[#9CA3AF]">{t.date}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
