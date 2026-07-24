import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { products } from '@/data/mockData';
import ProductCard from '@/components/ui/ProductCard';

export default function TopProductsSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h2 className="text-3xl font-bold text-[#0F172A] font-[Poppins] mb-2">Featured Products</h2>
            <p className="text-[#64748B]">Handpicked by our team, loved by customers</p>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#22C55E] hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
