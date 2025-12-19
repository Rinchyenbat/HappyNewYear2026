import createError from 'http-errors';

export function notFoundHandler(req, res, next) {
  next(createError(404, 'Not Found'));
}
