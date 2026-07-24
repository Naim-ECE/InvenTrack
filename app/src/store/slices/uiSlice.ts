import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Toast } from '@/types';

interface ModalState {
  isOpen: boolean;
  type: string | null;
  data: unknown;
}

interface UIState {
  sidebarCollapsed: boolean;
  toasts: Toast[];
  modal: ModalState;
}

const initialState: UIState = {
  sidebarCollapsed: false,
  toasts: [],
  modal: { isOpen: false, type: null, data: null },
};

let toastIdCounter = 0;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    addToast: (state, action: PayloadAction<{ type: Toast['type']; message: string }>) => {
      const id = `toast-${++toastIdCounter}`;
      state.toasts.push({ id, ...action.payload });
      if (state.toasts.length > 5) {
        state.toasts.shift();
      }
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    openModal: (state, action: PayloadAction<{ type: string; data?: unknown }>) => {
      state.modal = { isOpen: true, type: action.payload.type, data: action.payload.data ?? null };
    },
    closeModal: (state) => {
      state.modal = { isOpen: false, type: null, data: null };
    },
  },
});

export const { toggleSidebar, setSidebarCollapsed, addToast, removeToast, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
