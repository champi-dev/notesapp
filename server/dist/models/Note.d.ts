import mongoose, { Document } from 'mongoose';
export interface INote extends Document {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    folderId: mongoose.Types.ObjectId | null;
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
export declare const Note: mongoose.Model<INote, {}, {}, {}, mongoose.Document<unknown, {}, INote, {}, mongoose.DefaultSchemaOptions> & INote & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, INote>;
//# sourceMappingURL=Note.d.ts.map