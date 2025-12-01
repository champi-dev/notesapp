import { noteService } from '../services/noteService.js';
export const getTags = async (req, res, next) => {
    try {
        const tags = await noteService.getTags(req.user.userId);
        res.json({ tags });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=tagController.js.map