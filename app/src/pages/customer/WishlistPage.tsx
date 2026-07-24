import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import type { RootState } from '@/store';
import ProductCard from '@/components/ui/ProductCard';

export default function WishlistPage() {
  const items = useSelector((state: RootState) => state.wishlist.items);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-12 h-12 text-[#CBD5E1]" />
        </div>
        <h2 className="text-xl font-bold text-[#0F172A] font-[Poppins] mb-2">Your Wishlist is Empty</h2>
        <p className="text-sm text-[#64748B] mb-6">Save items you love for later</p>
        <Link to="/shop" className="inline-flex items-center px-6 py-2.5 bg-[#22C55E] text-white font-medium rounded-lg hover:bg-[#16A34A] transition-colors">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#0F172A] font-[Poppins] mb-2">My Wishlist</h1>
      <p className="text-sm text-[#64748B] mb-6">{items.length} items</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
      </div>
    </div>
  );
}
