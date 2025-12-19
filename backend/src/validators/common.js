import { validationResult } from 'express-validator';
import createError from 'http-errors';

export function handleValidation(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  return next(createError(400, 'Invalid request', { errors: result.array() }));
}
