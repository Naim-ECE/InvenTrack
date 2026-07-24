import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { products } from '@/data/mockData';

const floatingCards = [
  { product: products[0], x: '8%', y: '18%', delay: 0, duration: 4 },
  { product: products[1], x: '82%', y: '12%', delay: 0.5, duration: 3.5 },
  { product: products[3], x: '5%', y: '58%', delay: 1, duration: 4.5 },
  { product: products[4], x: '78%', y: '50%', delay: 1.5, duration: 3 },
  { product: products[6], x: '72%', y: '72%', delay: 0.8, duration: 5 },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B1220]">
      <div className="absolute inset-0">
        <img src="/images/hero-bg.jpg" alt="Products" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/70 to-transparent" />
      </div>

      {floatingCards.map((card, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:block"
          style={{ left: card.x, top: card.y }}
          animate={{
            y: [0, -12, 0],
            rotate: [-2, 2, -2],
          }}
          transition={{
            duration: card.duration,
            delay: card.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="w-24 bg-white/10 backdrop-blur-xl rounded-xl border border-white/15 p-3 shadow-2xl">
            <img src={card.product.image} alt={card.product.name} className="w-full aspect-square object-cover rounded-lg mb-2" />
            <p className="text-[10px] text-white/90 font-medium truncate">{card.product.name}</p>
            <p className="text-[10px] text-[#22C55E] font-semibold">${card.product.price}</p>
          </div>
        </motion.div>
      ))}

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xs font-semibold uppercase tracking-[0.2em] text-[#22C55E] mb-6"
        >
          Premium Marketplace
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Poppins] text-[#F9FAFB] leading-tight mb-2"
        >
          EVERYTHING YOU NEED.
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold font-[Poppins] text-[#22C55E] leading-tight mb-6"
        >
          ONE MARKETPLACE.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-base sm:text-lg text-[#9CA3AF] max-w-xl mx-auto mb-10"
        >
          Shop smarter, manage inventory faster, and grow your business with InvenTrack.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#22C55E] text-white font-medium rounded-xl hover:bg-[#16A34A] transition-all duration-200 shadow-lg shadow-[#22C55E]/25 hover:shadow-xl hover:shadow-[#22C55E]/30"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-200"
          >
            Become a Vendor
          </Link>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="w-6 h-6 text-white/40" />
      </motion.div>
    </section>
  );
}
