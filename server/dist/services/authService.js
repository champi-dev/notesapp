import { User } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, getRefreshTokenExpiry, } from '../utils/jwt.js';
import { AppError } from '../middleware/errorHandler.js';
export class AuthService {
    async register(input) {
        const existingUser = await User.findOne({ email: input.email });
        if (existingUser) {
            throw new AppError('Email already registered', 409, 'AUTH_002');
        }
        const hashedPassword = await hashPassword(input.password);
        const user = await User.create({
            ...input,
            password: hashedPassword,
        });
        const payload = { userId: user._id.toString(), email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        await RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            expiresAt: getRefreshTokenExpiry(),
        });
        return {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                theme: user.theme,
            },
            accessToken,
            refreshToken,
        };
    }
    async login(input) {
        const user = await User.findOne({ email: input.email });
        if (!user) {
            throw new AppError('Invalid credentials', 401, 'AUTH_001');
        }
        const isValidPassword = await comparePassword(input.password, user.password);
        if (!isValidPassword) {
            throw new AppError('Invalid credentials', 401, 'AUTH_001');
        }
        const payload = { userId: user._id.toString(), email: user.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        await RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            expiresAt: getRefreshTokenExpiry(),
        });
        return {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                theme: user.theme,
            },
            accessToken,
            refreshToken,
        };
    }
    async logout(userId, refreshToken) {
        if (refreshToken) {
            await RefreshToken.deleteOne({ token: refreshToken });
        }
        else {
            await RefreshToken.deleteMany({ userId });
        }
    }
    async refresh(refreshToken) {
        const storedToken = await RefreshToken.findOne({ token: refreshToken });
        if (!storedToken) {
            throw new AppError('Invalid refresh token', 401, 'AUTH_004');
        }
        try {
            const decoded = verifyRefreshToken(refreshToken);
            // Delete old token
            await RefreshToken.deleteOne({ token: refreshToken });
            // Generate new tokens
            const payload = { userId: decoded.userId, email: decoded.email };
            const newAccessToken = generateAccessToken(payload);
            const newRefreshToken = generateRefreshToken(payload);
            await RefreshToken.create({
                userId: decoded.userId,
                token: newRefreshToken,
                expiresAt: getRefreshTokenExpiry(),
            });
            return {
                accessToken: newAccessToken,
                newRefreshToken,
            };
        }
        catch {
            await RefreshToken.deleteOne({ token: refreshToken });
            throw new AppError('Invalid refresh token', 401, 'AUTH_004');
        }
    }
    async getUser(userId) {
        const user = await User.findById(userId).select('-password');
        return user;
    }
    async updateProfile(userId, input) {
        const user = await User.findByIdAndUpdate(userId, input, { new: true }).select('-password');
        if (!user) {
            throw new AppError('User not found', 404, 'AUTH_001');
        }
        return user;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404, 'AUTH_001');
        }
        const isValidPassword = await comparePassword(currentPassword, user.password);
        if (!isValidPassword) {
            throw new AppError('Current password is incorrect', 401, 'AUTH_001');
        }
        user.password = await hashPassword(newPassword);
        await user.save();
    }
}
export const authService = new AuthService();
//# sourceMappingURL=authService.js.map