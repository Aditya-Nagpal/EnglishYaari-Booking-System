"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sessionController_js_1 = require("../controllers/sessionController.js");
const validateRequest_js_1 = require("../middlewares/validateRequest.js");
const sessionValidation_js_1 = require("../validations/sessionValidation.js");
const router = (0, express_1.Router)();
// API 2: POST /sessions
router.post('/', (0, validateRequest_js_1.validateRequest)(sessionValidation_js_1.createSessionSchema), sessionController_js_1.createSession);
// API 3: GET /sessions/available?dateTimestamp={timestamp}
router.get('/available', (0, validateRequest_js_1.validateRequest)(sessionValidation_js_1.getAvailableSessionsSchema), sessionController_js_1.getAvailableSessions);
// API 4: POST /sessions/:id/book
router.post('/:id/book', (0, validateRequest_js_1.validateRequest)(sessionValidation_js_1.bookSessionSchema), sessionController_js_1.bookSession);
// API 5: PATCH /sessions/:id/complete
router.patch('/:id/complete', (0, validateRequest_js_1.validateRequest)(sessionValidation_js_1.completeSessionSchema), sessionController_js_1.completeSession);
exports.default = router;
