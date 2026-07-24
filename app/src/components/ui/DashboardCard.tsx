import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  index?: number;
}

export default function DashboardCard({ icon: Icon, iconColor, iconBg, label, value, change, changeType = 'up', index = 0 }: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -2, borderColor: '#374151' }}
      className="bg-[#111827] border border-[#2D3748] rounded-xl p-5 transition-colors duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-medium ${changeType === 'up' ? 'text-[#22C55E]' : changeType === 'down' ? 'text-[#EF4444]' : 'text-[#9CA3AF]'}`}>
            {changeType === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : changeType === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> : null}
            {change}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-[#F9FAFB] font-[Montserrat]">{value}</p>
      <p className="text-xs text-[#9CA3AF] mt-1 uppercase tracking-wider">{label}</p>
    </motion.div>
  );
}
