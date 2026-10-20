import { Router } from 'express';
import { createUser, getUserSessions } from '../controllers/userController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { createUserSchema, getUserSessionsSchema } from '../validations/userValidation.js';

const router = Router();

// API 1: POST /users
router.post('/', validateRequest(createUserSchema), createUser);

// API 6: GET /users/:id/sessions
router.get('/:id/sessions', validateRequest(getUserSessionsSchema), getUserSessions);

export default router;