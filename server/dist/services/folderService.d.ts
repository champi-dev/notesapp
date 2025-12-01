import { IFolder } from '../models/Folder.js';
import type { CreateFolderInput, UpdateFolderInput } from '../validators/folderValidators.js';
import mongoose from 'mongoose';
export declare class FolderService {
    getFolders(userId: string, parentId?: string): Promise<{
        noteCount: number;
        _id: mongoose.Types.ObjectId;
        userId: mongoose.Types.ObjectId;
        name: string;
        color: string;
        parentId: mongoose.Types.ObjectId | null;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: mongoose.Collection;
        db: mongoose.Connection;
        errors?: mongoose.Error.ValidationError;
        isNew: boolean;
        schema: mongoose.Schema;
        __v: number;
    }[]>;
    createFolder(userId: string, input: CreateFolderInput): Promise<IFolder>;
    updateFolder(userId: string, folderId: string, input: UpdateFolderInput): Promise<IFolder>;
    deleteFolder(userId: string, folderId: string): Promise<{
        movedNotesCount: number;
    }>;
    private deleteSubfolders;
}
export declare const folderService: FolderService;
//# sourceMappingURL=folderService.d.ts.map