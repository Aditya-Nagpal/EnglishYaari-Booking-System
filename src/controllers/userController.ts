import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getUserSessionsPipeline } from '../services/sessionService.js';
import { User } from '../models/User.js';
import { Teacher } from '../models/Teacher.js';
import { AppError } from '../utils/AppError.js';

// API 1: POST /users
export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, email, phone } = req.body;

    // Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError('Email is already registered', 409);
    }

    const user = await User.create({ fullName, email, phone });

    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
    });
});

// Helper: POST /teachers (to create teachers for testing sessions)
export const createTeacher = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, email, specialization, experience } = req.body;

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
        throw new AppError('Teacher email is already registered', 409);
    }

    const teacher = await Teacher.create({
        fullName,
        email,
        specialization,
        experience,
    });

    res.status(201).json({
        success: true,
        message: 'Teacher created successfully',
        data: teacher,
    });
});

// API 6: GET /users/:id/sessions
export const getUserSessions = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id as string;

    // 1. Verify user exists
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('User not found with the provided userId', 404);
    }

    // 2. Fetch categorized sessions via Aggregation Pipeline
    const sessions = await getUserSessionsPipeline(userId);

    res.status(200).json({
        success: true,
        data: sessions,
    });
});