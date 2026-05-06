import { create } from 'zustand';
import api from '../lib/api';

/*
 * Same caching strategy as userStore.
 * Category filter clears cache context — fetches fresh from API.
 */

export const useProductStore = create((set, get) => ({
  products: [],
  total: 0,
  categories: [],
  loading: false,
  error: null,
  cache: {},

  fetchProducts: async (skip = 0, limit = 12) => {
    const key = `${skip}-${limit}`;
    const { cache } = get();

    // Cache hit: skip API call if this page was already fetched.
    // Strategy: in-memory Zustand cache keyed by "skip-limit".
    // Tradeoff: cache lives only for this session (cleared on refresh).
    // This avoids redundant network requests when paginating back.
    if (cache[key]) {
      set({ products: cache[key].products, total: cache[key].total });
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/products?limit=${limit}&skip=${skip}`);
      set((state) => ({
        products: data.products,
        total: data.total,
        loading: false,
        cache: {
          ...state.cache,
          [key]: { products: data.products, total: data.total }
        }
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch products', loading: false });
    }
  },

  fetchCategories: async () => {
    if (get().categories.length > 0) {
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data } = await api.get('/products/category-list');
      set({ categories: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch categories', loading: false });
    }
  },

  searchProducts: async (query) => {
    if (!query) {
      await get().fetchProducts(0, 12);
      return;
    }

    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
      set({ products: data.products, total: data.total, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to search products', loading: false });
    }
  },

  fetchByCategory: async (slug) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/products/category/${slug}`);
      set({ products: data.products, total: data.total, loading: false, cache: {} });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch category products', loading: false });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/products/${id}`);
      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch product', loading: false });
      throw error;
    }
  }
}));
