import { Router } from 'express';
import { query } from 'express-validator';

import { asyncHandler } from '../utils/asyncHandler.js';
import { handleValidation } from '../validators/common.js';
import { facebookOAuthLogin, facebookOAuthInitiate } from '../controllers/auth.controller.js';

export const authRouter = Router();

// ONLY route:
// - DEV mode (DEV_AUTH_BYPASS === "true"): accept `facebook_id` and skip validation.
// - PROD mode: require `code` and exchange it with Facebook.
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

// GET /auth/facebook - Initiates Facebook OAuth flow (redirects to Facebook)
authRouter.get('/facebook', asyncHandler(facebookOAuthInitiate));

// GET /auth/facebook/callback - Handles Facebook OAuth callback and redirects to frontend
authRouter.get('/facebook/callback', callbackValidators, asyncHandler(facebookOAuthLogin));

