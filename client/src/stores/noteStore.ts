import { create } from 'zustand';
import api from '../lib/api';
import type { Note, NotesFilter, Pagination } from '../types';

interface NoteStore {
  notes: Note[];
  activeNoteId: string | null;
  activeNote: Note | null;
  isLoading: boolean;
  isSaving: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  filters: NotesFilter;
  pagination: Pagination;
  fetchNotes: () => Promise<void>;
  getNote: (id: string) => Promise<Note>;
  createNote: (folderId?: string | null) => Promise<Note>;
  updateNote: (id: string, data: Partial<Note>) => Promise<void>;
  trashNote: (id: string) => Promise<void>;
  restoreNote: (id: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  emptyTrash: () => Promise<number>;
  setActiveNote: (id: string | null) => void;
  setFilter: (filter: Partial<NotesFilter>) => void;
  clearFilters: () => void;
  setSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void;
}

const defaultFilters: NotesFilter = {
  folderId: null,
  tag: null,
  search: '',
  trashed: false,
  favorite: false,
};

const defaultPagination: Pagination = {
  page: 1,
  limit: 50,
  total: 0,
  pages: 0,
};

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  activeNoteId: null,
  activeNote: null,
  isLoading: false,
  isSaving: false,
  saveStatus: 'idle',
  filters: defaultFilters,
  pagination: defaultPagination,

  fetchNotes: async () => {
    const { filters } = get();
    set({ isLoading: true });

    try {
      const params = new URLSearchParams();
      if (filters.folderId) params.append('folderId', filters.folderId);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.search) params.append('search', filters.search);
      if (filters.trashed) params.append('trashed', 'true');
      if (filters.favorite) params.append('favorite', 'true');

      const response = await api.get(`/notes?${params.toString()}`);
      set({
        notes: response.data.notes,
        pagination: response.data.pagination,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  getNote: async (id) => {
    const response = await api.get(`/notes/${id}`);
    const note = response.data.note;
    set({ activeNote: note, activeNoteId: id });
    return note;
  },

  createNote: async (folderId) => {
    const response = await api.post('/notes', {
      title: 'Untitled',
      content: '',
      folderId: folderId || null,
    });
    const note = response.data.note;
    set((state) => ({
      notes: [note, ...state.notes],
      activeNote: note,
      activeNoteId: note._id,
    }));
    return note;
  },

  updateNote: async (id, data) => {
    set({ isSaving: true, saveStatus: 'saving' });
    try {
      const response = await api.patch(`/notes/${id}`, data);
      const updatedNote = response.data.note;
      set((state) => ({
        notes: state.notes.map((n) => (n._id === id ? updatedNote : n)),
        activeNote: state.activeNoteId === id ? updatedNote : state.activeNote,
        isSaving: false,
        saveStatus: 'saved',
      }));
    } catch (error) {
      set({ isSaving: false, saveStatus: 'error' });
      throw error;
    }
  },

  trashNote: async (id) => {
    await api.post(`/notes/${id}/trash`);
    set((state) => ({
      notes: state.notes.filter((n) => n._id !== id),
      activeNote: state.activeNoteId === id ? null : state.activeNote,
      activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
    }));
  },

  restoreNote: async (id) => {
    const response = await api.post(`/notes/${id}/restore`);
    set((state) => ({
      notes: state.notes.filter((n) => n._id !== id),
      activeNote: state.activeNoteId === id ? response.data.note : state.activeNote,
    }));
  },

  deleteNote: async (id) => {
    await api.delete(`/notes/${id}`);
    set((state) => ({
      notes: state.notes.filter((n) => n._id !== id),
      activeNote: state.activeNoteId === id ? null : state.activeNote,
      activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
    }));
  },

  emptyTrash: async () => {
    const response = await api.delete('/notes/empty-trash');
    set({ notes: [], activeNote: null, activeNoteId: null });
    return response.data.deletedCount;
  },

  setActiveNote: (id) => {
    set({ activeNoteId: id, activeNote: id ? get().notes.find((n) => n._id === id) || null : null });
  },

  setFilter: (filter) => {
    set((state) => ({
      filters: { ...state.filters, ...filter },
    }));
  },

  clearFilters: () => {
    set({ filters: defaultFilters });
  },

  setSaveStatus: (status) => {
    set({ saveStatus: status });
  },
}));
