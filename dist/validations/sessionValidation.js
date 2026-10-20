"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeSessionSchema = exports.bookSessionSchema = exports.getAvailableSessionsSchema = exports.createSessionSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
// Reusable validator using Mongoose's native ObjectId verification
const objectIdSchema = zod_1.z.string().refine((val) => mongoose_1.default.Types.ObjectId.isValid(val) && new mongoose_1.default.Types.ObjectId(val).toString() === val, { message: 'Must be a valid 24-character MongoDB ObjectId' });
// Reusable date validator that parses standard ISO date strings safely
const isoDateSchema = zod_1.z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Must be a valid date format (e.g. ISO 8601 string)' });
exports.createSessionSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        teacherId: objectIdSchema,
        startTime: isoDateSchema,
        endTime: isoDateSchema,
    })
        .refine((data) => new Date(data.endTime).getTime() > new Date(data.startTime).getTime(), {
        message: 'endTime must be greater than startTime',
        path: ['endTime'],
    }),
});
exports.getAvailableSessionsSchema = zod_1.z.object({
    query: zod_1.z.object({
        dateTimestamp: zod_1.z
            .string({ message: 'dateTimestamp query parameter is required' })
            .refine((val) => {
            const num = Number(val);
            // Check if it's a numeric timestamp or a parsable date string
            if (!isNaN(num) && num > 0)
                return true;
            return !isNaN(Date.parse(val));
        }, { message: 'dateTimestamp must be a valid numeric timestamp or ISO date string' }),
    }),
});
exports.bookSessionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: objectIdSchema,
    }),
    body: zod_1.z.object({
        userId: objectIdSchema,
    }),
});
exports.completeSessionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: objectIdSchema,
    }),
});
