"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSessionsSchema = exports.createTeacherSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const emailSchema = zod_1.z
    .string()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address');
const objectIdSchema = zod_1.z.string().refine((val) => mongoose_1.default.Types.ObjectId.isValid(val) && new mongoose_1.default.Types.ObjectId(val).toString() === val, { message: 'Must be a valid 24-character MongoDB ObjectId' });
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().trim().min(1, 'fullName is required'),
        email: emailSchema,
        phone: zod_1.z.string().trim().min(6, 'phone must be at least 6 digits'),
    }),
});
exports.createTeacherSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().trim().min(1, 'fullName is required'),
        email: emailSchema,
        specialization: zod_1.z.string().trim().min(1, 'specialization is required'),
        experience: zod_1.z.number().min(0, 'experience cannot be negative'),
    }),
});
exports.getUserSessionsSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: objectIdSchema,
    }),
});
