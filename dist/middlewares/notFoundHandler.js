"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const AppError_js_1 = require("../utils/AppError.js");
const notFoundHandler = (req, res, next) => {
    next(new AppError_js_1.AppError(`Cannot find route ${req.method} ${req.originalUrl}`, 404));
};
exports.notFoundHandler = notFoundHandler;
