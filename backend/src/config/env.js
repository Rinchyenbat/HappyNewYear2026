import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value.trim();
}

function requireMongoUri() {
  const uri = requireEnv('MONGODB_URI');
  // Render/CI often ends up with a value like "hn2026" or includes quotes.
  const normalized = uri.replace(/^['"]|['"]$/g, '');
  if (!/^mongodb(\+srv)?:\/\//.test(normalized)) {
    throw new Error(
      'Invalid MONGODB_URI. It must start with "mongodb://" or "mongodb+srv://". ' +
        `Received: ${JSON.stringify(uri)}. ` +
        'Example: mongodb+srv://USER:PASSWORD@cluster.example.mongodb.net/hn2026?retryWrites=true&w=majority'
    );
  }
  return normalized;
}

export const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 4000),
  MONGODB_URI: requireMongoUri(),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? '',
  // These are required for the OAuth login route, but kept optional here
  // so scripts (e.g. seed) can run with only DB/JWT configured.
  INSTAGRAM_CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID ?? '',
  INSTAGRAM_CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET ?? '',
  INSTAGRAM_REDIRECT_URI: process.env.INSTAGRAM_REDIRECT_URI ?? ''
});
