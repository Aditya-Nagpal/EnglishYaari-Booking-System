import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

export const validateRequest = (schema: ZodType<any>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Modern Zod uses 'issues' instead of 'errors'
        const errorMessages = error.issues.map(
          (issue) => `${issue.path.join('.')}: ${issue.message}`
        );
        return next(
          new AppError(`Validation failed: ${errorMessages.join('; ')}`, 400)
        );
      }
      next(error);
    }
  };
};