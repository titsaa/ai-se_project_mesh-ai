import { Router } from 'express';

import { getCurrentUser } from '../controllers/auth.js';

export const authRouter = Router();

authRouter.get('/me', getCurrentUser);
