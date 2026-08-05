import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
}

const loadCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

const initialState: CartState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number; variant?: string }>) => {
      const { product, quantity = 1, variant } = action.payload;
      const existing = state.items.find(
        (item) => item.product.id === product.id && item.variant === variant
      );
      const maxQuantity = Math.max(0, Number(product.stock || 0));
      if (maxQuantity <= 0) return;

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, maxQuantity);
      } else {
        state.items.push({ product, quantity: Math.min(quantity, maxQuantity), variant });
      }
      saveCart(state.items);
    },
    removeFromCart: (state, action: PayloadAction<{ productId: string; variant?: string }>) => {
      state.items = state.items.filter(
        (item) => !(item.product.id === action.payload.productId && item.variant === action.payload.variant)
      );
      saveCart(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; variant?: string; quantity: number }>) => {
      const item = state.items.find(
        (item) => item.product.id === action.payload.productId && item.variant === action.payload.variant
      );
      if (item) {
        const maxQuantity = Math.max(1, Number(item.product.stock || 0));
        item.quantity = Math.min(Math.max(1, action.payload.quantity), maxQuantity);
        saveCart(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveCart([]);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
