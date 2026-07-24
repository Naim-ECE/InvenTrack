import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { BarChart3, ShoppingCart, Package, TrendingUp } from 'lucide-react';

const benefits = [
  'Reach 50,000+ active customers',
  'Manage inventory across multiple warehouses',
  'Track earnings with real-time analytics',
  'Scale operations with automated tools',
];

const floatingElements = [
  { icon: BarChart3, label: 'Revenue', value: '$12.4K', x: '-20%', y: '10%', color: '#22C55E' },
  { icon: ShoppingCart, label: 'Orders', value: '156', x: '85%', y: '20%', color: '#3B82F6' },
  { icon: Package, label: 'Products', value: '47', x: '90%', y: '60%', color: '#F59E0B' },
  { icon: TrendingUp, label: 'Growth', value: '+24%', x: '-15%', y: '65%', color: '#8B5CF6' },
];

export default function BecomeVendorSection() {
  return (
    <section className="bg-gradient-to-b from-[#0B1220] to-[#111827] py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-[#F9FAFB] font-[Poppins] mb-4">
              Grow Your Business With InvenTrack
            </h2>
            <p className="text-[#9CA3AF] mb-8 max-w-md">
              Join thousands of vendors who trust our platform to reach millions of customers while managing their inventory effortlessly.
            </p>

            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-[rgba(34,197,94,0.2)] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#22C55E]" />
                  </div>
                  <span className="text-sm text-[#F9FAFB]">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <Link
              to="/register"
              className="inline-flex items-center px-8 py-3.5 bg-[#22C55E] text-white font-medium rounded-xl hover:bg-[#16A34A] transition-colors shadow-lg shadow-[#22C55E]/25"
            >
              Apply as Vendor
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative hidden lg:block"
          >
            <div className="bg-[#111827] border border-[#2D3748] rounded-2xl p-6 shadow-2xl max-w-md mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-semibold text-[#F9FAFB]">Vendor Dashboard</h4>
                <span className="text-xs text-[#22C55E] bg-[rgba(34,197,94,0.15)] px-2 py-1 rounded-full">Live</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Revenue', value: '$12,450', change: '+12.5%' },
                  { label: 'Orders', value: '156', change: '+8.2%' },
                  { label: 'Products', value: '47', change: '+3' },
                  { label: 'Stock Alert', value: '5 items', change: '-2', warning: true },
                ].map((item, i) => (
                  <div key={i} className="bg-[#1F2937] rounded-lg p-3">
                    <p className="text-xs text-[#9CA3AF] mb-1">{item.label}</p>
                    <p className={`text-lg font-bold font-[Montserrat] ${item.warning ? 'text-[#F59E0B]' : 'text-[#F9FAFB]'}`}>{item.value}</p>
                    <p className={`text-xs ${item.warning ? 'text-[#F59E0B]' : 'text-[#22C55E]'}`}>{item.change}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#1F2937] rounded-lg p-3 h-24 flex items-end gap-1">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 80].map((h, i) => (
                  <div key={i} className="flex-1 bg-[#22C55E] rounded-sm opacity-80" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {floatingElements.map((el, i) => {
              const Icon = el.icon;
              return (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ left: el.x, top: el.y }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="bg-[#1F2937] border border-[#2D3748] rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
                    <Icon className="w-4 h-4" style={{ color: el.color }} />
                    <div>
                      <p className="text-[10px] text-[#9CA3AF]">{el.label}</p>
                      <p className="text-xs font-bold text-[#F9FAFB]">{el.value}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
