import { env } from '../config/env.js';
const store = {};
const cleanupStore = () => {
    const now = Date.now();
    for (const key in store) {
        if (store[key].resetTime < now) {
            delete store[key];
        }
    }
};
setInterval(cleanupStore, 60000);
export const rateLimiter = (windowMs, maxRequests) => {
    const window = windowMs || env.RATE_LIMIT_WINDOW_MS;
    const max = maxRequests || env.RATE_LIMIT_MAX;
    return (req, res, next) => {
        const key = req.ip || 'unknown';
        const now = Date.now();
        if (!store[key] || store[key].resetTime < now) {
            store[key] = {
                count: 1,
                resetTime: now + window,
            };
            next();
            return;
        }
        store[key].count++;
        if (store[key].count > max) {
            res.status(429).json({
                error: {
                    message: 'Too many requests, please try again later',
                    code: 'RATE_001',
                },
            });
            return;
        }
        next();
    };
};
export const authRateLimiter = rateLimiter(15 * 60 * 1000, 10); // 10 requests per 15 minutes
//# sourceMappingURL=rateLimiter.js.map