import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 4000),
  MONGODB_URI: requireEnv('MONGODB_URI'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? '',
  // These are required for the OAuth login route, but kept optional here
  // so scripts (e.g. seed) can run with only DB/JWT configured.
  INSTAGRAM_CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID ?? '',
  INSTAGRAM_CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET ?? '',
  INSTAGRAM_REDIRECT_URI: process.env.INSTAGRAM_REDIRECT_URI ?? ''
});
