import { Response, NextFunction } from 'express';
import { folderService } from '../services/folderService.js';
import type { AuthRequest } from '../types/index.js';
import type { CreateFolderInput, UpdateFolderInput } from '../validators/folderValidators.js';

export const getFolders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parentId = req.query.parentId as string | undefined;
    const folders = await folderService.getFolders(req.user!.userId, parentId);
    res.json({ folders });
  } catch (error) {
    next(error);
  }
};

export const createFolder = async (
  req: AuthRequest & { body: CreateFolderInput },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const folder = await folderService.createFolder(req.user!.userId, req.body);
    res.status(201).json({ folder });
  } catch (error) {
    next(error);
  }
};

export const updateFolder = async (
  req: AuthRequest & { body: UpdateFolderInput },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const folder = await folderService.updateFolder(req.user!.userId, req.params.id, req.body);
    res.json({ folder });
  } catch (error) {
    next(error);
  }
};

export const deleteFolder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await folderService.deleteFolder(req.user!.userId, req.params.id);
    res.json({ message: 'Folder deleted', movedNotesCount: result.movedNotesCount });
  } catch (error) {
    next(error);
  }
};
