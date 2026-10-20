import { z } from 'zod';
import mongoose from 'mongoose';

// Reusable validator using Mongoose's native ObjectId verification
const objectIdSchema = z.string().refine(
    (val) => mongoose.Types.ObjectId.isValid(val) && new mongoose.Types.ObjectId(val).toString() === val,
    { message: 'Must be a valid 24-character MongoDB ObjectId' }
);

// Reusable date validator that parses standard ISO date strings safely
const isoDateSchema = z.string().refine(
    (val) => !isNaN(Date.parse(val)),
    { message: 'Must be a valid date format (e.g. ISO 8601 string)' }
);

export const createSessionSchema = z.object({
    body: z
        .object({
            teacherId: objectIdSchema,
            startTime: isoDateSchema,
            endTime: isoDateSchema,
        })
        .refine(
            (data) => new Date(data.endTime).getTime() > new Date(data.startTime).getTime(),
            {
                message: 'endTime must be greater than startTime',
                path: ['endTime'],
            }
        ),
});

export const getAvailableSessionsSchema = z.object({
    query: z.object({
        dateTimestamp: z
            .string({ message: 'dateTimestamp query parameter is required' })
            .refine(
                (val) => {
                    const num = Number(val);
                    // Check if it's a numeric timestamp or a parsable date string
                    if (!isNaN(num) && num > 0) return true;
                    return !isNaN(Date.parse(val));
                },
                { message: 'dateTimestamp must be a valid numeric timestamp or ISO date string' }
            ),
    }),
});

export const bookSessionSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
    body: z.object({
        userId: objectIdSchema,
    }),
});

export const completeSessionSchema = z.object({
    params: z.object({
        id: objectIdSchema,
    }),
});