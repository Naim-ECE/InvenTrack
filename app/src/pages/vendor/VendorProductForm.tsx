import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { productApi } from '@/lib/apis/productApi';

export default function VendorProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    category: 'Electronics',
    stock: '',
    sku: '',
  });

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      if (!isEdit || !id) return;

      try {
        const product = await productApi.getProductById(id);
        if (!active) return;

        setForm({
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription || '',
          price: String(product.price),
          originalPrice: product.originalPrice ? String(product.originalPrice) : '',
          category: product.category,
          stock: String(product.stock),
          sku: product.sku,
        });
      } catch {
        if (active) {
          toast.error('Failed to load product');
        }
      }
    };

    void loadProduct();

    return () => {
      active = false;
    };
  }, [id, isEdit, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      let uploadedImageUrl = '';
      if (imageFile) {
        const uploaded = await productApi.uploadProductImage(imageFile, 'vendor-products');
        uploadedImageUrl = uploaded.url;
      }

      const payload = {
        name: form.name,
        description: form.description,
        shortDescription: form.shortDescription,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        category: form.category,
        sku: form.sku,
        stock: Number(form.stock),
        lowStockThreshold: 8,
        images: uploadedImageUrl ? [uploadedImageUrl] : undefined,
        status: 'pending' as const,
      };

      if (isEdit && id) {
        await productApi.updateProduct(id, payload);
        toast.success('Product updated!');
      } else {
        await productApi.createProduct(payload);
        toast.success('Product submitted for approval!');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
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
            <div>
              <label className="block text-xs text-[#9CA3AF] mb-1.5">Short Description</label>
              <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} placeholder="Short product summary" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#22C55E] outline-none" />
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
          <div className="mt-4">
            <label className="block text-xs text-[#9CA3AF] mb-1.5">Original Price</label>
            <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} placeholder="Optional" className="w-full px-4 py-2.5 bg-[#0B1220] border border-[#2D3748] rounded-lg text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:border-[#22C55E] outline-none" />
          </div>
        </div>

        <div className="bg-[#111827] border border-[#2D3748] rounded-xl p-6">
          <h3 className="text-sm font-semibold text-[#F9FAFB] mb-4 uppercase tracking-wider">Product Images</h3>
          <label className="block border-2 border-dashed border-[#2D3748] rounded-xl p-8 text-center hover:border-[#22C55E]/50 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-[#6B7280] mx-auto mb-3" />
            <p className="text-sm text-[#9CA3AF]">Drag & drop or click to upload</p>
            <p className="text-xs text-[#6B7280] mt-1">PNG, JPG up to 5MB</p>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </label>
          {imageFile && <p className="text-xs text-[#9CA3AF] mt-2">Selected: {imageFile.name}</p>}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#22C55E] text-white font-medium rounded-lg hover:bg-[#16A34A] transition-colors disabled:opacity-50">{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Submit for Approval'}</button>
          <Link to="/vendor/products" className="px-6 py-2.5 border border-[#2D3748] text-[#9CA3AF] font-medium rounded-lg hover:bg-[#1F2937] transition-colors">Cancel</Link>
        </div>
      </motion.form>
    </div>
  );
}
