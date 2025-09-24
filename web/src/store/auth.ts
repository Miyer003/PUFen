import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, PointsAccount } from '@/types';
import { authService } from '@/services/auth';

interface AuthState {
  user: User | null;
  pointsAccount: PointsAccount | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  updatePointsAccount: (account: PointsAccount) => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      pointsAccount: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      login: (token: string, user: User) => {
        authService.setToken(token);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          pointsAccount: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateUser: (user: User) => {
        set({ user });
      },

      updatePointsAccount: (account: PointsAccount) => {
        set({ pointsAccount: account });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setUser: (user: User | null) => {
        set({ user });
      },

      setIsAuthenticated: (authenticated: boolean) => {
        set({ isAuthenticated: authenticated });
      },

      checkAuth: async () => {
        const token = authService.getToken();
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        try {
          set({ loading: true });
          const response = await authService.getProfile();
          if (response.success && response.data) {
            set({
              user: response.data,
              token,
              isAuthenticated: true,
            });
          } else {
            authService.logout();
            set({ isAuthenticated: false });
          }
        } catch (error) {
          authService.logout();
          set({ isAuthenticated: false });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);