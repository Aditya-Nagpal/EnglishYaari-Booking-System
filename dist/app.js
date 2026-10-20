"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_js_1 = __importDefault(require("./routes/userRoutes.js"));
const teacherRoutes_js_1 = __importDefault(require("./routes/teacherRoutes.js"));
const sessionRoutes_js_1 = __importDefault(require("./routes/sessionRoutes.js"));
const notFoundHandler_js_1 = require("./middlewares/notFoundHandler.js");
const errorHandler_js_1 = require("./middlewares/errorHandler.js");
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Mount Routes
app.use('/users', userRoutes_js_1.default);
app.use('/teachers', teacherRoutes_js_1.default);
app.use('/sessions', sessionRoutes_js_1.default);
// Fallback 404 handler for unknown routes
app.use(notFoundHandler_js_1.notFoundHandler);
// Centralized error handling middleware (must be registered last)
app.use(errorHandler_js_1.errorHandler);
exports.default = app;
