import { Router } from 'express';
import { body } from 'express-validator';

import { requireAuth } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { handleValidation } from '../validators/common.js';
import { inbox, sendMessage, sent } from '../controllers/messages.controller.js';

export const messagesRouter = Router();

messagesRouter.post(
  '/',
  requireAuth,
  [
    body('receiver_id')
      .exists({ checkFalsy: true })
      .withMessage('receiver_id is required')
      .isString()
      .withMessage('receiver_id must be a string')
      .trim(),
    body('content')
      .exists({ checkFalsy: true })
      .withMessage('content is required')
      .isString()
      .withMessage('content must be a string')
      .isLength({ min: 1, max: 2000 })
      .withMessage('content length invalid')
      .trim(),
    body('is_anonymous')
      .optional()
      .isBoolean()
      .withMessage('is_anonymous must be boolean')
      .toBoolean(),
    handleValidation
  ],
  asyncHandler(sendMessage)
);

messagesRouter.get('/inbox', requireAuth, asyncHandler(inbox));
messagesRouter.get('/sent', requireAuth, asyncHandler(sent));
