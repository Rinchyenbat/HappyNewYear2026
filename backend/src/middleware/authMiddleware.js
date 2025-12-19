import createError from 'http-errors';
import { verifyAccessToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(createError(401, 'Missing Authorization header'));
  }

  const token = header.slice('Bearer '.length).trim();
  if (!token) {
    return next(createError(401, 'Missing token'));
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    return next(createError(401, 'Invalid token'));
  }

  const user = await User.findById(decoded.sub).lean();
  if (!user) {
    return next(createError(401, 'User not found'));
  }

  req.user = {
    id: String(user._id),
    role: user.role,
    username: user.username,
    instagramId: user.instagramId
  };

  return next();
}
