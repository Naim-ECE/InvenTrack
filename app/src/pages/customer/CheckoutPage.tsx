import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronRight, CreditCard, MapPin, ShoppingBag } from 'lucide-react';
import type { RootState } from '@/store';
import { clearCart } from '@/store/slices/cartSlice';
import { addToast } from '@/store/slices/uiSlice';
import { getStockStatus } from '@/lib/stock';
import api from '@/lib/api';

const steps = [
  { id: 1, label: 'Shipping', icon: MapPin },
  { id: 2, label: 'Review', icon: ShoppingBag },
  { id: 3, label: 'Payment', icon: CreditCard },
  { id: 4, label: 'Confirmation', icon: CheckCircle },
];

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state: RootState) => state.cart.items);
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'debit_card' | 'paypal' | 'cod'>('credit_card');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
  });
  const [confirmed, setConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = shippingMethod === 'express' ? 12.99 : shippingMethod === 'free' ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const hasUnavailableItem = items.some((item) => getStockStatus(item.product.stock) === 'out');

  const handlePlaceOrder = async () => {
    if (hasUnavailableItem) {
      dispatch(addToast({ type: 'error', message: 'One or more items are out of stock. Please update your cart.' }));
      return;
    }

    try {
      setPlacingOrder(true);
      const { data } = await api.post('/api/orders', {
        items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity, variant: item.variant })),
        shippingAddress,
        paymentMethod,
        shipping,
        tax,
        discount: 0,
      });

      setOrderNumber(data.order?.orderNumber || '');
      setConfirmed(true);
      setCurrentStep(4);
      dispatch(clearCart());
      dispatch(addToast({ type: 'success', message: 'Order placed successfully!' }));
    } catch (error) {
      dispatch(addToast({ type: 'error', message: error instanceof Error ? error.message : 'Failed to place order' }));
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0 && !confirmed) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#0F172A] font-[Poppins] mb-6">Checkout</h1>

      <div className="flex items-center justify-between mb-10">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${currentStep > step.id || (confirmed && step.id === 4) ? 'bg-[#22C55E] text-white' : currentStep === step.id ? 'bg-[#22C55E] text-white' : 'bg-[#E2E8F0] text-[#94A3B8]'}`}>
                {currentStep > step.id || (confirmed && step.id === 4) ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
              </div>
              <span className={`text-xs mt-1.5 ${currentStep >= step.id ? 'text-[#0F172A] font-medium' : 'text-[#94A3B8]'}`}>{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-colors ${currentStep > step.id ? 'bg-[#22C55E]' : 'bg-[#E2E8F0]'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <h3 className="text-lg font-semibold text-[#0F172A] font-[Poppins] mb-4">Shipping Address</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', key: 'fullName', required: true },
                  { label: 'Phone Number', key: 'phone', required: true },
                  { label: 'Address Line 1', key: 'line1', required: true, span: 'sm:col-span-2' },
                  { label: 'Address Line 2', key: 'line2', required: false, span: 'sm:col-span-2' },
                  { label: 'City', key: 'city', required: true },
                  { label: 'State', key: 'state', required: true },
                  { label: 'ZIP Code', key: 'zip', required: true },
                ].map((field) => (
                  <div key={field.key} className={field.span || ''}>
                    <label className="block text-sm text-[#64748B] mb-1.5">{field.label} {field.required && <span className="text-[#EF4444]">*</span>}</label>
                    <input
                      type="text"
                      value={shippingAddress[field.key as keyof typeof shippingAddress]}
                      onChange={(e) => setShippingAddress((current) => ({ ...current, [field.key]: e.target.value }))}
                      placeholder={field.label}
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:border-[#22C55E] outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <h3 className="text-lg font-semibold text-[#0F172A] font-[Poppins] mb-4">Shipping Method</h3>
              <div className="space-y-3">
                {[{ id: 'standard', label: 'Standard Shipping', time: '5-7 business days', price: 5.99 }, { id: 'express', label: 'Express Shipping', time: '2-3 business days', price: 12.99 }, { id: 'free', label: 'Free Shipping', time: '7-10 business days', price: 0 }].map((method) => (
                  <label key={method.id} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${shippingMethod === method.id ? 'border-[#22C55E] bg-[rgba(34,197,94,0.05)]' : 'border-[#E2E8F0]'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="shipping" checked={shippingMethod === method.id} onChange={() => setShippingMethod(method.id)} className="text-[#22C55E]" />
                      <div>
                        <p className="text-sm font-medium text-[#0F172A]">{method.label}</p>
                        <p className="text-xs text-[#94A3B8]">{method.time}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${method.price === 0 ? 'text-[#22C55E]' : 'text-[#0F172A]'}`}>{method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={() => setCurrentStep(2)} className="flex items-center gap-2 px-6 py-2.5 bg-[#22C55E] text-white font-medium rounded-lg hover:bg-[#16A34A] transition-colors">
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <h3 className="text-lg font-semibold text-[#0F172A] font-[Poppins] mb-4">Order Review</h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 py-3 border-b border-[#F1F5F9]">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-[#0F172A]">{item.product.name}</h4>
                      <p className="text-xs text-[#94A3B8]">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-[#0F172A]">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#64748B]"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-[#64748B]"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
                <div className="flex justify-between text-[#64748B]"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="border-t border-[#E2E8F0] pt-2 flex justify-between font-semibold text-[#0F172A]"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setCurrentStep(1)} className="px-6 py-2.5 border border-[#E2E8F0] text-[#64748B] font-medium rounded-lg hover:bg-[#F8FAFC] transition-colors">Back</button>
              <button onClick={() => setCurrentStep(3)} className="flex items-center gap-2 px-6 py-2.5 bg-[#22C55E] text-white font-medium rounded-lg hover:bg-[#16A34A] transition-colors">Continue <ChevronRight className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <h3 className="text-lg font-semibold text-[#0F172A] font-[Poppins] mb-4">Payment Method</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-[#22C55E] bg-[rgba(34,197,94,0.05)] cursor-pointer">
                  <input type="radio" name="payment" checked={paymentMethod === 'credit_card'} onChange={() => setPaymentMethod('credit_card')} className="text-[#22C55E]" />
                  <CreditCard className="w-5 h-5 text-[#22C55E]" />
                  <span className="text-sm font-medium text-[#0F172A]">Credit / Debit Card</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-[#E2E8F0] cursor-pointer hover:border-[#22C55E]/50 transition-colors">
                  <input type="radio" name="payment" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} className="text-[#22C55E]" />
                  <span className="text-sm font-medium text-[#0F172A]">PayPal</span>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-[#E2E8F0] cursor-pointer hover:border-[#22C55E]/50 transition-colors">
                  <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="text-[#22C55E]" />
                  <span className="text-sm font-medium text-[#0F172A]">Cash on Delivery</span>
                </label>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm text-[#64748B] mb-1.5">Card Number</label>
                  <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:border-[#22C55E] outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#64748B] mb-1.5">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:border-[#22C55E] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-[#64748B] mb-1.5">CVV</label>
                    <input type="text" placeholder="123" className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm focus:border-[#22C55E] outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setCurrentStep(2)} className="px-6 py-2.5 border border-[#E2E8F0] text-[#64748B] font-medium rounded-lg hover:bg-[#F8FAFC] transition-colors">Back</button>
                <button onClick={handlePlaceOrder} disabled={placingOrder} className="px-8 py-2.5 bg-[#22C55E] text-white font-medium rounded-lg hover:bg-[#16A34A] transition-colors disabled:opacity-50">{placingOrder ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}</button>
            </div>
          </motion.div>
        )}

        {currentStep === 4 && confirmed && (
          <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }} transition={{ duration: 0.5 }} className="w-20 h-20 bg-[rgba(34,197,94,0.15)] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-[#22C55E]" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#22C55E] font-[Poppins] mb-2">Order Placed Successfully!</h2>
            <p className="text-sm text-[#64748B] mb-2">Order #{orderNumber || 'Processing...'}</p>
            <p className="text-sm text-[#94A3B8] mb-8">Thank you for your order. We've sent a confirmation email.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => navigate('/orders')} className="px-6 py-2.5 bg-[#22C55E] text-white font-medium rounded-lg hover:bg-[#16A34A] transition-colors">Track Order</button>
              <button onClick={() => navigate('/shop')} className="px-6 py-2.5 border border-[#E2E8F0] text-[#64748B] font-medium rounded-lg hover:bg-[#F8FAFC] transition-colors">Continue Shopping</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
