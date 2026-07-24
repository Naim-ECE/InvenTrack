import { motion } from 'framer-motion';
import { BarChart3, ShieldCheck, Truck, LineChart, Warehouse, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const features: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: BarChart3, title: 'Smart Inventory Tracking', description: 'Real-time stock monitoring with automated alerts and forecasting.' },
  { icon: ShieldCheck, title: 'Verified Vendors', description: 'Every vendor is vetted and approved for quality assurance.' },
  { icon: Truck, title: 'Fast Delivery', description: 'Optimized logistics with same-day and next-day delivery options.' },
  { icon: LineChart, title: 'Real-Time Analytics', description: 'Comprehensive dashboards with actionable business insights.' },
  { icon: Warehouse, title: 'Warehouse Management', description: 'Multi-location inventory with seamless stock transfers.' },
  { icon: Lock, title: 'Secure Transactions', description: 'Bank-grade encryption and secure payment processing.' },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#0B1220] py-20">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-[#F9FAFB] font-[Poppins] mb-3">Why Choose InvenTrack</h2>
          <p className="text-[#9CA3AF]">Built for modern commerce — from storefront to warehouse</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, borderColor: '#22C55E' }}
                className="bg-[#111827] border border-[#2D3748] rounded-2xl p-8 text-center transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-[rgba(34,197,94,0.15)] flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-[#22C55E]" />
                </div>
                <h4 className="text-lg font-semibold text-[#F9FAFB] font-[Poppins] mb-2">{feature.title}</h4>
                <p className="text-sm text-[#9CA3AF]">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
