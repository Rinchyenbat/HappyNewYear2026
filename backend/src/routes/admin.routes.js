import { Router } from 'express';

import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminOnly.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
	approvePendingFacebookLogin,
	deleteUserById,
	listAllMessages,
	listLoginLogs,
	listPendingFacebookLogins,
	listUsers
} from '../controllers/admin.controller.js';

export const adminRouter = Router();

adminRouter.get('/login-logs', requireAuth, requireAdmin, asyncHandler(listLoginLogs));
adminRouter.get('/messages', requireAuth, requireAdmin, asyncHandler(listAllMessages));

adminRouter.get('/pending-facebook-logins', requireAuth, requireAdmin, asyncHandler(listPendingFacebookLogins));
adminRouter.post('/pending-facebook-logins/approve', requireAuth, requireAdmin, asyncHandler(approvePendingFacebookLogin));

adminRouter.get('/users', requireAuth, requireAdmin, asyncHandler(listUsers));
adminRouter.delete('/users/:id', requireAuth, requireAdmin, asyncHandler(deleteUserById));
