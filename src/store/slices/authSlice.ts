import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: {
    id: string;
    email: string;
  } | null;
  profile: Profile | null;
  role: 'admin' | 'moderator' | 'user';
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  role: 'user',
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: AuthState['user']; profile: Profile | null; role: AuthState['role'] }>) => {
      state.user = action.payload.user;
      state.profile = action.payload.profile;
      state.role = action.payload.role;
      state.isAuthenticated = !!action.payload.user;
      state.loading = false;
    },
    clearAuth: (state) => {
      state.user = null;
      state.profile = null;
      state.role = 'user';
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setAuth, clearAuth, setLoading } = authSlice.actions;
export default authSlice.reducer;
