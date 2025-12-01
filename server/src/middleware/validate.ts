import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request & { validatedQuery?: unknown }, res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse(req[source]);
      // In Express 5, req.query is read-only, so store validated data differently
      if (source === 'query') {
        req.validatedQuery = data;
      } else {
        req[source] = data;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        res.status(400).json({
          error: {
            message: 'Validation failed',
            code: 'VAL_001',
            details: errors,
          },
        });
        return;
      }
      next(error);
    }
  };
};
