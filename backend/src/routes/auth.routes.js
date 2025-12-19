import { Router } from 'express';
import { query } from 'express-validator';

import { asyncHandler } from '../utils/asyncHandler.js';
import { handleValidation } from '../validators/common.js';
import { instagramOAuthLogin, instagramOAuthInitiate } from '../controllers/auth.controller.js';

export const authRouter = Router();

// ONLY route:
// - DEV mode (DEV_AUTH_BYPASS === "true"): accept `instagram_id` and skip validation.
// - PROD mode: require `code` and exchange it with Instagram.
const isDevBypass = process.env.DEV_AUTH_BYPASS === 'true';

const callbackValidators = isDevBypass
  ? []
  : [
      query('code')
        .exists({ checkFalsy: true })
        .withMessage('code is required')
        .isString()
        .withMessage('code must be a string')
        .isLength({ min: 5, max: 2048 })
        .withMessage('code length invalid')
        .trim(),
      handleValidation
    ];

// GET /auth/instagram - Initiates Instagram OAuth flow (redirects to Instagram)
authRouter.get('/instagram', asyncHandler(instagramOAuthInitiate));

// GET /auth/instagram/callback - Handles Instagram OAuth callback and redirects to frontend
authRouter.get('/instagram/callback', callbackValidators, asyncHandler(instagramOAuthLogin));

