import mongoose, { Schema, Document } from 'mongoose';

export interface IFolder extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  color: string;
  parentId: mongoose.Types.ObjectId | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const folderSchema = new Schema<IFolder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Folder name is required'],
      trim: true,
      maxlength: [100, 'Folder name cannot exceed 100 characters'],
    },
    color: {
      type: String,
      default: '#6366f1',
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

folderSchema.index({ userId: 1, parentId: 1 });

export const Folder = mongoose.model<IFolder>('Folder', folderSchema);
