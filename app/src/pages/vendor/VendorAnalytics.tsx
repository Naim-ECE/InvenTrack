import { motion } from 'framer-motion';
import LineChartComponent from '@/components/charts/LineChart';
import BarChartComponent from '@/components/charts/BarChart';
import DoughnutChartComponent from '@/components/charts/DoughnutChart';
import { chartData } from '@/data/mockData';

export default function VendorAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Analytics</h2>
        <div className="flex gap-1">
          {['7D', '30D', '90D', '1Y'].map((p) => <button key={p} className={`px-3 py-1.5 text-xs rounded-lg ${p === '30D' ? 'bg-[#22C55E] text-white' : 'bg-[#111827] text-[#9CA3AF] border border-[#2D3748]'}`}>{p}</button>)}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ label: 'Conversion Rate', value: '3.2%', change: '+0.4%' }, { label: 'Avg Order Value', value: '$87.50', change: '+5.2%' }, { label: 'Return Rate', value: '2.1%', change: '-0.8%' }, { label: 'Customer Rating', value: '4.6', change: '+0.1' }].map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-4">
            <p className="text-xs text-[#9CA3AF] uppercase tracking-wider">{m.label}</p>
            <p className="text-2xl font-bold text-[#F9FAFB] font-[Montserrat] mt-1">{m.value}</p>
            <p className="text-xs text-[#22C55E] mt-1">{m.change}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Sales Trend</h4>
          <div className="h-64"><LineChartComponent labels={chartData.monthlySales.labels} data={chartData.monthlySales.data} previous={chartData.salesTrend.previous} /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Revenue by Category</h4>
          <div className="h-64"><DoughnutChartComponent labels={chartData.revenueByCategory.labels} data={chartData.revenueByCategory.data} /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Top Products</h4>
          <div className="h-64"><BarChartComponent labels={chartData.topProducts.labels} data={chartData.topProducts.data} horizontal /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5">
          <h4 className="text-sm font-semibold text-[#F9FAFB] mb-4">Customer Growth</h4>
          <div className="h-64"><LineChartComponent labels={chartData.customerGrowth.labels} data={chartData.customerGrowth.data} color="#3B82F6" /></div>
        </motion.div>
      </div>
    </div>
  );
}
