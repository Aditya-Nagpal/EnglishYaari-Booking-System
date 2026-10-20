import express, { Application, Request, Response } from 'express';
import userRoutes from './routes/userRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app: Application = express();

app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount Routes
app.use('/users', userRoutes);
app.use('/teachers', teacherRoutes);
app.use('/sessions', sessionRoutes);

// Fallback 404 handler for unknown routes
app.use(notFoundHandler);

// Centralized error handling middleware (must be registered last)
app.use(errorHandler);

export default app;