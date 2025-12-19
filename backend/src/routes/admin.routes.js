import { Router } from 'express';

import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminOnly.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { listAllMessages, listLoginLogs } from '../controllers/admin.controller.js';

export const adminRouter = Router();

adminRouter.get('/login-logs', requireAuth, requireAdmin, asyncHandler(listLoginLogs));
adminRouter.get('/messages', requireAuth, requireAdmin, asyncHandler(listAllMessages));
