import { Request } from 'express';
import { Types } from 'mongoose';

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export interface UserDocument {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  avatar: string | null;
  theme: 'light' | 'dark' | 'system';
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  folderId: Types.ObjectId | null;
  title: string;
  content: string;
  plainText: string;
  tags: string[];
  isPinned: boolean;
  isTrashed: boolean;
  trashedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface FolderDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  color: string;
  parentId: Types.ObjectId | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefreshTokenDocument {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}
