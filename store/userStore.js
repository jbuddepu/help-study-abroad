import { create } from 'zustand';
import api from '../lib/api';

/*
 * Caching strategy: in-memory cache keyed by "skip-limit" string.
 * Why: Avoids repeat API calls when navigating back to same page.
 * Cache is cleared on page refresh (in-memory only — intentional).
 */

export const useUserStore = create((set, get) => ({
  users: [],
  total: 0,
  loading: false,
  error: null,
  cache: {},

  fetchUsers: async (skip = 0, limit = 10) => {
    const key = `${skip}-${limit}`;
    const { cache } = get();

    // Cache hit: skip API call if this page was already fetched.
    // Strategy: in-memory Zustand cache keyed by "skip-limit".
    // Tradeoff: cache lives only for this session (cleared on refresh).
    // This avoids redundant network requests when paginating back.
    if (cache[key]) {
      set({ users: cache[key].users, total: cache[key].total });
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/users?limit=${limit}&skip=${skip}`);
      set((state) => ({
        users: data.users,
        total: data.total,
        loading: false,
        cache: {
          ...state.cache,
          [key]: { users: data.users, total: data.total }
        }
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch users', loading: false });
    }
  },

  searchUsers: async (query) => {
    if (!query) {
      await get().fetchUsers(0, 10);
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
      set({ users: data.users, total: data.total, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to search users', loading: false });
    }
  },

  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/users/${id}`);
      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch user', loading: false });
      throw error;
    }
  }
}));
