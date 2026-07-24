import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { googleLogin, loginUser, registerUser, logout, updateProfile } from '@/store/slices/authSlice';
import type { User, UserRole } from '@/types';
import type { ProfilePayload } from '@/lib/apis/authApi';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: (email: string, password: string) => dispatch(loginUser({ email, password })).unwrap(),
    register: (name: string, email: string, password: string, role: UserRole) => dispatch(registerUser({ name, email, password, role })).unwrap(),
    googleLogin: (role?: UserRole) => dispatch(googleLogin(role)).unwrap(),
    updateProfile: (payload: ProfilePayload) => dispatch(updateProfile(payload)).unwrap() as Promise<User>,
    logout: () => dispatch(logout()),
  };
}
