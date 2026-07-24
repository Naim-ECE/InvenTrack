import { motion } from 'framer-motion';
import LineChartComponent from '@/components/charts/LineChart';
import BarChartComponent from '@/components/charts/BarChart';
import DoughnutChartComponent from '@/components/charts/DoughnutChart';
import { chartData } from '@/data/mockData';

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Platform Analytics</h2>
        <div className="flex gap-1">
          {['Today', '7D', '30D', '90D', '1Y'].map((p) => <button key={p} className={`px-3 py-1.5 text-xs rounded-lg ${p === '30D' ? 'bg-[#22C55E] text-white' : 'bg-[#111827] text-[#9CA3AF] border border-[#2D3748]'}`}>{p}</button>)}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[{ label: 'Total Revenue', value: '$245K' }, { label: 'Total Orders', value: '3,420' }, { label: 'Avg Order Value', value: '$71.60' }, { label: 'Conversion Rate', value: '3.8%' }, { label: 'Active Users', value: '12.5K' }, { label: 'New Signups', value: '+890' }].map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-4 text-center">
            <p className="text-xs text-[#9CA3AF] uppercase tracking-wider">{m.label}</p>
            <p className="text-lg font-bold text-[#F9FAFB] font-[Montserrat] mt-1">{m.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Revenue Trend</h4>
          <div className="h-64"><LineChartComponent labels={chartData.monthlySales.labels} data={chartData.monthlySales.data.map((v) => v * 10)} color="#22C55E" /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Monthly Sales</h4>
          <div className="h-64"><BarChartComponent labels={chartData.monthlySales.labels} data={chartData.monthlySales.data.map((v) => v * 8)} /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Top Products</h4>
          <div className="h-64"><BarChartComponent labels={chartData.topProducts.labels} data={chartData.topProducts.data.map((v) => v * 15)} horizontal /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Category Performance</h4>
          <div className="h-64"><DoughnutChartComponent labels={chartData.revenueByCategory.labels} data={chartData.revenueByCategory.data} /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Order Statistics</h4>
          <div className="h-64"><LineChartComponent labels={chartData.salesTrend.labels} data={[45, 52, 48, 61, 55, 67, 72]} color="#3B82F6" /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Vendor Performance</h4>
          <div className="h-64"><BarChartComponent labels={['TechHub', 'StyleVault', 'GreenGrocer', 'AudioMax', 'FitFoot', 'BeanBros']} data={[92, 88, 95, 78, 85, 90]} color="#8B5CF6" /></div>
        </motion.div>
      </div>
    </div>
  );
}
