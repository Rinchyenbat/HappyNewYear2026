import { Router } from 'express';
import { body } from 'express-validator';

import { requireAuth } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { handleValidation } from '../validators/common.js';
import { getMyProfile, listUsers, updateMyProfile } from '../controllers/users.controller.js';

export const usersRouter = Router();

usersRouter.get('/', requireAuth, asyncHandler(listUsers));

usersRouter.get('/profile', requireAuth, asyncHandler(getMyProfile));

usersRouter.patch(
	'/profile',
	requireAuth,
	[
		body('avatarId')
			.exists({ checkFalsy: true })
			.withMessage('avatarId is required')
			.isString()
			.withMessage('avatarId must be a string')
			.isLength({ min: 1, max: 40 })
			.withMessage('avatarId length invalid')
			.trim(),
		handleValidation
	],
	asyncHandler(updateMyProfile)
);
