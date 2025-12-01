import { INote } from '../models/Note.js';
import type { CreateNoteInput, UpdateNoteInput, GetNotesQuery } from '../validators/noteValidators.js';
export declare class NoteService {
    getNotes(userId: string, query: GetNotesQuery): Promise<{
        notes: Partial<INote>[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getNote(userId: string, noteId: string): Promise<INote>;
    createNote(userId: string, input: CreateNoteInput): Promise<INote>;
    updateNote(userId: string, noteId: string, input: UpdateNoteInput): Promise<INote>;
    trashNote(userId: string, noteId: string): Promise<INote>;
    restoreNote(userId: string, noteId: string): Promise<INote>;
    deleteNote(userId: string, noteId: string): Promise<void>;
    bulkTrash(userId: string, noteIds: string[]): Promise<number>;
    emptyTrash(userId: string): Promise<number>;
    getTags(userId: string): Promise<{
        name: string;
        count: number;
    }[]>;
}
export declare const noteService: NoteService;
//# sourceMappingURL=noteService.d.ts.map