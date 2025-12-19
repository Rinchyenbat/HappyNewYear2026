import createError from 'http-errors';

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return next(createError(401, 'Unauthorized'));
  }
  if (req.user.role !== 'admin') {
    return next(createError(403, 'Admin only'));
  }
  return next();
}
