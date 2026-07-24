import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Tag } from 'lucide-react';
import type { RootState } from '@/store';
import { updateQuantity, removeFromCart } from '@/store/slices/cartSlice';

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const [couponCode, setCouponCode] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-24 h-24 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-12 h-12 text-[#CBD5E1]" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A] font-[Poppins] mb-2">Your Cart is Empty</h2>
          <p className="text-sm text-[#64748B] mb-6">Browse our products and add items to your cart</p>
          <Link to="/shop" className="inline-flex items-center px-6 py-2.5 bg-[#22C55E] text-white font-medium rounded-lg hover:bg-[#16A34A] transition-colors">
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#0F172A] font-[Poppins] mb-2">Shopping Cart</h1>
      <p className="text-sm text-[#64748B] mb-6">{items.length} items</p>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex gap-4"
            >
              <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium text-[#0F172A]">{item.product.name}</h3>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{item.product.vendor}</p>
                  </div>
                  <button onClick={() => dispatch(removeFromCart({ productId: item.product.id }))} className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-[#E2E8F0] rounded-lg">
                    <button onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity - 1 }))} className="p-1.5 hover:bg-[#F8FAFC]"><Minus className="w-3.5 h-3.5 text-[#64748B]" /></button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ productId: item.product.id, quantity: item.quantity + 1 }))} className="p-1.5 hover:bg-[#F8FAFC]"><Plus className="w-3.5 h-3.5 text-[#64748B]" /></button>
                  </div>
                  <span className="text-base font-bold text-[#22C55E]">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-[#0F172A] font-[Poppins] mb-4">Order Summary</h3>

            <div className="relative mb-4">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code" className="w-full pl-9 pr-20 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:border-[#22C55E] outline-none" />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#22C55E] text-white text-xs font-medium rounded-md hover:bg-[#16A34A] transition-colors">Apply</button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-[#64748B]"><span>Subtotal</span><span className="text-[#0F172A]">${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-[#64748B]"><span>Shipping</span><span className={shipping === 0 ? 'text-[#22C55E]' : 'text-[#0F172A]'}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="flex justify-between text-[#64748B]"><span>Tax</span><span className="text-[#0F172A]">${tax.toFixed(2)}</span></div>
              <div className="border-t border-[#E2E8F0] pt-3 flex justify-between">
                <span className="font-semibold text-[#0F172A]">Total</span>
                <span className="text-xl font-bold text-[#0F172A]">${total.toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout" className="w-full mt-6 flex items-center justify-center gap-2 py-3 bg-[#22C55E] text-white font-medium rounded-xl hover:bg-[#16A34A] transition-colors">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <Link to="/shop" className="block text-center mt-3 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
