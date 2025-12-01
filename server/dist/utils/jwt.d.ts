import type { JwtPayload } from '../types/index.js';
export declare const generateAccessToken: (payload: JwtPayload) => string;
export declare const generateRefreshToken: (payload: JwtPayload) => string;
export declare const verifyAccessToken: (token: string) => JwtPayload;
export declare const verifyRefreshToken: (token: string) => JwtPayload;
export declare const getRefreshTokenExpiry: () => Date;
//# sourceMappingURL=jwt.d.ts.map