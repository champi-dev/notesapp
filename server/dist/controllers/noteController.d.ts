import { Response, NextFunction } from 'express';
import type { AuthRequest } from '../types/index.js';
import type { CreateNoteInput, UpdateNoteInput, GetNotesQuery, BulkTrashInput } from '../validators/noteValidators.js';
export declare const getNotes: (req: AuthRequest & {
    query: GetNotesQuery;
}, res: Response, next: NextFunction) => Promise<void>;
export declare const getNote: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createNote: (req: AuthRequest & {
    body: CreateNoteInput;
}, res: Response, next: NextFunction) => Promise<void>;
export declare const updateNote: (req: AuthRequest & {
    body: UpdateNoteInput;
}, res: Response, next: NextFunction) => Promise<void>;
export declare const trashNote: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const restoreNote: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteNote: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const bulkTrash: (req: AuthRequest & {
    body: BulkTrashInput;
}, res: Response, next: NextFunction) => Promise<void>;
export declare const emptyTrash: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=noteController.d.ts.map