import { Request, Response, NextFunction } from 'express';
import type { AuthRequest } from '../types/index.js';
import type { RegisterInput, LoginInput, UpdateProfileInput, ChangePasswordInput } from '../validators/authValidators.js';
export declare const register: (req: Request<{}, {}, RegisterInput>, res: Response, next: NextFunction) => Promise<void>;
export declare const login: (req: Request<{}, {}, LoginInput>, res: Response, next: NextFunction) => Promise<void>;
export declare const logout: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const refresh: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getMe: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateMe: (req: AuthRequest & {
    body: UpdateProfileInput;
}, res: Response, next: NextFunction) => Promise<void>;
export declare const changePassword: (req: AuthRequest & {
    body: ChangePasswordInput;
}, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authController.d.ts.map