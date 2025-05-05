import { create } from 'zustand';
import { User } from '../models/types';

// Mock user object for simplifying auth
const MOCK_USER: User = {
  id: 'user-1',
  email: 'user@example.com',
  created_at: new Date().toISOString()
};

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      // Simulate a delay to make it feel like authentication is happening
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Auto-login with mock user without actual authentication
      set({ 
        user: MOCK_USER, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  register: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Auto-register with mock user
      set({ 
        user: MOCK_USER, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      // Simulate checking authentication
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // For demo purposes, we'll start as logged out
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        user: null, 
        isAuthenticated: false, 
        error: (error as Error).message, 
        isLoading: false 
      });
    }
  },
})); 