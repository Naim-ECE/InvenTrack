import { useDispatch } from 'react-redux';
import { addToast } from '@/store/slices/uiSlice';

export function useToast() {
  const dispatch = useDispatch();

  return {
    success: (message: string) => dispatch(addToast({ type: 'success', message })),
    error: (message: string) => dispatch(addToast({ type: 'error', message })),
    warning: (message: string) => dispatch(addToast({ type: 'warning', message })),
    info: (message: string) => dispatch(addToast({ type: 'info', message })),
  };
}
