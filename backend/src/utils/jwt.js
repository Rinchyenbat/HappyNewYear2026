import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(payload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: env.JWT_EXPIRES_IN
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
}

// Login token: fixed 7-day expiry and explicit claims required by the app.
// Includes `sub` for compatibility with auth middleware.
export function signLoginToken({ userId, instagramId, username }) {
  return jwt.sign(
    {
      sub: String(userId),
      userId: String(userId),
      instagramId: String(instagramId),
      username: String(username)
    },
    env.JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '7d'
    }
  );
}
