import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Session, SessionStatus } from '../models/Session.js';
import { getAvailableSessionsPipeline } from '../services/sessionService.js';
import { Teacher } from '../models/Teacher.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';


// API 2: POST /sessions
export const createSession = asyncHandler(async (req: Request, res: Response) => {
    const { teacherId, startTime, endTime } = req.body;

    // 1. Validate teacher exists
    const teacherExists = await Teacher.findById(teacherId);
    if (!teacherExists) {
        throw new AppError('Teacher not found with the provided teacherId', 404);
    }

    // 2. Create session with default status AVAILABLE
    const session = await Session.create({
        teacherId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: SessionStatus.AVAILABLE,
        userId: null,
        completedAt: null,
    });

    res.status(201).json({
        success: true,
        message: 'Session created successfully',
        data: session,
    });
});


// API 3: GET /sessions/available?dateTimestamp={timestamp}
export const getAvailableSessions = asyncHandler(async (req: Request, res: Response) => {
    const { dateTimestamp } = req.query;

    // Parse either numeric timestamp or date string
    const parsedNum = Number(dateTimestamp);
    const targetDate = !isNaN(parsedNum) && parsedNum > 0
        ? new Date(parsedNum)
        : new Date(dateTimestamp as string);

    const sessions = await getAvailableSessionsPipeline(targetDate);

    res.status(200).json({
        success: true,
        count: sessions.length,
        data: sessions,
    });
});

// API 4: POST /sessions/:id/book
export const bookSession = asyncHandler(async (req: Request, res: Response) => {
    const { id: sessionId } = req.params;
    const { userId } = req.body;

    // 1. Verify user exists
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError('User not found with the provided userId', 404);
    }

    // 2. Verify session exists
    const existingSession = await Session.findById(sessionId);
    if (!existingSession) {
        throw new AppError('Session not found', 404);
    }

    // 3. Check if session is already booked or completed
    if (existingSession.status !== SessionStatus.AVAILABLE) {
        throw new AppError(
            `Session cannot be booked because it is already ${existingSession.status.toLowerCase()}`,
            409
        );
    }

    // 4. Atomic update: ensure it is still AVAILABLE at the moment of update
    const updatedSession = await Session.findOneAndUpdate(
        { _id: sessionId, status: SessionStatus.AVAILABLE },
        {
            $set: {
                status: SessionStatus.BOOKED,
                userId: user._id,
            },
        },
        { new: true }
    );

    // If another concurrent request booked it simultaneously:
    if (!updatedSession) {
        throw new AppError('Session was just booked by another user. Please choose another slot.', 409);
    }

    res.status(200).json({
        success: true,
        message: 'Session booked successfully',
        data: updatedSession,
    });
});

// API 5: PATCH /sessions/:id/complete
export const completeSession = asyncHandler(async (req: Request, res: Response) => {
    const { id: sessionId } = req.params;

    // 1. Verify session exists
    const session = await Session.findById(sessionId);
    if (!session) {
        throw new AppError('Session not found', 404);
    }

    // 2. Only BOOKED sessions can be marked as completed
    if (session.status !== SessionStatus.BOOKED) {
        throw new AppError(
            `Cannot complete session. Only BOOKED sessions can be marked as completed (current status: ${session.status})`,
            400
        );
    }

    // 3. Update status to COMPLETED and record completedAt
    session.status = SessionStatus.COMPLETED;
    session.completedAt = new Date();
    await session.save();

    res.status(200).json({
        success: true,
        message: 'Session marked as completed successfully',
        data: session,
    });
});