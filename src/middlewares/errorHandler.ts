import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';
import mongoose from 'mongoose';

export const errorHandler: ErrorRequestHandler = (
    err: unknown,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
): void => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    // 1. Operational application errors (thrown via new AppError)
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // 2. Mongoose Bad ObjectId (CastError)
    else if (err instanceof mongoose.Error.CastError) {
        statusCode = 400;
        message = `Invalid format for field '${err.path}': ${err.value}`;
    }
    // 3. Mongoose Duplicate Key Error (e.g. unique email violation)
    else if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: unknown }).code === 11000) {
        statusCode = 409;
        const mongoErr = err as { keyValue?: Record<string, unknown> };
        const duplicatedField = Object.keys(mongoErr.keyValue || {})[0];
        message = duplicatedField
            ? `A record with this ${duplicatedField} already exists.`
            : 'Duplicate key error.';
    }
    // 4. Mongoose Validation Error
    else if (err instanceof mongoose.Error.ValidationError) {
        statusCode = 400;
        const errors = Object.values(err.errors).map((el) => el.message);
        message = `Validation Error: ${errors.join(', ')}`;
    }
    // 5. Fallback for unexpected native Error instances
    else if (err instanceof Error) {
        message = err.message;
    }

    const stack = err instanceof Error ? err.stack : undefined;

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack }),
    });
};