import { Response, NextFunction } from 'express';
import { noteService } from '../services/noteService.js';
import type { AuthRequest } from '../types/index.js';

export const getTags = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tags = await noteService.getTags(req.user!.userId);
    res.json({ tags });
  } catch (error) {
    next(error);
  }
};
