import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { Product } from '@/types';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist } from '@/store/slices/wishlistSlice';
import { addToast } from '@/store/slices/uiSlice';
import type { RootState } from '@/store';
import { getStockLabel, getStockStatus } from '@/lib/stock';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  const stockStatus = getStockStatus(product.stock);
  const stockLabel = getStockLabel(product.stock);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (stockStatus === 'out') {
      dispatch(addToast({ type: 'warning', message: `${product.name} is out of stock` }));
      return;
    }
    const existingQuantity = cartItems.find((item) => item.product.id === product.id)?.quantity || 0;
    if (existingQuantity >= product.stock) {
      dispatch(addToast({ type: 'warning', message: `${product.name} is out of stock` }));
      return;
    }
    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(addToast({ type: 'success', message: `${product.name} added to cart` }));
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    dispatch(addToast({ type: 'info', message: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist' }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-xl border border-[#E2E8F0] overflow-hidden transition-shadow duration-300 hover:shadow-lg"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-[#F8FAFC]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {discount > 0 && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-[#EF4444] text-white text-xs font-semibold rounded-md">
              -{discount}%
            </span>
          )}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
              isWishlisted ? 'bg-[#EF4444] text-white' : 'bg-white/80 text-[#64748B] hover:bg-white hover:text-[#EF4444]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs text-[#64748B] mb-1">{product.vendor}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-[#0F172A] line-clamp-2 mb-2 hover:text-[#22C55E] transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
          <span className="text-xs font-medium text-[#0F172A]">{product.rating}</span>
          <span className="text-xs text-[#94A3B8]">({product.reviewCount})</span>
        </div>

        <p className={`text-xs font-medium mb-3 ${stockStatus === 'out' ? 'text-[#EF4444]' : stockStatus === 'low' ? 'text-[#F59E0B]' : 'text-[#22C55E]'}`}>
          {stockLabel}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-[#22C55E]">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-[#94A3B8] line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={stockStatus === 'out'}
            className="w-8 h-8 rounded-lg bg-[#22C55E] text-white flex items-center justify-center hover:bg-[#16A34A] transition-colors active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
