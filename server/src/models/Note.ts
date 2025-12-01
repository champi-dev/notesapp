import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  folderId: mongoose.Types.ObjectId | null;
  title: string;
  content: string;
  plainText: string;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  isTrashed: boolean;
  trashedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
    title: {
      type: String,
      default: 'Untitled',
      trim: true,
      maxlength: [255, 'Title cannot exceed 255 characters'],
    },
    content: {
      type: String,
      default: '',
    },
    plainText: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isTrashed: {
      type: Boolean,
      default: false,
    },
    trashedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.index({ userId: 1, folderId: 1 });
noteSchema.index({ userId: 1, isTrashed: 1 });
noteSchema.index({ userId: 1, isPinned: 1 });
noteSchema.index({ userId: 1, isFavorite: 1 });
noteSchema.index({ tags: 1 });
noteSchema.index({ plainText: 'text', title: 'text' });

export const Note = mongoose.model<INote>('Note', noteSchema);
