import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  code: string;
  field?: string;

  constructor(message: string, statusCode: number, code: string, field?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.field = field;
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
        ...(err.field && { field: err.field }),
      },
    });
    return;
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    res.status(409).json({
      error: {
        message: 'Resource already exists',
        code: 'DUPLICATE_KEY',
      },
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: {
        message: err.message,
        code: 'VAL_001',
      },
    });
    return;
  }

  // Default error
  res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'SERVER_001',
    },
  });
};
