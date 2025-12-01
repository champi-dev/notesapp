import { Router } from 'express';
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  trashNote,
  restoreNote,
  deleteNote,
  bulkTrash,
  emptyTrash,
} from '../controllers/noteController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createNoteSchema,
  updateNoteSchema,
  getNotesQuerySchema,
  bulkTrashSchema,
} from '../validators/noteValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', validate(getNotesQuerySchema, 'query'), getNotes);
router.post('/', validate(createNoteSchema), createNote);
router.post('/bulk-trash', validate(bulkTrashSchema), bulkTrash);
router.delete('/empty-trash', emptyTrash);
router.get('/:id', getNote);
router.patch('/:id', validate(updateNoteSchema), updateNote);
router.post('/:id/trash', trashNote);
router.post('/:id/restore', restoreNote);
router.delete('/:id', deleteNote);

export default router;
