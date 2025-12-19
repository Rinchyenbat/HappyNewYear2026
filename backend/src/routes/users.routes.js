import { Router } from 'express';

import { requireAuth } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { listUsers } from '../controllers/users.controller.js';

export const usersRouter = Router();

usersRouter.get('/', requireAuth, asyncHandler(listUsers));
