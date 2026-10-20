import { z } from 'zod';
import mongoose from 'mongoose';

const emailSchema = z
    .string()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address');

const objectIdSchema = z.string().refine(
    (val) => mongoose.Types.ObjectId.isValid(val) && new mongoose.Types.ObjectId(val).toString() === val,
    { message: 'Must be a valid 24-character MongoDB ObjectId' }
);

export const createUserSchema = z.object({
    body: z.object({
        fullName: z.string().trim().min(1, 'fullName is required'),
        email: emailSchema,
        phone: z.string().trim().min(6, 'phone must be at least 6 digits'),
    }),
});

export const createTeacherSchema = z.object({
    body: z.object({
        fullName: z.string().trim().min(1, 'fullName is required'),
        email: emailSchema,
        specialization: z.string().trim().min(1, 'specialization is required'),
        experience: z.number().min(0, 'experience cannot be negative'),
    }),
});

export const getUserSessionsSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
});