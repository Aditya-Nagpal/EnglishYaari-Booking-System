import { Router } from 'express';
import { createTeacher } from '../controllers/userController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createTeacherSchema } from '../validations/userValidation.js';

const router = Router();

// POST /teachers
router.post('/', validateRequest(createTeacherSchema), createTeacher);

export default router;