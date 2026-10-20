"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = exports.SessionStatus = void 0;
const mongoose_1 = require("mongoose");
var SessionStatus;
(function (SessionStatus) {
    SessionStatus["AVAILABLE"] = "AVAILABLE";
    SessionStatus["BOOKED"] = "BOOKED";
    SessionStatus["COMPLETED"] = "COMPLETED";
})(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
const sessionSchema = new mongoose_1.Schema({
    teacherId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: [true, 'Teacher ID is required'],
        index: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
    versionKey: false,
});
// Compound index for querying available sessions by date range efficiently
sessionSchema.index({ status: 1, startTime: 1 });
exports.Session = (0, mongoose_1.model)('Session', sessionSchema);
