import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories } from '@/data/mockData';

export default function FeaturedCategories() {
  return (
    <section className="bg-[#F8FAFC] py-20">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-[#0F172A] font-[Poppins] mb-3">Shop by Category</h2>
          <p className="text-[#64748B]">Explore our curated collections across every department</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[180px]">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
                i === 0 ? 'col-span-2 row-span-2' : i === 5 ? 'col-span-2' : ''
              }`}
            >
              <Link to={`/shop?category=${cat.slug}`}>
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="text-lg font-semibold text-white font-[Poppins]">{cat.name}</h3>
                  <p className="text-sm text-white/80">{cat.productCount} products</p>
                  <span className="inline-block mt-2 text-sm text-[#22C55E] font-medium opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300">
                    Shop Now &rarr;
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
