"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const errorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    // 1. Mongoose Bad ObjectId (CastError)
    if (err instanceof mongoose_1.default.Error.CastError) {
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
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        statusCode = 400;
        const errors = Object.values(err.errors).map((el) => el.message);
        message = `Validation Error: ${errors.join(', ')}`;
    }
    // Send standardized JSON response
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
