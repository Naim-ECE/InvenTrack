import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

export default function VendorProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const toast = useToast();
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Electronics', stock: '', sku: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isEdit ? 'Product updated!' : 'Product submitted for approval!');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/vendor/products" className="p-2 hover:bg-[#1F2937] rounded-lg text-[#9CA3AF] transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <h2 className="text-xl font-semibold text-[#F9FAFB] font-[Poppins]">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
      </div>

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#111827] border border-[#2D3748] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F9FAFB] mb-4 uppercase tracking-wider">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1.5">Product Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter product name" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#22C55E] outline-none" />
            </div>
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1.5">Description *</label>
              <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Enter product description" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#22C55E] outline-none resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1.5">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] focus:border-[#22C55E] outline-none">
                  {['Electronics', 'Fashion', 'Groceries', 'Home & Living', 'Accessories', 'Office Equipment'].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#9CA3AF] mb-1.5">SKU *</label>
                <input type="text" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="MRP-001" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#22C55E] outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#2D3748] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F9FAFB] mb-4 uppercase tracking-wider">Pricing & Inventory</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1.5">Regular Price *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#22C55E] outline-none" />
            </div>
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1.5">Stock Quantity *</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="0" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#22C55E] outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#2D3748] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F9FAFB] mb-4 uppercase tracking-wider">Product Images</h3>
          <div className="border-2 border-dashed border-[#2D3748] rounded-xl p-8 text-center hover:border-[#22C55E]/50 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-[#6B7280] mx-auto mb-3" />
            <p className="text-sm text-[#9CA3AF]">Drag & drop or click to upload</p>
            <p className="text-xs text-[#6B7280] mt-1">PNG, JPG up to 5MB</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="px-6 py-2.5 bg-[#22C55E] text-white font-medium rounded-lg hover:bg-[#16A34A] transition-colors">{isEdit ? 'Save Changes' : 'Submit for Approval'}</button>
          <Link to="/vendor/products" className="px-6 py-2.5 border border-[#2D3748] text-[#9CA3AF] font-medium rounded-lg hover:bg-[#1F2937] transition-colors">Cancel</Link>
        </div>
      </motion.form>
    </div>
  );
}
