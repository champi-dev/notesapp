import mongoose, { Schema } from 'mongoose';
const noteSchema = new Schema({
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
    isTrashed: {
        type: Boolean,
        default: false,
    },
    trashedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});
noteSchema.index({ userId: 1, folderId: 1 });
noteSchema.index({ userId: 1, isTrashed: 1 });
noteSchema.index({ userId: 1, isPinned: 1 });
noteSchema.index({ tags: 1 });
noteSchema.index({ plainText: 'text', title: 'text' });
export const Note = mongoose.model('Note', noteSchema);
//# sourceMappingURL=Note.js.map