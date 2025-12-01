import { create } from 'zustand';
import api from '../lib/api';
import type { Tag } from '../types';

interface TagStore {
  tags: Tag[];
  isLoading: boolean;
  fetchTags: () => Promise<void>;
}

export const useTagStore = create<TagStore>((set) => ({
  tags: [],
  isLoading: false,

  fetchTags: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/tags');
      set({ tags: response.data.tags, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
