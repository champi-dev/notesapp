import { z } from 'zod';

export const createNoteSchema = z.object({
  title: z.string().max(255, 'Title cannot exceed 255 characters').optional(),
  content: z.string().optional(),
  folderId: z.string().nullable().optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
});

export const updateNoteSchema = z.object({
  title: z.string().max(255, 'Title cannot exceed 255 characters').optional(),
  content: z.string().optional(),
  folderId: z.string().nullable().optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  isPinned: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
});

export const getNotesQuerySchema = z.object({
  folderId: z.string().optional(),
  search: z.string().optional(),
  tag: z.string().optional(),
  pinned: z.string().transform(val => val === 'true').optional(),
  favorite: z.string().transform(val => val === 'true').optional(),
  trashed: z.string().transform(val => val === 'true').optional(),
  sort: z.enum(['updatedAt', 'createdAt', 'title']).default('updatedAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.string().default('1').transform(Number),
  limit: z.string().default('50').transform(Number),
});

export const bulkTrashSchema = z.object({
  noteIds: z.array(z.string()).min(1, 'At least one note ID is required'),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type GetNotesQuery = z.infer<typeof getNotesQuerySchema>;
export type BulkTrashInput = z.infer<typeof bulkTrashSchema>;
