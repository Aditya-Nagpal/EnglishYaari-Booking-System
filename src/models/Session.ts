import { Schema, model, Document, Types } from 'mongoose';

export enum SessionStatus {
    AVAILABLE = 'AVAILABLE',
    BOOKED = 'BOOKED',
    COMPLETED = 'COMPLETED',
}

export interface ISession extends Document {
    teacherId: Types.ObjectId;
    userId: Types.ObjectId | null;
    startTime: Date;
    endTime: Date;
    status: SessionStatus;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
    {
        teacherId: {
            type: Schema.Types.ObjectId,
            ref: 'Teacher',
            required: [true, 'Teacher ID is required'],
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
            index: true,
        },
        startTime: {
            type: Date,
            required: [true, 'Start time is required'],
        },
        endTime: {
            type: Date,
            required: [true, 'End time is required'],
        },
        status: {
            type: String,
            enum: {
                values: Object.values(SessionStatus),
                message: '{VALUE} is not a valid session status',
            },
            default: SessionStatus.AVAILABLE,
            index: true,
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Compound index for querying available sessions by date range efficiently
sessionSchema.index({ status: 1, startTime: 1 });

export const Session = model<ISession>('Session', sessionSchema);