"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserSessionsPipeline = exports.getAvailableSessionsPipeline = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Session_js_1 = require("../models/Session.js");
const getAvailableSessionsPipeline = async (inputDate) => {
    // 1. Calculate boundaries for the entire calendar day (UTC)
    const startOfDay = new Date(inputDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(inputDate);
    endOfDay.setUTCHours(23, 59, 59, 999);
    // 2. Aggregation Pipeline
    const sessions = await Session_js_1.Session.aggregate([
        // Stage 1: Match available sessions within the specified date range
        {
            $match: {
                status: Session_js_1.SessionStatus.AVAILABLE,
                startTime: {
                    $gte: startOfDay,
                    $lte: endOfDay,
                },
            },
        },
        // Stage 2: Join teacher information from teachers collection
        {
            $lookup: {
                from: 'teachers',
                localField: 'teacherId',
                foreignField: '_id',
                as: 'teacher',
            },
        },
        // Stage 3: Unwind teacher array to an object
        {
            $unwind: {
                path: '$teacher',
                preserveNullAndEmptyArrays: true,
            },
        },
        // Stage 4: Project clean response fields
        {
            $project: {
                _id: 1,
                startTime: 1,
                endTime: 1,
                status: 1,
                createdAt: 1,
                teacher: {
                    _id: '$teacher._id',
                    fullName: '$teacher.fullName',
                    email: '$teacher.email',
                    specialization: '$teacher.specialization',
                    experience: '$teacher.experience',
                },
            },
        },
        // Stage 5: Sort by startTime ascending
        {
            $sort: { startTime: 1 },
        },
    ]);
    return sessions;
};
exports.getAvailableSessionsPipeline = getAvailableSessionsPipeline;
const getUserSessionsPipeline = async (userId) => {
    const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
    const [result] = await Session_js_1.Session.aggregate([
        // Stage 1: Match all sessions associated with this user
        {
            $match: {
                userId: userObjectId,
            },
        },
        // Stage 2: Join teacher information
        {
            $lookup: {
                from: 'teachers',
                localField: 'teacherId',
                foreignField: '_id',
                as: 'teacher',
            },
        },
        // Stage 3: Flatten teacher array
        {
            $unwind: {
                path: '$teacher',
                preserveNullAndEmptyArrays: true,
            },
        },
        // Stage 4: Project clean representation
        {
            $project: {
                _id: 1,
                startTime: 1,
                endTime: 1,
                status: 1,
                completedAt: 1,
                createdAt: 1,
                teacher: {
                    _id: '$teacher._id',
                    fullName: '$teacher.fullName',
                    email: '$teacher.email',
                    specialization: '$teacher.specialization',
                    experience: '$teacher.experience',
                },
            },
        },
        // Stage 5: Sort chronologically
        {
            $sort: { startTime: 1 },
        },
        // Stage 6: Facet into Upcoming and Completed streams
        {
            $facet: {
                upcomingSessions: [
                    {
                        $match: {
                            status: Session_js_1.SessionStatus.BOOKED,
                        },
                    },
                ],
                completedSessions: [
                    {
                        $match: {
                            status: Session_js_1.SessionStatus.COMPLETED,
                        },
                    },
                    {
                        $sort: { completedAt: -1 }, // Most recently completed first
                    },
                ],
            },
        },
    ]);
    return {
        upcomingSessions: result?.upcomingSessions || [],
        completedSessions: result?.completedSessions || [],
    };
};
exports.getUserSessionsPipeline = getUserSessionsPipeline;
