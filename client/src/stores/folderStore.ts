import { create } from 'zustand';
import api from '../lib/api';
import type { Folder } from '../types';

interface FolderStore {
  folders: Folder[];
  isLoading: boolean;
  fetchFolders: () => Promise<void>;
  createFolder: (name: string, color?: string) => Promise<Folder>;
  updateFolder: (id: string, data: Partial<Folder>) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
}

export const useFolderStore = create<FolderStore>((set) => ({
  folders: [],
  isLoading: false,

  fetchFolders: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/folders');
      set({ folders: response.data.folders, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  createFolder: async (name, color) => {
    const response = await api.post('/folders', { name, color });
    const folder = response.data.folder;
    set((state) => ({
      folders: [...state.folders, { ...folder, noteCount: 0 }],
    }));
    return folder;
  },

  updateFolder: async (id, data) => {
    const response = await api.patch(`/folders/${id}`, data);
    const updatedFolder = response.data.folder;
    set((state) => ({
      folders: state.folders.map((f) =>
        f._id === id ? { ...updatedFolder, noteCount: f.noteCount } : f
      ),
    }));
  },

  deleteFolder: async (id) => {
    await api.delete(`/folders/${id}`);
    set((state) => ({
      folders: state.folders.filter((f) => f._id !== id),
    }));
  },
}));
