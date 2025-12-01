export const APP_NAME = 'NoteFlow';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/app',
  NOTE: '/app/note/:id',
  FOLDER: '/app/folder/:id',
  TRASH: '/app/trash',
  SETTINGS: '/app/settings',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  NOTES: {
    LIST: '/notes',
    CREATE: '/notes',
    GET: (id: string) => `/notes/${id}`,
    UPDATE: (id: string) => `/notes/${id}`,
    TRASH: (id: string) => `/notes/${id}/trash`,
    RESTORE: (id: string) => `/notes/${id}/restore`,
    DELETE: (id: string) => `/notes/${id}`,
    BULK_TRASH: '/notes/bulk-trash',
    EMPTY_TRASH: '/notes/empty-trash',
  },
  FOLDERS: {
    LIST: '/folders',
    CREATE: '/folders',
    UPDATE: (id: string) => `/folders/${id}`,
    DELETE: (id: string) => `/folders/${id}`,
  },
  TAGS: {
    LIST: '/tags',
  },
} as const;

export const AUTOSAVE_DELAY = 1000; // 1 second

export const MAX_TAGS_PER_NOTE = 10;
export const MAX_TAG_LENGTH = 30;
export const MAX_FOLDERS = 50;

export const KEYBOARD_SHORTCUTS = {
  NEW_NOTE: { key: 'n', ctrl: true, description: 'Create new note' },
  SAVE: { key: 's', ctrl: true, description: 'Save note' },
  SEARCH: { key: 'f', ctrl: true, description: 'Focus search' },
  TOGGLE_SIDEBAR: { key: '\\', ctrl: true, description: 'Toggle sidebar' },
  HELP: { key: '?', description: 'Show shortcuts' },
} as const;
