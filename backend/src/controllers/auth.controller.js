import createError from 'http-errors';

import { User } from '../models/User.js';
import { LoginLog } from '../models/LoginLog.js';
import { PendingFacebookLogin } from '../models/PendingFacebookLogin.js';
import { signLoginToken } from '../utils/jwt.js';
import { verifyClerkJwt } from '../utils/clerkJwt.js';
import { getFacebookProviderUserIdFromClerk } from '../utils/clerkApi.js';
import { env } from '../config/env.js';

export async function clerkExchangeLogin(req, res) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw createError(401, 'Missing Authorization header');
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    throw createError(401, 'Missing token');
  }

  const payload = await verifyClerkJwt(token);
  const clerkUserId = String(payload?.sub ?? '').trim();
  if (!clerkUserId) {
    throw createError(401, 'Clerk token missing sub');
  }

  // Keep semantics: prefer the actual Facebook account id when available (via Clerk API).
  // Fallback to Clerk user id so the app still works without CLERK_SECRET_KEY.
  const providerFacebookId = await getFacebookProviderUserIdFromClerk(clerkUserId);
  const facebookId = providerFacebookId || clerkUserId;
  const displayName =
    (typeof payload?.name === 'string' && payload.name.trim() ? payload.name.trim() : '') ||
    (typeof payload?.preferred_username === 'string' && payload.preferred_username.trim()
      ? payload.preferred_username.trim()
      : '') ||
    (typeof payload?.email === 'string' && payload.email.trim() ? payload.email.trim() : '');

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
    const now = new Date();
    await PendingFacebookLogin.updateOne(
      { facebookId },
      {
        $setOnInsert: { facebookId, firstSeenAt: now },
        $set: {
          facebookName: displayName ? String(displayName) : undefined,
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

    throw createError(403, 'Pending approval. Please contact the admin.');
  }

  await LoginLog.create({
    facebookId,
    user: user._id,
    success: true,
    reason: 'ok',
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  const appToken = signLoginToken({
    userId: String(user._id),
    facebookId: user.facebookId,
    username: user.username,
    role: user.role
  });

  res.status(200).json({ token: appToken, username: user.username, role: user.role });
}
