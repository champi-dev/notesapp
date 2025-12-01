import { Folder } from '../models/Folder.js';
import { Note } from '../models/Note.js';
import { AppError } from '../middleware/errorHandler.js';
import mongoose from 'mongoose';
export class FolderService {
    async getFolders(userId, parentId) {
        const filter = { userId };
        if (parentId !== undefined) {
            filter.parentId = parentId || null;
        }
        const folders = await Folder.find(filter).sort({ order: 1, name: 1 }).lean();
        const foldersWithCount = await Promise.all(folders.map(async (folder) => {
            const noteCount = await Note.countDocuments({
                userId,
                folderId: folder._id,
                isTrashed: false,
            });
            return { ...folder, noteCount };
        }));
        return foldersWithCount;
    }
    async createFolder(userId, input) {
        // Check folder limit
        const folderCount = await Folder.countDocuments({ userId });
        if (folderCount >= 50) {
            throw new AppError('Maximum folder limit (50) reached', 400, 'FOLDER_002');
        }
        const folder = await Folder.create({
            userId,
            ...input,
            parentId: input.parentId || null,
        });
        return folder;
    }
    async updateFolder(userId, folderId, input) {
        const folder = await Folder.findOneAndUpdate({ _id: folderId, userId }, input, { new: true });
        if (!folder) {
            throw new AppError('Folder not found', 404, 'FOLDER_001');
        }
        return folder;
    }
    async deleteFolder(userId, folderId) {
        const folder = await Folder.findOne({ _id: folderId, userId });
        if (!folder) {
            throw new AppError('Folder not found', 404, 'FOLDER_001');
        }
        // Move notes to root
        const moveResult = await Note.updateMany({ userId, folderId: new mongoose.Types.ObjectId(folderId) }, { folderId: null });
        // Delete subfolders recursively
        await this.deleteSubfolders(userId, folderId);
        // Delete the folder
        await Folder.deleteOne({ _id: folderId });
        return { movedNotesCount: moveResult.modifiedCount };
    }
    async deleteSubfolders(userId, parentId) {
        const subfolders = await Folder.find({ userId, parentId });
        for (const subfolder of subfolders) {
            // Move notes to root
            await Note.updateMany({ userId, folderId: subfolder._id }, { folderId: null });
            // Recursively delete subfolders
            await this.deleteSubfolders(userId, subfolder._id.toString());
            // Delete the subfolder
            await Folder.deleteOne({ _id: subfolder._id });
        }
    }
}
export const folderService = new FolderService();
//# sourceMappingURL=folderService.js.map