import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Eye, Pencil, Trash2, Grid3X3, List } from 'lucide-react';
import api from '@/lib/api';

type LiveProduct = {
  _id: string;
  id?: string;
  name: string;
  sku: string;
  category: { name?: string } | string;
  price: number;
  stock: number;
  status: 'active' | 'pending' | 'draft' | 'rejected';
  image?: string;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-[rgba(34,197,94,0.15)]', text: 'text-[#22C55E]' },
  pending: { bg: 'bg-[rgba(245,158,11,0.15)]', text: 'text-[#F59E0B]' },
  draft: { bg: 'bg-[rgba(107,114,128,0.15)]', text: 'text-[#9CA3AF]' },
  rejected: { bg: 'bg-[rgba(239,68,68,0.15)]', text: 'text-[#EF4444]' },
};

export default function VendorProducts() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [products, setProducts] = useState<LiveProduct[]>([]);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const { data } = await api.get<{ products: LiveProduct[] }>('/api/products/vendor/mine');
        if (active) {
          setProducts(data.products);
        }
      } catch {
        if (active) {
          setProducts([]);
        }
      }
    };

    void loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(
    () => products.filter((product) => {
      if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter !== 'all' && product.status !== filter) return false;
      return true;
    }),
    [filter, products, search]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">My Products</h2>
          <p className="text-sm text-[#9CA3AF]">{filtered.length} products</p>
        </div>
        <Link to="/vendor/products/add" className="flex items-center gap-2 px-4 py-2.5 bg-[#22C55E] text-white text-sm font-medium rounded-lg hover:bg-[#16A34A] transition-colors">
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 bg-[#111827] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#22C55E] outline-none" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2.5 bg-[#111827] border border-[#2D3748] rounded-lg text-sm text-[#9CA3AF] focus:border-[#22C55E] outline-none">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="draft">Draft</option>
        </select>
        <div className="flex border border-[#2D3748] rounded-lg overflow-hidden">
          <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-[#22C55E] text-white' : 'text-[#9CA3AF]'}`}><Grid3X3 className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-[#22C55E] text-white' : 'text-[#9CA3AF]'}`}><List className="w-4 h-4" /></button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-[#111827] border border-[#2D3748] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#9CA3AF] text-xs uppercase tracking-wider border-b border-[#1F2937] bg-[#111827]">
                  <th className="text-left py-3 px-4">Product</th>
                  <th className="text-left py-3 px-4">SKU</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Stock</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const sc = statusColors[product.status] || statusColors.draft;
                  return (
                    <tr key={product._id || product.id} className="border-b border-[#1F2937] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image || ''} alt="" className="w-10 h-10 object-cover rounded-lg" />
                          <span className="text-[#F9FAFB] font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#9CA3AF]">{product.sku}</td>
                      <td className="py-3 px-4 text-[#9CA3AF]">{typeof product.category === 'string' ? product.category : product.category?.name || 'Category'}</td>
                      <td className="py-3 px-4 text-[#F9FAFB]">${product.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-[#F9FAFB]">{product.stock}</td>
                      <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>{product.status}</span></td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 text-[#9CA3AF] hover:text-[#3B82F6] hover:bg-[rgba(59,130,246,0.1)] rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                          <Link to={`/vendor/products/edit/${product.id}`} className="p-1.5 text-[#9CA3AF] hover:text-[#22C55E] hover:bg-[rgba(34,197,94,0.1)] rounded-lg transition-colors"><Pencil className="w-4 h-4" /></Link>
                          <button className="p-1.5 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((product, i) => (
            <motion.div key={product._id || product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-[#111827] border border-[#2D3748] rounded-xl overflow-hidden group">
              <div className="aspect-square overflow-hidden"><img src={product.image || ''} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>
              <div className="p-4">
                <h4 className="text-sm font-medium text-[#F9FAFB] mb-1">{product.name}</h4>
                <p className="text-sm text-[#22C55E] font-semibold">${product.price.toFixed(2)}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[product.status]?.bg} ${statusColors[product.status]?.text}`}>{product.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
