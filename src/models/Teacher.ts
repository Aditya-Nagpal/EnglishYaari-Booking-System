import { Schema, model, Document } from 'mongoose';

export interface ITeacher extends Document {
    fullName: string;
    email: string;
    specialization: string;
    experience: number; // in years
    createdAt: Date;
    updatedAt: Date;
}

const teacherSchema = new Schema<ITeacher>(
    {
        fullName: {
            type: String,
            required: [true, 'Full name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        specialization: {
            type: String,
            required: [true, 'Specialization is required'],
            trim: true,
        },
        experience: {
            type: Number,
            required: [true, 'Experience (years) is required'],
            min: [0, 'Experience cannot be negative'],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Teacher = model<ITeacher>('Teacher', teacherSchema);