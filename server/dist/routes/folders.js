import { Router } from 'express';
import { getFolders, createFolder, updateFolder, deleteFolder, } from '../controllers/folderController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createFolderSchema, updateFolderSchema } from '../validators/folderValidators.js';
const router = Router();
router.use(authenticate);
router.get('/', getFolders);
router.post('/', validate(createFolderSchema), createFolder);
router.patch('/:id', validate(updateFolderSchema), updateFolder);
router.delete('/:id', deleteFolder);
export default router;
//# sourceMappingURL=folders.js.map