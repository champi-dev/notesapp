import { IUser } from '../models/User.js';
import type { RegisterInput, LoginInput, UpdateProfileInput } from '../validators/authValidators.js';
export declare class AuthService {
    register(input: RegisterInput): Promise<{
        user: Partial<IUser>;
        accessToken: string;
        refreshToken: string;
    }>;
    login(input: LoginInput): Promise<{
        user: Partial<IUser>;
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, refreshToken?: string): Promise<void>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        newRefreshToken: string;
    }>;
    getUser(userId: string): Promise<Partial<IUser> | null>;
    updateProfile(userId: string, input: UpdateProfileInput): Promise<Partial<IUser>>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
}
export declare const authService: AuthService;
//# sourceMappingURL=authService.d.ts.map