import { Router } from 'express';
import { body, param } from 'express-validator';

import { requireAuth } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { handleValidation } from '../validators/common.js';
import {
  inbox,
  sendLetter,
  sent,
  getLetter,
  markRead
} from '../controllers/letters.controller.js';

export const lettersRouter = Router();

lettersRouter.post(
  '/',
  requireAuth,
  [
    body('toUsername')
      .exists({ checkFalsy: true })
      .withMessage('toUsername is required')
      .isString()
      .withMessage('toUsername must be a string')
      .isLength({ min: 1, max: 64 })
      .withMessage('toUsername length invalid')
      .trim(),
    body('title')
      .optional()
      .isString()
      .withMessage('title must be a string')
      .isLength({ max: 200 })
      .withMessage('title too long')
      .trim(),
    body('body')
      .exists({ checkFalsy: true })
      .withMessage('body is required')
      .isString()
      .withMessage('body must be a string')
      .isLength({ min: 1, max: 20000 })
      .withMessage('body length invalid')
      .trim(),
    body('isAnonymous')
      .optional()
      .isBoolean()
      .withMessage('isAnonymous must be boolean')
      .toBoolean(),
    handleValidation
  ],
  asyncHandler(sendLetter)
);

lettersRouter.get('/inbox', requireAuth, asyncHandler(inbox));
lettersRouter.get('/sent', requireAuth, asyncHandler(sent));

lettersRouter.get(
  '/:id',
  requireAuth,
  [
    param('id').isMongoId().withMessage('id must be a MongoID'),
    handleValidation
  ],
  asyncHandler(getLetter)
);

lettersRouter.patch(
  '/:id/read',
  requireAuth,
  [
    param('id').isMongoId().withMessage('id must be a MongoID'),
    handleValidation
  ],
  asyncHandler(markRead)
);
