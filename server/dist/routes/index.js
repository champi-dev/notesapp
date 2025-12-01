import { Router } from 'express';
import authRoutes from './auth.js';
import noteRoutes from './notes.js';
import folderRoutes from './folders.js';
import tagRoutes from './tags.js';
const router = Router();
router.use('/auth', authRoutes);
router.use('/notes', noteRoutes);
router.use('/folders', folderRoutes);
router.use('/tags', tagRoutes);
export default router;
//# sourceMappingURL=index.js.map