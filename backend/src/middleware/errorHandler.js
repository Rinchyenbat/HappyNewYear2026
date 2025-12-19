import mongoose from 'mongoose';

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;

  const isValidationError =
    err?.name === 'ValidationError' ||
    err?.name === 'CastError' ||
    (err instanceof mongoose.Error.ValidationError);

  const payload = {
    error: {
      message: status >= 500 ? 'Internal Server Error' : err.message
    }
  };

  if (isValidationError) {
    payload.error.message = 'Validation Error';
  }

  if (status >= 400 && status < 500 && err?.errors) {
    payload.error.details = err.errors;
  }

  if (process.env.NODE_ENV !== 'production' && status >= 500) {
    payload.error.stack = err.stack;
  }

  res.status(isValidationError ? 400 : status).json(payload);
}
