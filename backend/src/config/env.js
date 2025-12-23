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
  PORT: (() => {
    const raw = process.env.PORT;
    if (raw == null || String(raw).trim() === '') {
      return 4000;
    }
    const port = Number(raw);
    if (!Number.isInteger(port) || port <= 0) {
      const nodeEnv = process.env.NODE_ENV ?? 'development';
      if (nodeEnv === 'production') {
        throw new Error(
          `Invalid PORT. Expected a positive integer, received: ${JSON.stringify(raw)}`
        );
      }
      return 4000;
    }
    return port;
  })(),
  MONGODB_URI: requireMongoUri(),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? '',

  // Clerk JWT verification (for /auth/clerk/exchange).
  // Example JWKS URL: https://<your-clerk-domain>/.well-known/jwks.json
  CLERK_JWKS_URL: process.env.CLERK_JWKS_URL ?? '',
  // Optional: enforce issuer match (recommended).
  // Example issuer: https://<your-clerk-domain>
  CLERK_ISSUER: process.env.CLERK_ISSUER ?? '',
  // Optional: used to fetch user details (e.g., Facebook provider user id) from Clerk API.
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? '',

  // Optional: bootstrap the first admin.
  // If set, a login with this facebookId will create an admin user (once) if not present.
  ADMIN_FACEBOOK_ID: process.env.ADMIN_FACEBOOK_ID ?? '',
  ADMIN_USERNAME: process.env.ADMIN_USERNAME ?? ''
});
