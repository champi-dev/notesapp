import { Router } from 'express';
import { register, login, logout, refresh, getMe, updateMe, changePassword, } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema, } from '../validators/authValidators.js';
const router = Router();
router.post('/register', authRateLimiter, validate(registerSchema), register);
router.post('/login', authRateLimiter, validate(loginSchema), login);
router.post('/logout', authenticate, logout);
router.post('/refresh', refresh);
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, validate(updateProfileSchema), updateMe);
router.post('/change-password', authenticate, validate(changePasswordSchema), changePassword);
export default router;
//# sourceMappingURL=auth.js.map