"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_js_1 = require("../controllers/userController.js");
const validateRequest_js_1 = require("../middlewares/validateRequest.js");
const userValidation_js_1 = require("../validations/userValidation.js");
const router = (0, express_1.Router)();
// POST /teachers
router.post('/', (0, validateRequest_js_1.validateRequest)(userValidation_js_1.createTeacherSchema), userController_js_1.createTeacher);
exports.default = router;
