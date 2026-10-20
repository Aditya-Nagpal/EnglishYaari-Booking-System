"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSessions = exports.createTeacher = exports.createUser = void 0;
const asyncHandler_js_1 = require("../utils/asyncHandler.js");
const sessionService_js_1 = require("../services/sessionService.js");
const User_js_1 = require("../models/User.js");
const Teacher_js_1 = require("../models/Teacher.js");
const AppError_js_1 = require("../utils/AppError.js");
// API 1: POST /users
exports.createUser = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { fullName, email, phone } = req.body;
    // Check if email already registered
    const existingUser = await User_js_1.User.findOne({ email });
    if (existingUser) {
        throw new AppError_js_1.AppError('Email is already registered', 409);
    }
    const user = await User_js_1.User.create({ fullName, email, phone });
    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
    });
});
// Helper: POST /teachers (to create teachers for testing sessions)
exports.createTeacher = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const { fullName, email, specialization, experience } = req.body;
    const existingTeacher = await Teacher_js_1.Teacher.findOne({ email });
    if (existingTeacher) {
        throw new AppError_js_1.AppError('Teacher email is already registered', 409);
    }
    const teacher = await Teacher_js_1.Teacher.create({
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
exports.getUserSessions = (0, asyncHandler_js_1.asyncHandler)(async (req, res) => {
    const userId = req.params.id;
    // 1. Verify user exists
    const user = await User_js_1.User.findById(userId);
    if (!user) {
        throw new AppError_js_1.AppError('User not found with the provided userId', 404);
    }
    // 2. Fetch categorized sessions via Aggregation Pipeline
    const sessions = await (0, sessionService_js_1.getUserSessionsPipeline)(userId);
    res.status(200).json({
        success: true,
        data: sessions,
    });
});
