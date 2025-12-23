import createError from 'http-errors';

import { env } from '../config/env.js';

async function fetchWithTimeout(url, options = {}, timeoutMs = 10_000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw createError(504, 'Clerk request timed out');
    }
    throw createError(502, 'Failed to reach Clerk');
  } finally {
    clearTimeout(id);
  }
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function getFacebookProviderUserIdFromClerk(clerkUserId) {
  if (!env.CLERK_SECRET_KEY) return null;
  if (!clerkUserId) return null;

  const url = `https://api.clerk.com/v1/users/${encodeURIComponent(String(clerkUserId))}`;
  const res = await fetchWithTimeout(
    url,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${env.CLERK_SECRET_KEY}`
      }
    },
    10_000
  );

  const text = await res.text();
  const data = safeJsonParse(text);

  if (!res.ok) {
    // Do not leak Clerk API errors to clients.
    return null;
  }

  const accounts = Array.isArray(data?.external_accounts) ? data.external_accounts : [];
  const facebook = accounts.find(
    (a) => a && typeof a === 'object' && (a.provider === 'oauth_facebook' || a.provider === 'facebook')
  );

  const providerUserId = facebook?.provider_user_id;
  if (typeof providerUserId === 'string' && providerUserId.trim()) {
    return providerUserId.trim();
  }

  // Some Clerk payloads may use id as the provider account id; prefer provider_user_id if present.
  return null;
}
