import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import type { RootState } from '@/store';
import { removeToast } from '@/store/slices/uiSlice';
import { useEffect } from 'react';

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'border-l-[#22C55E]',
  error: 'border-l-[#EF4444]',
  warning: 'border-l-[#F59E0B]',
  info: 'border-l-[#3B82F6]',
};

export default function ToastContainer() {
  const toasts = useSelector((state: RootState) => state.ui.toasts);
  const dispatch = useDispatch();

  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, 4000);
      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 w-80">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`bg-[#1F2937] border-l-4 ${colorMap[toast.type]} rounded-lg shadow-lg p-4 flex items-start gap-3`}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: toast.type === 'success' ? '#22C55E' : toast.type === 'error' ? '#EF4444' : toast.type === 'warning' ? '#F59E0B' : '#3B82F6' }} />
              <p className="text-sm text-[#F9FAFB] flex-1">{toast.message}</p>
              <button onClick={() => dispatch(removeToast(toast.id))} className="text-[#6B7280] hover:text-[#F9FAFB] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
