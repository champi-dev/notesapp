import { Response, NextFunction } from 'express';
import { noteService } from '../services/noteService.js';
import type { AuthRequest } from '../types/index.js';
import type {
  CreateNoteInput,
  UpdateNoteInput,
  GetNotesQuery,
  BulkTrashInput,
} from '../validators/noteValidators.js';

export const getNotes = async (
  req: AuthRequest & { validatedQuery?: GetNotesQuery },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.validatedQuery || (req.query as unknown as GetNotesQuery);
    const result = await noteService.getNotes(req.user!.userId, query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getNote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const note = await noteService.getNote(req.user!.userId, req.params.id);
    res.json({ note });
  } catch (error) {
    next(error);
  }
};

export const createNote = async (
  req: AuthRequest & { body: CreateNoteInput },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const note = await noteService.createNote(req.user!.userId, req.body);
    res.status(201).json({ note });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (
  req: AuthRequest & { body: UpdateNoteInput },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const note = await noteService.updateNote(req.user!.userId, req.params.id, req.body);
    res.json({ note });
  } catch (error) {
    next(error);
  }
};

export const trashNote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const note = await noteService.trashNote(req.user!.userId, req.params.id);
    res.json({ note });
  } catch (error) {
    next(error);
  }
};

export const restoreNote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const note = await noteService.restoreNote(req.user!.userId, req.params.id);
    res.json({ note });
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await noteService.deleteNote(req.user!.userId, req.params.id);
    res.json({ message: 'Note permanently deleted' });
  } catch (error) {
    next(error);
  }
};

export const bulkTrash = async (
  req: AuthRequest & { body: BulkTrashInput },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const trashedCount = await noteService.bulkTrash(req.user!.userId, req.body.noteIds);
    res.json({ trashedCount });
  } catch (error) {
    next(error);
  }
};

export const emptyTrash = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deletedCount = await noteService.emptyTrash(req.user!.userId);
    res.json({ deletedCount });
  } catch (error) {
    next(error);
  }
};
