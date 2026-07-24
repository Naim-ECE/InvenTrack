import { motion } from 'framer-motion';
import { FileBarChart, FileText, Calendar, TrendingUp, Users, Package, DollarSign } from 'lucide-react';

const reports = [
  { icon: DollarSign, title: 'Revenue Report', description: 'Platform revenue breakdown by period', color: '#22C55E' },
  { icon: TrendingUp, title: 'Sales Report', description: 'Sales performance across categories', color: '#3B82F6' },
  { icon: Package, title: 'Inventory Report', description: 'Stock levels and movements', color: '#F59E0B' },
  { icon: Users, title: 'Vendor Performance', description: 'Vendor metrics and rankings', color: '#8B5CF6' },
  { icon: FileBarChart, title: 'Customer Analytics', description: 'User behavior and retention', color: '#EC4899' },
  { icon: FileText, title: 'Custom Report', description: 'Build a custom report', color: '#6B7280' },
];

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Reports</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report, i) => {
          const Icon = report.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-5 hover:border-[#374151] transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${report.color}20` }}>
                <Icon className="w-5 h-5" style={{ color: report.color }} />
              </div>
              <h4 className="text-sm font-semibold text-[#F9FAFB] mb-1">{report.title}</h4>
              <p className="text-xs text-[#9CA3AF]">{report.description}</p>
              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="px-3 py-1.5 bg-[#22C55E] text-white text-xs rounded-lg">Generate</button>
                <button className="px-3 py-1.5 border border-[#2D3748] text-[#9CA3AF] text-xs rounded-lg">Schedule</button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#111827] border border-[#2D3748] rounded-xl p-6">
        <h3 className="text-sm font-semibold text-[#F9FAFB] mb-4">Scheduled Reports</h3>
        <div className="space-y-3">
          {[{ name: 'Weekly Revenue Summary', frequency: 'Weekly', lastSent: 'Oct 20, 2024' }, { name: 'Monthly Vendor Report', frequency: 'Monthly', lastSent: 'Oct 1, 2024' }].map((r, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-[#1F2937] last:border-0">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                <div>
                  <p className="text-sm text-[#F9FAFB]">{r.name}</p>
                  <p className="text-xs text-[#9CA3AF]">{r.frequency} — Last sent: {r.lastSent}</p>
                </div>
              </div>
              <button className="px-3 py-1.5 border border-[#2D3748] text-[#9CA3AF] text-xs rounded-lg hover:bg-[#1F2937]">Edit</button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
