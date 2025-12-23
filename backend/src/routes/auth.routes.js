import { Router } from 'express';
import { query } from 'express-validator';
import createError from 'http-errors';

import { asyncHandler } from '../utils/asyncHandler.js';
import { handleValidation } from '../validators/common.js';
import { facebookOAuthLogin, facebookOAuthInitiate } from '../controllers/auth.controller.js';

export const authRouter = Router();

// ONLY route:
// - DEV mode (DEV_AUTH_BYPASS === "true"): accept `facebook_id` and skip validation.
// - PROD mode: require `code` and exchange it with Facebook.
const isDevBypass = process.env.DEV_AUTH_BYPASS === 'true';

function redirectToFrontendLogin(res, message) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const msg = String(message || 'Login failed');
  res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(msg)}`);
}

function authErrorRedirect(err, req, res, next) {
  if (!err) return next();
  if (res.headersSent) return next(err);

  const status = err.statusCode || err.status || 500;
  const message = status >= 500 ? 'Login failed. Please try again later.' : err.message;
  return redirectToFrontendLogin(res, message);
}

function hasNonEmptyQueryParam(req, key) {
  const v = req?.query?.[key];
  if (typeof v !== 'string') return false;
  return Boolean(v.trim());
}

function explainMissingOAuthCode(req, res, next) {
  // If someone tries the dev bypass without enabling it on the backend, give a helpful error.
  if (hasNonEmptyQueryParam(req, 'facebook_id')) {
    return next(
      createError(
        400,
        'DEV_AUTH_BYPASS is disabled. Start the backend with DEV_AUTH_BYPASS=true for development, or remove NEXT_PUBLIC_DEV_FACEBOOK_ID to use real Facebook OAuth.'
      )
    );
  }

  // If the callback is accessed directly (or Facebook config is wrong), code will be missing.
  if (!hasNonEmptyQueryParam(req, 'code')) {
    return next(
      createError(
        400,
        'Missing OAuth code. Start login via /auth/facebook so Facebook redirects back with ?code=...'
      )
    );
  }

  return next();
}

const callbackValidators = isDevBypass
  ? []
  : [
      explainMissingOAuthCode,
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
authRouter.get('/facebook', asyncHandler(facebookOAuthInitiate), authErrorRedirect);

// GET /auth/facebook/callback - Handles Facebook OAuth callback and redirects to frontend
authRouter.get('/facebook/callback', callbackValidators, asyncHandler(facebookOAuthLogin), authErrorRedirect);

