import { Router } from 'express';
import { registerController } from '../controllers/registerController.js';
import { verifyOtpController } from '../controllers/verifyOtpController.js';

export const registerRoutes = Router();
registerRoutes.post('/', registerController);
registerRoutes.post('/verify', verifyOtpController);
