import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    next(new AppError(`Cannot find route ${req.method} ${req.originalUrl}`, 404));
};