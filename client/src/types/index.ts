export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  theme: 'light' | 'dark' | 'system';
}

export interface Note {
  _id: string;
  userId: string;
  folderId: string | null;
  title: string;
  content: string;
  plainText: string;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  isTrashed: boolean;
  trashedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  _id: string;
  userId: string;
  name: string;
  color: string;
  parentId: string | null;
  order: number;
  noteCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  name: string;
  count: number;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface NotesFilter {
  folderId: string | null;
  tag: string | null;
  search: string;
  trashed: boolean;
  favorite: boolean;
}

export interface ApiError {
  error: {
    message: string;
    code: string;
    field?: string;
    details?: Array<{ field: string; message: string }>;
  };
}
