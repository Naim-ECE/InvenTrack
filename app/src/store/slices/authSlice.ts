import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User, UserRole } from '@/types';
import { authApi, type ProfilePayload, type AuthResponse, type GoogleProfilePayload } from '@/lib/apis/authApi';
import { setAccessToken } from '@/lib/api';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { normalizeUserRole } from '@/lib/roles';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const normalizeAuthUser = (user: User): User => ({
  ...user,
  role: normalizeUserRole(user.role),
});

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.login(email, password);
      persistSession(response);
      return response.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Invalid email or password'));
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, role }: { name: string; email: string; password: string; role: UserRole }, { rejectWithValue }) => {
    try {
      const response = await authApi.register({ name, email, password, role });
      persistSession(response);
      return response.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Registration failed'));
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/google',
  async (role: UserRole | undefined, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const profile: GoogleProfilePayload = {
        uid: result.user.uid,
        email: result.user.email || undefined,
        name: result.user.displayName || undefined,
        displayName: result.user.displayName || undefined,
        picture: result.user.photoURL || undefined,
        avatar: result.user.photoURL || undefined,
      };
      const response = await authApi.googleAuth(idToken, role, profile);
      persistSession(response);
      return response.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Google sign-in failed'));
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (payload: ProfilePayload, { rejectWithValue }) => {
    try {
      const user = await authApi.updateProfile(payload);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Profile update failed'));
    }
  }
);

const persistSession = (response: AuthResponse) => {
  const user = normalizeAuthUser(response.user);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  setAccessToken(response.accessToken);
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = (error as { response?: { data?: { error?: string; message?: string } } }).response;
    return response?.data?.error || response?.data?.message || fallback;
  }
  if (error instanceof Error) return error.message || fallback;
  return fallback;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
    },
    restoreSession: (state) => {
      const stored = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');
      if (stored) {
        try {
          state.user = normalizeAuthUser(JSON.parse(stored) as User);
          state.isAuthenticated = true;
          setAccessToken(token);
        } catch {
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setAccessToken(null);
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = normalizeAuthUser(action.payload);
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Invalid email or password';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = normalizeAuthUser(action.payload);
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Registration failed';
      })
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = normalizeAuthUser(action.payload);
        state.isAuthenticated = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Google sign-in failed';
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = normalizeAuthUser(action.payload);
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Profile update failed';
      });
  },
});

export const { logout, restoreSession, clearError } = authSlice.actions;
export default authSlice.reducer;
