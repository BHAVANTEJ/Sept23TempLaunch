import { Router } from 'express';
import { waitlistController } from '../controllers/waitlistController.js';

export const waitlistRoutes = Router();
waitlistRoutes.post('/', waitlistController);
