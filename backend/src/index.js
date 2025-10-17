import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { authRouter } from './routes/authRoutes.js';
import { userRouter } from './routes/userRoutes.js';
import { quizRouter } from './routes/quizRoutes.js';
import { analyticsRouter } from './routes/analyticsRoutes.js';
import { timetableRouter } from './routes/timetableRoutes.js';
import { moduleRouter } from './routes/moduleRoutes.js';
import { dashboardRouter } from './routes/dashboardRoutes.js';

dotenv.config();

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    service: 'backend', 
    env: process.env.NODE_ENV || 'dev',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/quizzes', quizRouter);
app.use('/analytics', analyticsRouter);
app.use('/timetable', timetableRouter);
app.use('/modules', moduleRouter);
app.use('/dashboard', dashboardRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});


