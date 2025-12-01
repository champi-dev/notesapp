import { Request, Response, NextFunction } from 'express';
export declare const rateLimiter: (windowMs?: number, maxRequests?: number) => (req: Request, res: Response, next: NextFunction) => void;
export declare const authRateLimiter: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=rateLimiter.d.ts.map