import api from '@/lib/api';
import type { User, UserRole } from '@/types';

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  isNewUser?: boolean;
}

export interface ProfilePayload {
  name?: string;
  phone?: string;
  avatar?: string;
  address?: User['address'];
}

export interface GoogleProfilePayload {
  uid?: string;
  email?: string;
  name?: string;
  displayName?: string;
  picture?: string;
  avatar?: string;
}

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/api/auth/login', { email, password });
    return data;
  },
  register: async (payload: { name: string; email: string; password: string; role: UserRole }) => {
    const { data } = await api.post<AuthResponse>('/api/auth/register', payload);
    return data;
  },
  googleAuth: async (idToken: string, role?: UserRole, profile?: GoogleProfilePayload) => {
    const { data } = await api.post<AuthResponse>('/api/auth/google', { idToken, role, profile });
    return data;
  },
  updateProfile: async (payload: ProfilePayload) => {
    const { data } = await api.put<{ user: User }>('/api/auth/profile', payload);
    return data.user;
  },
  getUsers: async (params?: { role?: UserRole | 'all'; search?: string }) => {
    const { data } = await api.get<{ users: User[] }>('/api/auth/users', { params });
    return data.users;
  },
  updateUserRole: async (id: string, role: UserRole) => {
    const { data } = await api.put<{ user: User }>(`/api/auth/users/${id}/role`, { role });
    return data.user;
  },
};
