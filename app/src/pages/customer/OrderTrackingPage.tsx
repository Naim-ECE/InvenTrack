import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ClipboardCheck, Cog, Truck, Home, CheckCircle } from 'lucide-react';
import { orders } from '@/data/mockData';

const trackingSteps = [
  { icon: ClipboardCheck, label: 'Order Placed', description: 'Your order has been received' },
  { icon: Cog, label: 'Processing', description: 'Your order is being prepared' },
  { icon: Package, label: 'Shipped', description: 'Your order is on the way' },
  { icon: Truck, label: 'Out for Delivery', description: 'Arriving today' },
  { icon: Home, label: 'Delivered', description: 'Package delivered' },
];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const order = orders.find((o) => o.id === id) || orders[0];
  const currentStep = order.status === 'delivered' ? 5 : order.status === 'shipped' ? 3 : order.status === 'processing' ? 2 : 1;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A] font-[Poppins] mb-1">Track Order</h1>
        <p className="text-sm text-[#64748B]">Order #{order.orderNumber}</p>
        <div className="mt-4 flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]' : 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]'}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          <span className="text-sm text-[#94A3B8]">Est. delivery: Oct 20, 2024</span>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#E2E8F0]">
          <motion.div className="w-full bg-[#22C55E]" initial={{ height: 0 }} animate={{ height: `${((currentStep - 1) / (trackingSteps.length - 1)) * 100}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
        </div>

        {trackingSteps.map((step, i) => {
          const Icon = step.icon;
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep - 1;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="relative flex items-start gap-4 mb-8 last:mb-0"
            >
              <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${isCompleted ? 'bg-[#22C55E]' : isCurrent ? 'bg-[#22C55E] ring-4 ring-[rgba(34,197,94,0.3)]' : 'bg-[#E2E8F0]'}`}>
                {isCompleted ? <CheckCircle className="w-5 h-5 text-white" /> : <Icon className={`w-5 h-5 ${isCurrent ? 'text-white' : 'text-[#94A3B8]'}`} />}
              </div>
              <div className="pt-1.5">
                <h4 className={`text-sm font-semibold ${isCompleted || isCurrent ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>{step.label}</h4>
                <p className="text-xs text-[#94A3B8] mt-0.5">{step.description}</p>
                {isCurrent && <p className="text-xs text-[#22C55E] mt-1 font-medium">In Progress</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
