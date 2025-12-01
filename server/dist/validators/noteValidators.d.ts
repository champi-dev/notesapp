import { z } from 'zod';
export declare const createNoteSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    folderId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const updateNoteSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    folderId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    isPinned: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const getNotesQuerySchema: z.ZodObject<{
    folderId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    tag: z.ZodOptional<z.ZodString>;
    pinned: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<boolean, string>>>;
    trashed: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<boolean, string>>>;
    sort: z.ZodDefault<z.ZodEnum<{
        createdAt: "createdAt";
        updatedAt: "updatedAt";
        title: "title";
    }>>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    page: z.ZodPipe<z.ZodDefault<z.ZodString>, z.ZodTransform<number, string>>;
    limit: z.ZodPipe<z.ZodDefault<z.ZodString>, z.ZodTransform<number, string>>;
}, z.core.$strip>;
export declare const bulkTrashSchema: z.ZodObject<{
    noteIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type GetNotesQuery = z.infer<typeof getNotesQuerySchema>;
export type BulkTrashInput = z.infer<typeof bulkTrashSchema>;
//# sourceMappingURL=noteValidators.d.ts.map