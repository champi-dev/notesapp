import { Response, NextFunction } from 'express';
import type { AuthRequest } from '../types/index.js';
import type { CreateFolderInput, UpdateFolderInput } from '../validators/folderValidators.js';
export declare const getFolders: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createFolder: (req: AuthRequest & {
    body: CreateFolderInput;
}, res: Response, next: NextFunction) => Promise<void>;
export declare const updateFolder: (req: AuthRequest & {
    body: UpdateFolderInput;
}, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteFolder: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=folderController.d.ts.map