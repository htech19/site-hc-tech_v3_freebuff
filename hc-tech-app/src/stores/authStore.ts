import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from '../types/sistema';

interface AuthState {
  user: Profile | null;
  loading: boolean;
  setUser: (user: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      setUser: (user) => set({ user, loading: false }),
      setLoading: (loading) => set({ loading }),
      logout: () => set({ user: null, loading: false }),
    }),
    {
      name: 'hc-tech-auth',
    }
  )
);
