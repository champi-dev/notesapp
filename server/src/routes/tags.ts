import { Router } from 'express';
import { getTags } from '../controllers/tagController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getTags);

export default router;
