import axios from 'axios';

let accessToken = localStorage.getItem('accessToken') || '';

export const setAccessToken = (token: string | null) => {
  accessToken = token || '';
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };
    const refreshToken = localStorage.getItem('refreshToken');

    if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;
      const response = await api.post('/api/auth/refresh', { refreshToken });
      const { accessToken: nextAccessToken, refreshToken: nextRefreshToken } = response.data;
      localStorage.setItem('accessToken', nextAccessToken);
      localStorage.setItem('refreshToken', nextRefreshToken);
      setAccessToken(nextAccessToken);
      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);

export const getApiError = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.response?.data?.message || fallback;
  }
  return fallback;
};

export default api;
