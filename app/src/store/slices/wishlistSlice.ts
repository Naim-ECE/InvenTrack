import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/types';

interface WishlistState {
  items: Product[];
}

const loadWishlist = (): Product[] => {
  try {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveWishlist = (items: Product[]) => {
  localStorage.setItem('wishlist', JSON.stringify(items));
};

const initialState: WishlistState = {
  items: loadWishlist(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      if (!state.items.find((item) => item.id === action.payload.id)) {
        state.items.push(action.payload);
        saveWishlist(state.items);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveWishlist(state.items);
    },
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      saveWishlist(state.items);
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
