import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    avatar: {
        type: String,
        default: null,
    },
    theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
    },
}, {
    timestamps: true,
});
userSchema.index({ email: 1 }, { unique: true });
export const User = mongoose.model('User', userSchema);
//# sourceMappingURL=User.js.map