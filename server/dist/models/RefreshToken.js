import mongoose, { Schema } from 'mongoose';
const refreshTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 },
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
});
refreshTokenSchema.index({ token: 1 }, { unique: true });
export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
//# sourceMappingURL=RefreshToken.js.map