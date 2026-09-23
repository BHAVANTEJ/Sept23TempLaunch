import cors from 'cors';
import express from 'express';
import { healthRoutes } from './routes/healthRoutes.js';
import { registerRoutes } from './routes/registerRoutes.js';
import { waitlistRoutes } from './routes/waitlistRoutes.js';

export const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/health', healthRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/register', registerRoutes);
