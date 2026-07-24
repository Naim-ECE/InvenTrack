import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/api';

type LiveProduct = {
  _id: string;
  id?: string;
  name: string;
  vendor: { storeName?: string } | string;
  category: { name?: string } | string;
  price: number;
  status: 'active' | 'pending' | 'draft' | 'rejected';
  image?: string;
};

const statusColors: Record<string, string> = {
  active: 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]',
  pending: 'bg-[rgba(245,158,11,0.15)] text-[#F59E0B]',
  rejected: 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]',
  draft: 'bg-[rgba(107,114,128,0.15)] text-[#9CA3AF]',
};

const tabs = ['All', 'Pending Review', 'Approved', 'Rejected'];

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState('All');
  const [products, setProducts] = useState<LiveProduct[]>([]);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        const { data } = await api.get<{ products: LiveProduct[] }>('/api/products');
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

  const filtered = useMemo(() => {
    if (activeTab === 'All') return products;
    if (activeTab === 'Approved') return products.filter((product) => product.status === 'active');
    if (activeTab === 'Pending Review') return products.filter((product) => product.status === 'pending');
    if (activeTab === 'Rejected') return products.filter((product) => product.status === 'rejected');
    return products;
  }, [activeTab, products]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">Products</h2>
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-[#22C55E] text-white' : 'bg-[#111827] text-[#9CA3AF] border border-[#2D3748]'}`}>{tab}</button>)}
      </div>

      <div className="bg-[#111827] border border-[#2D3748] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[#9CA3AF] text-xs uppercase tracking-wider border-b border-[#1F2937]">
                <th className="text-left py-3 px-4">Product</th>
                <th className="text-left py-3 px-4">Vendor</th>
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr key={p._id || p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-[#1F2937] hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image || ''} alt="" className="w-10 h-10 object-cover rounded-lg" />
                      <span className="text-[#F9FAFB] font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{typeof p.vendor === 'string' ? p.vendor : p.vendor?.storeName || 'Vendor'}</td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{typeof p.category === 'string' ? p.category : p.category?.name || 'Category'}</td>
                  <td className="py-3 px-4 text-[#F9FAFB]">${p.price.toFixed(2)}</td>
                  <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.status]}`}>{p.status}</span></td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <button className="p-1.5 text-[#9CA3AF] hover:text-[#3B82F6] hover:bg-[rgba(59,130,246,0.1)] rounded-lg"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-[#9CA3AF] hover:text-[#22C55E] hover:bg-[rgba(34,197,94,0.1)] rounded-lg"><CheckCircle className="w-4 h-4" /></button>
                      <button className="p-1.5 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] rounded-lg"><XCircle className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
