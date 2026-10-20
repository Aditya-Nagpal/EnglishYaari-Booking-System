"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeSession = exports.bookSession = exports.getAvailableSessions = exports.createSession = void 0;
const asyncHandler_js_1 = require("../utils/asyncHandler.js");
const Session_js_1 = require("../models/Session.js");
const sessionService_js_1 = require("../services/sessionService.js");
const Teacher_js_1 = require("../models/Teacher.js");
const User_js_1 = require("../models/User.js");
const AppError_js_1 = require("../utils/AppError.js");
// API 2: POST /sessions
exports.createSession = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { teacherId, startTime, endTime } = req.body;
    // 1. Validate teacher exists
    const teacherExists = await Teacher_js_1.Teacher.findById(teacherId);
    if (!teacherExists) {
        throw new AppError_js_1.AppError('Teacher not found with the provided teacherId', 404);
    }
    // 2. Create session with default status AVAILABLE
    const session = await Session_js_1.Session.create({
        teacherId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: Session_js_1.SessionStatus.AVAILABLE,
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
exports.getAvailableSessions = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { dateTimestamp } = req.query;
    // Parse either numeric timestamp or date string
    const parsedNum = Number(dateTimestamp);
    const targetDate = !isNaN(parsedNum) && parsedNum > 0
        ? new Date(parsedNum)
        : new Date(dateTimestamp);
    const sessions = await (0, sessionService_js_1.getAvailableSessionsPipeline)(targetDate);
    res.status(200).json({
        success: true,
        count: sessions.length,
        data: sessions,
    });
});
// API 4: POST /sessions/:id/book
exports.bookSession = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { id: sessionId } = req.params;
    const { userId } = req.body;
    // 1. Verify user exists
    const user = await User_js_1.User.findById(userId);
    if (!user) {
        throw new AppError_js_1.AppError('User not found with the provided userId', 404);
    }
    // 2. Verify session exists
    const existingSession = await Session_js_1.Session.findById(sessionId);
    if (!existingSession) {
        throw new AppError_js_1.AppError('Session not found', 404);
    }
    // 3. Check if session is already booked or completed
    if (existingSession.status !== Session_js_1.SessionStatus.AVAILABLE) {
        throw new AppError_js_1.AppError(`Session cannot be booked because it is already ${existingSession.status.toLowerCase()}`, 409);
    }
    // 4. Atomic update: ensure it is still AVAILABLE at the moment of update
    const updatedSession = await Session_js_1.Session.findOneAndUpdate({ _id: sessionId, status: Session_js_1.SessionStatus.AVAILABLE }, {
        $set: {
            status: Session_js_1.SessionStatus.BOOKED,
            userId: user._id,
        },
    }, { new: true });
    // If another concurrent request booked it simultaneously:
    if (!updatedSession) {
        throw new AppError_js_1.AppError('Session was just booked by another user. Please choose another slot.', 409);
    }
    res.status(200).json({
        success: true,
        message: 'Session booked successfully',
        data: updatedSession,
    });
});
// API 5: PATCH /sessions/:id/complete
exports.completeSession = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { id: sessionId } = req.params;
    // 1. Verify session exists
    const session = await Session_js_1.Session.findById(sessionId);
    if (!session) {
        throw new AppError_js_1.AppError('Session not found', 404);
    }
    // 2. Only BOOKED sessions can be marked as completed
    if (session.status !== Session_js_1.SessionStatus.BOOKED) {
        throw new AppError_js_1.AppError(`Cannot complete session. Only BOOKED sessions can be marked as completed (current status: ${session.status})`, 400);
    }
    // 3. Update status to COMPLETED and record completedAt
    session.status = Session_js_1.SessionStatus.COMPLETED;
    session.completedAt = new Date();
    await session.save();
    res.status(200).json({
        success: true,
        message: 'Session marked as completed successfully',
        data: session,
    });
});
