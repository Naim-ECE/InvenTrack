import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { categories as mockCategories } from '@/data/mockData';
import ProductCard from '@/components/ui/ProductCard';
import { productApi } from '@/lib/apis/productApi';
import type { Category, Product } from '@/types';
import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';

export default function ShopPage() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState(1000);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const [{ products: liveProducts }, liveCategories] = await Promise.all([
          productApi.getProducts({ status: 'active', limit: 100 }),
          productApi.getCategories().catch(() => mockCategories),
        ]);

        if (!active) return;
        setProducts(liveProducts);
        setCategories(liveCategories);
      } catch {
        if (!active) return;
        setProducts([]);
        setCategories(mockCategories);
        dispatch(addToast({ type: 'warning', message: 'Using fallback product data while loading catalog' }));
      }
    };

    void loadProducts();

    return () => {
      active = false;
    };
  }, [dispatch]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (selectedCategory !== 'All') result = result.filter((p) => p.category === selectedCategory);
    result = result.filter((p) => p.price <= priceRange);
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [search, selectedCategory, sortBy, priceRange]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white border-b border-[#E2E8F0] py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-[#64748B] mb-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-[#0F172A]">Shop</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] font-[Poppins]">All Products</h1>
          <p className="text-sm text-[#64748B]">Showing {filtered.length} of {products.length} products</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-[#0F172A] mb-3">Search</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:border-[#22C55E] outline-none transition-colors" />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#0F172A] mb-3">Categories</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="category" checked={selectedCategory === 'All'} onChange={() => setSelectedCategory('All')} className="text-[#22C55E] focus:ring-[#22C55E]" />
                    <span className="text-sm text-[#64748B]">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id || (cat as { _id?: string })._id || cat.name} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="category" checked={selectedCategory === cat.name} onChange={() => setSelectedCategory(cat.name)} className="text-[#22C55E] focus:ring-[#22C55E]" />
                      <span className="text-sm text-[#64748B]">{cat.name} ({cat.productCount})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#0F172A] mb-3">Max Price: ${priceRange}</h4>
                <input type="range" min="0" max="1000" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full accent-[#22C55E]" />
                <div className="flex justify-between text-xs text-[#94A3B8] mt-1">
                  <span>$0</span>
                  <span>$1000</span>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="bg-white rounded-xl border border-[#E2E8F0] px-4 py-3 flex flex-wrap items-center justify-between gap-3 mb-6">
              <span className="text-sm text-[#64748B]">{filtered.length} results</span>
              <div className="flex items-center gap-3">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 focus:border-[#22C55E] outline-none">
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Best Rated</option>
                </select>
                <div className="flex border border-[#E2E8F0] rounded-lg overflow-hidden">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-[#22C55E] text-white' : 'bg-white text-[#64748B]'}`}><Grid3X3 className="w-4 h-4" /></button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-[#22C55E] text-white' : 'bg-white text-[#64748B]'}`}><List className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {filtered.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {filtered.map((product, i) => (
                  viewMode === 'grid' ? (
                    <ProductCard key={product.id} product={product} index={i} />
                  ) : (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex gap-4 hover:shadow-md transition-shadow"
                    >
                      <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#64748B]">{product.vendor}</p>
                        <h3 className="text-sm font-medium text-[#0F172A] truncate">{product.name}</h3>
                        <p className="text-xs text-[#94A3B8] mt-1 line-clamp-1">{product.shortDescription}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-base font-bold text-[#22C55E]">${product.price.toFixed(2)}</span>
                          <span className={`text-xs ${product.stock === 0 ? 'text-[#EF4444]' : product.stock < 8 ? 'text-[#F59E0B]' : 'text-[#94A3B8]'}`}>
                            {product.stock === 0 ? 'Out of stock' : product.stock < 8 ? `Low stock: ${product.stock}` : `Stock: ${product.stock}`}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <SlidersHorizontal className="w-12 h-12 text-[#E2E8F0] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#0F172A] mb-2">No products found</h3>
                <p className="text-sm text-[#64748B]">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
