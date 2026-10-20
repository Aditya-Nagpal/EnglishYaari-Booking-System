"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const AppError_js_1 = require("../utils/AppError.js");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                // Modern Zod uses 'issues' instead of 'errors'
                const errorMessages = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
                return next(new AppError_js_1.AppError(`Validation failed: ${errorMessages.join('; ')}`, 400));
            }
            next(error);
        }
    };
};
exports.validateRequest = validateRequest;
