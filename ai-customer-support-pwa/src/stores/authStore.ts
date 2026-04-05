import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  businessId?: string
  businessName?: string
  role: 'admin' | 'agent' | 'viewer'
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call - replace with actual Supabase auth
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Mock successful login
          const user: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            businessId: 'biz_1',
            businessName: 'Demo Company',
            role: 'admin',
          }

          set({
            user,
            token: 'mock_token_' + Date.now(),
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.message || 'Login failed',
            isLoading: false,
          })
          throw error
        }
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null })
        try {
          // Simulate API call - replace with actual Supabase auth
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Mock successful signup
          const user: User = {
            id: Date.now().toString(),
            email,
            name,
            role: 'admin',
          }

          set({
            user,
            token: 'mock_token_' + Date.now(),
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.message || 'Signup failed',
            isLoading: false,
          })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        })
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading })
      },

      clearError: () => {
        set({ error: null })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
