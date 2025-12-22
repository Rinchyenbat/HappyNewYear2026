import createError from 'http-errors';

import { User } from '../models/User.js';
import { LoginLog } from '../models/LoginLog.js';
import { PendingFacebookLogin } from '../models/PendingFacebookLogin.js';
import { signLoginToken } from '../utils/jwt.js';
import { buildFacebookAuthorizeUrl, getFacebookAccessToken, getFacebookProfile } from '../utils/facebookOAuth.js';
import { env } from '../config/env.js';

export async function facebookOAuthLogin(req, res) {
  const isDevBypass = process.env.DEV_AUTH_BYPASS === 'true';

  let facebookId;
  let facebookName;

  // OAuth Step A:
  // PROD: Facebook redirects back with `?code=...`; backend exchanges code -> token -> profile.
  // DEV BYPASS: skip Facebook calls and accept `facebook_id` from query.
  if (isDevBypass) {
    facebookId = String(req.query?.facebook_id ?? '').trim();
    if (!facebookId) {
      throw createError(400, 'facebook_id is required in dev bypass mode');
    }
  } else {
    const code = String(req.query?.code ?? '').trim();

    let accessToken;
    let facebookProfile;

    try {
      // OAuth Step B: Exchange `code` for an access token.
      accessToken = await getFacebookAccessToken(code);

      // OAuth Step C: Fetch Facebook profile via Graph API.
      facebookProfile = await getFacebookProfile(accessToken);
    } catch (err) {
      // We don't have a reliable facebookId yet; store the failure with minimal info.
      await LoginLog.create({
        facebookId: 'unknown',
        success: false,
        reason: 'oauth_failed',
        ip: req.ip,
        userAgent: req.get('user-agent')
      });
      throw err;
    }

    // OAuth Step D: Extract Facebook user identity.
    facebookId = facebookProfile.id;
    facebookName = facebookProfile.name;
  }


  // Step E: If the user already exists (approved), issue a login token.
  let user = await User.findOne({ facebookId });

  // Optional: bootstrap admin on first login.
  if (!user && env.ADMIN_FACEBOOK_ID && facebookId === String(env.ADMIN_FACEBOOK_ID).trim()) {
    const desiredUsername = (env.ADMIN_USERNAME || 'admin').trim();
    const usernameTaken = await User.exists({ username: desiredUsername });
    if (usernameTaken) {
      throw createError(409, 'Admin username is already in use');
    }
    user = await User.create({ facebookId, username: desiredUsername, role: 'admin' });
  }

  if (!user) {
    // Step F: Record/refresh a pending approval request (admin will assign username later).
    const now = new Date();
    await PendingFacebookLogin.updateOne(
      { facebookId },
      {
        $setOnInsert: { facebookId, firstSeenAt: now },
        $set: {
          facebookName: facebookName ? String(facebookName) : undefined,
          status: 'pending',
          lastSeenAt: now,
          lastIp: req.ip,
          lastUserAgent: req.get('user-agent')
        },
        $inc: { seenCount: 1 }
      },
      { upsert: true }
    );

    await LoginLog.create({
      facebookId,
      success: false,
      reason: 'pending_approval',
      ip: req.ip,
      userAgent: req.get('user-agent')
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const msg = 'Pending approval. Please contact the admin.';
    res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(msg)}`);
    return;
  }

  // Step G: Record successful login for auditing/moderation.
  await LoginLog.create({
    facebookId,
    user: user._id,
    success: true,
    reason: 'ok',
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Step H: Issue JWT for our backend.
  const token = signLoginToken({
    userId: String(user._id),
    facebookId: user.facebookId,
    username: user.username
  });

  // Step I: Redirect to frontend with token
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const redirectUrl = `${frontendUrl}/login?token=${encodeURIComponent(token)}&username=${encodeURIComponent(user.username)}`;
  
  res.redirect(redirectUrl);
}

export async function facebookOAuthInitiate(req, res) {
  const url = buildFacebookAuthorizeUrl();
  res.redirect(url);
}
