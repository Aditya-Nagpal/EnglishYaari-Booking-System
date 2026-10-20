"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Teacher = void 0;
const mongoose_1 = require("mongoose");
const teacherSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    versionKey: false,
});
exports.Teacher = (0, mongoose_1.model)('Teacher', teacherSchema);
