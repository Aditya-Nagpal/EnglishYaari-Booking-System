import { Router } from 'express';
import {
    createSession,
    getAvailableSessions,
    bookSession,
    completeSession
} from '../controllers/sessionController.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
    createSessionSchema,
    getAvailableSessionsSchema,
    bookSessionSchema,
    completeSessionSchema
} from '../validations/sessionValidation.js';

const router = Router();

// API 2: POST /sessions
router.post('/', validateRequest(createSessionSchema), createSession);

// API 3: GET /sessions/available?dateTimestamp={timestamp}
router.get('/available', validateRequest(getAvailableSessionsSchema), getAvailableSessions);

// API 4: POST /sessions/:id/book
router.post('/:id/book', validateRequest(bookSessionSchema), bookSession);

// API 5: PATCH /sessions/:id/complete
router.patch('/:id/complete', validateRequest(completeSessionSchema), completeSession);

export default router;