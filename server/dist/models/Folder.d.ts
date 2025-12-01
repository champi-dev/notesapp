import mongoose, { Document } from 'mongoose';
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
export declare const Folder: mongoose.Model<IFolder, {}, {}, {}, mongoose.Document<unknown, {}, IFolder, {}, mongoose.DefaultSchemaOptions> & IFolder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IFolder>;
//# sourceMappingURL=Folder.d.ts.map