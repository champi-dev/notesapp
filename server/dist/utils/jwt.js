import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    });
};
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
};
export const getRefreshTokenExpiry = () => {
    const match = env.JWT_REFRESH_EXPIRES_IN.match(/^(\d+)([dhms])$/);
    if (!match) {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // default 7 days
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };
    return new Date(Date.now() + value * multipliers[unit]);
};
//# sourceMappingURL=jwt.js.map