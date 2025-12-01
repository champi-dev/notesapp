import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

const cleanupStore = (): void => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
};

setInterval(cleanupStore, 60000);

export const rateLimiter = (windowMs?: number, maxRequests?: number) => {
  const window = windowMs || env.RATE_LIMIT_WINDOW_MS;
  const max = maxRequests || env.RATE_LIMIT_MAX;

  return (req: Request, res: Response, next: NextFunction): void => {
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

// More permissive in development
const isDev = env.NODE_ENV === 'development';
export const authRateLimiter = rateLimiter(
  isDev ? 1 * 60 * 1000 : 15 * 60 * 1000, // 1 min in dev, 15 min in prod
  isDev ? 100 : 10 // 100 requests in dev, 10 in prod
);
