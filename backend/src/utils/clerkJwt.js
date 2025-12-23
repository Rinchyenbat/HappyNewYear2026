import createError from 'http-errors';
import { createRemoteJWKSet, jwtVerify } from 'jose';

import { env } from '../config/env.js';

let jwks;

function getJwks() {
  if (!env.CLERK_JWKS_URL) {
    throw createError(500, 'Clerk JWT verification is not configured (missing CLERK_JWKS_URL)');
  }

  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(env.CLERK_JWKS_URL));
  }

  return jwks;
}

export async function verifyClerkJwt(token) {
  if (!token || typeof token !== 'string') {
    throw createError(401, 'Missing Clerk token');
  }

  try {
    const { payload } = await jwtVerify(token, getJwks(), {
      issuer: env.CLERK_ISSUER ? env.CLERK_ISSUER : undefined
    });

    return payload;
  } catch {
    throw createError(401, 'Invalid Clerk token');
  }
}
