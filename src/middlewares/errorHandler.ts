import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';
import mongoose from 'mongoose';

export const errorHandler: ErrorRequestHandler = (
    err: any,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
): void => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // 1. Mongoose Bad ObjectId (CastError)
    if (err instanceof mongoose.Error.CastError) {
        statusCode = 400;
        message = `Invalid format for field '${err.path}': ${err.value}`;
    }

    // 2. Mongoose Duplicate Key Error (e.g. unique email violation)
    if (err.code === 11000) {
        statusCode = 409;
        const duplicatedField = Object.keys(err.keyValue || {})[0];
        message = duplicatedField
            ? `A record with this ${duplicatedField} already exists.`
            : 'Duplicate key error.';
    }

    // 3. Mongoose Validation Error
    if (err instanceof mongoose.Error.ValidationError) {
        statusCode = 400;
        const errors = Object.values(err.errors).map((el: any) => el.message);
        message = `Validation Error: ${errors.join(', ')}`;
    }

    // Send standardized JSON response
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};