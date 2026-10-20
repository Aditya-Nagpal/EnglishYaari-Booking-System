"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_js_1 = require("../controllers/userController.js");
const validateRequest_js_1 = require("../middlewares/validateRequest.js");
const userValidation_js_1 = require("../validations/userValidation.js");
const router = (0, express_1.Router)();
// API 1: POST /users
router.post('/', (0, validateRequest_js_1.validateRequest)(userValidation_js_1.createUserSchema), userController_js_1.createUser);
// API 6: GET /users/:id/sessions
router.get('/:id/sessions', (0, validateRequest_js_1.validateRequest)(userValidation_js_1.getUserSessionsSchema), userController_js_1.getUserSessions);
exports.default = router;
