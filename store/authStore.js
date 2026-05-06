import { create } from 'zustand';
import api from '../lib/api';

/*
 * Why Zustand: Lightweight, no boilerplate, no Provider needed,
 * supports async actions natively. Better than Redux for this scale.
 */

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', {
        username,
        password,
        expiresInMins: 60
      });
      set({ user: data, token: data.accessToken, loading: false });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  logout: () => {
    set({ user: null, token: null, error: null });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },

  initAuth: () => {
    if (typeof window === 'undefined') {
      return;
    }

    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      set({ token, user: JSON.parse(userData) });
    }
  }
}));
