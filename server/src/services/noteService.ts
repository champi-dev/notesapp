import { Note, INote } from '../models/Note.js';
import { AppError } from '../middleware/errorHandler.js';
import { sanitizeHtml } from '../utils/sanitize.js';
import { extractPlainText } from '../utils/extractText.js';
import type { CreateNoteInput, UpdateNoteInput, GetNotesQuery } from '../validators/noteValidators.js';
import mongoose from 'mongoose';

export class NoteService {
  async getNotes(
    userId: string,
    query: GetNotesQuery
  ): Promise<{ notes: Partial<INote>[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const filter: Record<string, any> = { userId };

    if (query.trashed) {
      filter.isTrashed = true;
    } else {
      filter.isTrashed = false;
    }

    if (query.folderId) {
      if (query.folderId === 'root') {
        filter.folderId = null;
      } else {
        filter.folderId = query.folderId;
      }
    }

    if (query.tag) {
      filter.tags = query.tag;
    }

    if (query.pinned) {
      filter.isPinned = true;
    }

    if (query.favorite) {
      filter.isFavorite = true;
    }

    let findQuery = Note.find(filter);

    if (query.search) {
      findQuery = Note.find({
        ...filter,
        $text: { $search: query.search },
      });
    }

    const total = await Note.countDocuments(filter);
    const limit = Math.min(query.limit, 100);
    const page = query.page;
    const pages = Math.ceil(total / limit);

    const sortOrder = query.order === 'asc' ? 1 : -1;
    const sortField = query.sort;

    const notes = await findQuery
      .select('-content')
      .sort({ isPinned: -1, [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return {
      notes,
      pagination: { page, limit, total, pages },
    };
  }

  async getNote(userId: string, noteId: string): Promise<INote> {
    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      throw new AppError('Note not found', 404, 'NOTE_001');
    }
    return note;
  }

  async createNote(userId: string, input: CreateNoteInput): Promise<INote> {
    const content = input.content ? sanitizeHtml(input.content) : '';
    const plainText = extractPlainText(content);

    const note = await Note.create({
      userId,
      ...input,
      content,
      plainText,
      folderId: input.folderId || null,
    });

    return note;
  }

  async updateNote(userId: string, noteId: string, input: UpdateNoteInput): Promise<INote> {
    const updateData: Record<string, any> = { ...input };

    if (input.content !== undefined) {
      updateData.content = sanitizeHtml(input.content);
      updateData.plainText = extractPlainText(updateData.content);
    }

    if (input.folderId === null) {
      updateData.folderId = null;
    }

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      updateData,
      { new: true }
    );

    if (!note) {
      throw new AppError('Note not found', 404, 'NOTE_001');
    }

    return note;
  }

  async trashNote(userId: string, noteId: string): Promise<INote> {
    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { isTrashed: true, trashedAt: new Date(), isPinned: false },
      { new: true }
    );

    if (!note) {
      throw new AppError('Note not found', 404, 'NOTE_001');
    }

    return note;
  }

  async restoreNote(userId: string, noteId: string): Promise<INote> {
    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      { isTrashed: false, trashedAt: null },
      { new: true }
    );

    if (!note) {
      throw new AppError('Note not found', 404, 'NOTE_001');
    }

    return note;
  }

  async deleteNote(userId: string, noteId: string): Promise<void> {
    const result = await Note.deleteOne({ _id: noteId, userId });

    if (result.deletedCount === 0) {
      throw new AppError('Note not found', 404, 'NOTE_001');
    }
  }

  async bulkTrash(userId: string, noteIds: string[]): Promise<number> {
    const result = await Note.updateMany(
      { _id: { $in: noteIds }, userId },
      { isTrashed: true, trashedAt: new Date(), isPinned: false }
    );

    return result.modifiedCount;
  }

  async emptyTrash(userId: string): Promise<number> {
    const result = await Note.deleteMany({ userId, isTrashed: true });
    return result.deletedCount;
  }

  async getTags(userId: string): Promise<{ name: string; count: number }[]> {
    const tags = await Note.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), isTrashed: false } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    return tags;
  }
}

export const noteService = new NoteService();
