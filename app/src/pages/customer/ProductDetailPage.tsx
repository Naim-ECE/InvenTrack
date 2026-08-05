import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingCart, Truck, RotateCcw, ShieldCheck, Minus, Plus, CheckCircle } from 'lucide-react';
import { reviews } from '@/data/mockData';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { addToast } from '@/store/slices/uiSlice';
import type { RootState } from '@/store';
import ProductCard from '@/components/ui/ProductCard';
import { productApi } from '@/lib/apis/productApi';
import type { Product } from '@/types';
import { getStockLabel, getStockStatus } from '@/lib/stock';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isWishlisted = wishlistItems.some((item) => item.id === product?.id);

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      if (!id) return;

      try {
        const [liveProduct, liveProducts] = await Promise.all([
          productApi.getProductById(id),
          productApi.getProducts({ status: 'active', limit: 100 }),
        ]);

        if (!active) return;

        setProduct(liveProduct);
        setRelatedProducts(
          liveProducts.products.filter((item) => item.category === liveProduct.category && item.id !== liveProduct.id).slice(0, 4)
        );
        setQuantity(1);
      } catch {
        if (!active) return;
        setProduct(null);
        setRelatedProducts([]);
      }
    };

    void loadProduct();

    return () => {
      active = false;
    };
  }, [id]);

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-[#64748B]">Loading product...</div>;
  }

  const stockStatus = getStockStatus(product.stock);
  const stockLabel = getStockLabel(product.stock);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (stockStatus === 'out') {
      dispatch(addToast({ type: 'warning', message: `${product.name} is out of stock` }));
      return;
    }
    const existingQuantity = cartItems.find((item) => item.product.id === product.id)?.quantity || 0;
    if (existingQuantity + quantity > product.stock) {
      dispatch(addToast({ type: 'warning', message: `Only ${product.stock} items are available for ${product.name}` }));
      return;
    }
    if (quantity > product.stock) {
      dispatch(addToast({ type: 'warning', message: `Only ${product.stock} items are available for ${product.name}` }));
      return;
    }
    dispatch(addToCart({ product, quantity }));
    dispatch(addToast({ type: 'success', message: `${product.name} added to cart` }));
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
    dispatch(addToast({ type: 'info', message: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist' }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-[#64748B] mb-6">
          <Link to="/" className="hover:text-[#0F172A]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#0F172A]">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-[#0F172A]">{product.category}</Link>
          <span>/</span>
          <span className="text-[#0F172A] truncate">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-[#F8FAFC]">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-[#64748B]">{product.vendor}</span>
              <CheckCircle className="w-3.5 h-3.5 text-[#22C55E]" />
            </div>

            <h1 className="text-2xl font-bold text-[#0F172A] font-[Poppins] mb-2">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#E2E8F0]'}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-[#0F172A]">{product.rating}</span>
              <span className="text-sm text-[#94A3B8]">({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-[#0F172A]">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-[#94A3B8] line-through">${product.originalPrice.toFixed(2)}</span>
                  <span className="px-2 py-0.5 bg-[#EF4444]/10 text-[#EF4444] text-xs font-semibold rounded-md">Save {discount}%</span>
                </>
              )}
            </div>

            <p className="text-sm text-[#64748B] mb-6">{product.shortDescription || product.description}</p>

            <div className={`flex items-center gap-2 text-sm mb-6 ${stockStatus === 'in' ? 'text-[#22C55E]' : stockStatus === 'low' ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
              <div className={`w-2 h-2 rounded-full ${stockStatus === 'in' ? 'bg-[#22C55E]' : stockStatus === 'low' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`} />
              {stockLabel}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-[#E2E8F0] rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-[#F8FAFC] transition-colors"><Minus className="w-4 h-4 text-[#64748B]" /></button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button onClick={() => {
                  if (quantity >= product.stock) {
                    dispatch(addToast({ type: 'warning', message: `Only ${product.stock} items are available for ${product.name}` }));
                    return;
                  }
                  setQuantity(Math.min(product.stock, quantity + 1));
                }} className="p-2 hover:bg-[#F8FAFC] transition-colors"><Plus className="w-4 h-4 text-[#64748B]" /></button>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} disabled={stockStatus === 'out'} className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#22C55E] text-white font-medium rounded-xl hover:bg-[#16A34A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]">
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
              <button onClick={handleWishlist} className={`w-12 flex items-center justify-center rounded-xl border transition-colors ${isWishlisted ? 'bg-[#EF4444] border-[#EF4444] text-white' : 'border-[#E2E8F0] text-[#64748B] hover:border-[#EF4444] hover:text-[#EF4444]'}`}>
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[{ icon: Truck, text: 'Free Shipping' }, { icon: RotateCcw, text: 'Easy Returns' }, { icon: ShieldCheck, text: 'Secure Payment' }].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-[#E2E8F0] text-center">
                  <item.icon className="w-5 h-5 text-[#22C55E]" />
                  <span className="text-xs text-[#64748B]">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] mb-12">
          <div className="flex border-b border-[#E2E8F0]">
            {(['description', 'specs', 'reviews'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'text-[#22C55E] border-b-2 border-[#22C55E]' : 'text-[#64748B] hover:text-[#0F172A]'}`}>
                {tab === 'specs' ? 'Specifications' : tab}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === 'description' && <p className="text-sm text-[#64748B] leading-relaxed">{product.description}</p>}
            {activeTab === 'specs' && product.specifications && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-[#F1F5F9]">
                    <span className="text-sm text-[#64748B]">{key}</span>
                    <span className="text-sm font-medium text-[#0F172A]">{value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-[#F1F5F9] pb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-[#22C55E]/10 flex items-center justify-center text-sm font-semibold text-[#22C55E]">{review.userName[0]}</div>
                      <div>
                        <p className="text-sm font-medium text-[#0F172A]">{review.userName}</p>
                        <p className="text-xs text-[#94A3B8]">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex mb-1">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#E2E8F0]'}`} />)}
                    </div>
                    <p className="text-sm text-[#64748B]">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-[#0F172A] font-[Poppins] mb-6">You May Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
