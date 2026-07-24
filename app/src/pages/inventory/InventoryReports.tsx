import { motion } from 'framer-motion';
import { FileBarChart, Settings2, Package, Truck, DollarSign, AlertTriangle } from 'lucide-react';

const reports = [
  { icon: Package, title: 'Stock Levels', description: 'Current inventory snapshot by warehouse', color: '#22C55E' },
  { icon: FileBarChart, title: 'Movement Log', description: 'All stock movements with filters', color: '#3B82F6' },
  { icon: DollarSign, title: 'Valuation Report', description: 'Inventory value by category/warehouse', color: '#8B5CF6' },
  { icon: AlertTriangle, title: 'Low Stock Summary', description: 'All items below threshold', color: '#F59E0B' },
  { icon: Truck, title: 'Supplier Performance', description: 'Delivery metrics by supplier', color: '#EC4899' },
  { icon: Settings2, title: 'Custom Report', description: 'Build your own with filters', color: '#6B7280' },
];

export default function InventoryReports() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Reports</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report, i) => {
          const Icon = report.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#111827] border border-[#2D3748] rounded-xl p-5 hover:border-[#374151] transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${report.color}20` }}>
                <Icon className="w-5 h-5" style={{ color: report.color }} />
              </div>
              <h4 className="text-sm font-semibold text-[#F9FAFB] mb-1">{report.title}</h4>
              <p className="text-xs text-[#9CA3AF]">{report.description}</p>
              <div className="flex gap-2 mt-4">
                <button className="px-3 py-1.5 bg-[#22C55E] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">Generate</button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
