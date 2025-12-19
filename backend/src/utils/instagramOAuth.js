import createError from 'http-errors';

import { env } from '../config/env.js';

const INSTAGRAM_OAUTH_TOKEN_URL = 'https://api.instagram.com/oauth/access_token';
const INSTAGRAM_GRAPH_ME_URL = 'https://graph.instagram.com/me';

function assertOAuthConfigured() {
  if (!env.INSTAGRAM_CLIENT_ID || !env.INSTAGRAM_CLIENT_SECRET || !env.INSTAGRAM_REDIRECT_URI) {
    throw createError(500, 'Instagram OAuth is not configured');
  }
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 10_000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return res;
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw createError(504, 'Instagram request timed out');
    }
    throw createError(502, 'Failed to reach Instagram');
  } finally {
    clearTimeout(id);
  }
}

/**
 * Step 1 (OAuth): Exchange the short-lived `code` (received via redirect) for an access token.
 *
 * Instagram Basic Display OAuth token exchange:
 * - POST https://api.instagram.com/oauth/access_token
 * - form-urlencoded body with:
 *   client_id, client_secret, grant_type=authorization_code, redirect_uri, code
 */
export async function getAccessToken(code) {
  assertOAuthConfigured();
  const body = new URLSearchParams({
    client_id: env.INSTAGRAM_CLIENT_ID,
    client_secret: env.INSTAGRAM_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: env.INSTAGRAM_REDIRECT_URI,
    code
  });

  const res = await fetchWithTimeout(
    INSTAGRAM_OAUTH_TOKEN_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body
    },
    10_000
  );

  const text = await res.text();
  const data = safeJsonParse(text);

  if (!res.ok) {
    // Instagram returns error payloads in JSON, but not always.
    throw createError(401, 'Instagram token exchange failed', {
      errors: data ? [data] : [{ message: text || 'token_exchange_failed' }]
    });
  }

  if (!data?.access_token || typeof data.access_token !== 'string') {
    throw createError(502, 'Instagram token exchange returned invalid response');
  }

  return data.access_token;
}

/**
 * Step 2 (Graph API): Use the access token to fetch the Instagram profile.
 *
 * Instagram Basic Display Graph endpoint:
 * - GET https://graph.instagram.com/me?fields=id,username&access_token=...
 */
export async function getInstagramProfile(accessToken) {
  assertOAuthConfigured();
  const url = new URL(INSTAGRAM_GRAPH_ME_URL);
  url.searchParams.set('fields', 'id,username');
  url.searchParams.set('access_token', accessToken);

  const res = await fetchWithTimeout(url.toString(), { method: 'GET' }, 10_000);

  const text = await res.text();
  const data = safeJsonParse(text);

  if (!res.ok) {
    throw createError(401, 'Instagram profile fetch failed', {
      errors: data ? [data] : [{ message: text || 'profile_fetch_failed' }]
    });
  }

  if (!data?.id || typeof data.id !== 'string') {
    throw createError(502, 'Instagram profile response missing id');
  }

  return {
    id: data.id,
    username: typeof data.username === 'string' ? data.username : undefined
  };
}

