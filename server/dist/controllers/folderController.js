import { folderService } from '../services/folderService.js';
export const getFolders = async (req, res, next) => {
    try {
        const parentId = req.query.parentId;
        const folders = await folderService.getFolders(req.user.userId, parentId);
        res.json({ folders });
    }
    catch (error) {
        next(error);
    }
};
export const createFolder = async (req, res, next) => {
    try {
        const folder = await folderService.createFolder(req.user.userId, req.body);
        res.status(201).json({ folder });
    }
    catch (error) {
        next(error);
    }
};
export const updateFolder = async (req, res, next) => {
    try {
        const folder = await folderService.updateFolder(req.user.userId, req.params.id, req.body);
        res.json({ folder });
    }
    catch (error) {
        next(error);
    }
};
export const deleteFolder = async (req, res, next) => {
    try {
        const result = await folderService.deleteFolder(req.user.userId, req.params.id);
        res.json({ message: 'Folder deleted', movedNotesCount: result.movedNotesCount });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=folderController.js.map