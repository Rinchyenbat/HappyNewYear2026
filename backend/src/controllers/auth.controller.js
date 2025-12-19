import createError from 'http-errors';

import { AllowedInstagramUser } from '../models/AllowedInstagramUser.js';
import { User } from '../models/User.js';
import { LoginLog } from '../models/LoginLog.js';
import { signLoginToken } from '../utils/jwt.js';
import { getAccessToken, getInstagramProfile } from '../utils/instagramOAuth.js';

export async function instagramOAuthLogin(req, res) {
  const isDevBypass = process.env.DEV_AUTH_BYPASS === 'true';

  let instagramId;

  // OAuth Step A:
  // PROD: Instagram redirects back with `?code=...`; backend exchanges code -> token -> profile.
  // DEV BYPASS: skip Instagram calls and accept `instagram_id` from query.
  if (isDevBypass) {
    instagramId = String(req.query?.instagram_id ?? '').trim();
    if (!instagramId) {
      throw createError(400, 'instagram_id is required in dev bypass mode');
    }
  } else {
    const code = String(req.query?.code ?? '').trim();

    let accessToken;
    let instagramProfile;

    try {
      // OAuth Step B: Exchange `code` for an access token.
      accessToken = await getAccessToken(code);

      // OAuth Step C: Fetch Instagram profile via Graph API.
      instagramProfile = await getInstagramProfile(accessToken);
    } catch (err) {
      // We don't have a reliable instagramId yet; store the failure with minimal info.
      await LoginLog.create({
        instagramId: 'unknown',
        success: false,
        reason: 'oauth_failed',
        ip: req.ip,
        userAgent: req.get('user-agent')
      });
      throw err;
    }

    // OAuth Step D: Extract Instagram user id. This is what we whitelist.
    instagramId = instagramProfile.id;
  }

  // Security Step E: Enforce developer-controlled whitelist + exact username assignment.
  // Users cannot pick or change usernames; the backend assigns the predefined name.
  const allowed = await AllowedInstagramUser.findOne({ instagram_id: instagramId }).lean();
  if (!allowed) {
    await LoginLog.create({
      instagramId,
      success: false,
      reason: 'not_whitelisted',
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
    // Exact message required by spec.
    throw createError(403, 'You are not allowed to access this app');
  }

  // Step F: Create the user if they don't exist using the assigned username.
  const assignedUsername = String(allowed.assigned_username).trim();
  let user = await User.findOne({ instagramId });
  if (!user) {
    const usernameTaken = await User.exists({ username: assignedUsername });
    if (usernameTaken) {
      throw createError(409, 'Assigned username is already in use');
    }
    user = await User.create({ instagramId, username: assignedUsername, role: 'user' });
  } else if (user.username !== assignedUsername) {
    // Do not modify existing users.
    throw createError(403, 'You are not allowed to access this app');
  }

  // Step G: Record successful login for auditing/moderation.
  await LoginLog.create({
    instagramId,
    user: user._id,
    success: true,
    reason: 'ok',
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Step H: Issue JWT for our backend.
  const token = signLoginToken({
    userId: String(user._id),
    instagramId: user.instagramId,
    username: user.username
  });

  // Step I: Redirect to frontend with token
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const redirectUrl = `${frontendUrl}/login?token=${encodeURIComponent(token)}&username=${encodeURIComponent(user.username)}`;
  
  res.redirect(redirectUrl);
}

export async function instagramOAuthInitiate(req, res) {
  // Initiate Instagram OAuth flow
  const appId = process.env.INSTAGRAM_APP_ID;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
  
  if (!appId || !redirectUri) {
    throw createError(500, 'Instagram OAuth not configured');
  }
  
  const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile&response_type=code`;
  
  res.redirect(instagramAuthUrl);
}
