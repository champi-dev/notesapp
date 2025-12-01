import { noteService } from '../services/noteService.js';
export const getNotes = async (req, res, next) => {
    try {
        const result = await noteService.getNotes(req.user.userId, req.query);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
export const getNote = async (req, res, next) => {
    try {
        const note = await noteService.getNote(req.user.userId, req.params.id);
        res.json({ note });
    }
    catch (error) {
        next(error);
    }
};
export const createNote = async (req, res, next) => {
    try {
        const note = await noteService.createNote(req.user.userId, req.body);
        res.status(201).json({ note });
    }
    catch (error) {
        next(error);
    }
};
export const updateNote = async (req, res, next) => {
    try {
        const note = await noteService.updateNote(req.user.userId, req.params.id, req.body);
        res.json({ note });
    }
    catch (error) {
        next(error);
    }
};
export const trashNote = async (req, res, next) => {
    try {
        const note = await noteService.trashNote(req.user.userId, req.params.id);
        res.json({ note });
    }
    catch (error) {
        next(error);
    }
};
export const restoreNote = async (req, res, next) => {
    try {
        const note = await noteService.restoreNote(req.user.userId, req.params.id);
        res.json({ note });
    }
    catch (error) {
        next(error);
    }
};
export const deleteNote = async (req, res, next) => {
    try {
        await noteService.deleteNote(req.user.userId, req.params.id);
        res.json({ message: 'Note permanently deleted' });
    }
    catch (error) {
        next(error);
    }
};
export const bulkTrash = async (req, res, next) => {
    try {
        const trashedCount = await noteService.bulkTrash(req.user.userId, req.body.noteIds);
        res.json({ trashedCount });
    }
    catch (error) {
        next(error);
    }
};
export const emptyTrash = async (req, res, next) => {
    try {
        const deletedCount = await noteService.emptyTrash(req.user.userId);
        res.json({ deletedCount });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=noteController.js.map