import createError from 'http-errors';

import { env } from '../config/env.js';

const FB_OAUTH_DIALOG_URL = 'https://www.facebook.com/v19.0/dialog/oauth';
const FB_OAUTH_TOKEN_URL = 'https://graph.facebook.com/v19.0/oauth/access_token';
const FB_GRAPH_ME_URL = 'https://graph.facebook.com/me';

function assertOAuthConfigured() {
  if (!env.FACEBOOK_CLIENT_ID || !env.FACEBOOK_CLIENT_SECRET || !env.FACEBOOK_REDIRECT_URI) {
    throw createError(500, 'Facebook OAuth is not configured');
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
      throw createError(504, 'Facebook request timed out');
    }
    throw createError(502, 'Failed to reach Facebook');
  } finally {
    clearTimeout(id);
  }
}

export function buildFacebookAuthorizeUrl(state) {
  assertOAuthConfigured();

  const url = new URL(FB_OAUTH_DIALOG_URL);
  url.searchParams.set('client_id', env.FACEBOOK_CLIENT_ID);
  url.searchParams.set('redirect_uri', env.FACEBOOK_REDIRECT_URI);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'public_profile');
  if (state) {
    url.searchParams.set('state', state);
  }

  return url.toString();
}

/**
 * Exchange `code` for an access token.
 *
 * GET https://graph.facebook.com/v19.0/oauth/access_token
 *   ?client_id=...&client_secret=...&redirect_uri=...&code=...
 */
export async function getFacebookAccessToken(code) {
  assertOAuthConfigured();

  const url = new URL(FB_OAUTH_TOKEN_URL);
  url.searchParams.set('client_id', env.FACEBOOK_CLIENT_ID);
  url.searchParams.set('client_secret', env.FACEBOOK_CLIENT_SECRET);
  url.searchParams.set('redirect_uri', env.FACEBOOK_REDIRECT_URI);
  url.searchParams.set('code', code);

  const res = await fetchWithTimeout(url.toString(), { method: 'GET' }, 10_000);
  const text = await res.text();
  const data = safeJsonParse(text);

  if (!res.ok) {
    throw createError(401, 'Facebook token exchange failed', {
      errors: data ? [data] : [{ message: text || 'token_exchange_failed' }]
    });
  }

  if (!data?.access_token || typeof data.access_token !== 'string') {
    throw createError(502, 'Facebook token exchange returned invalid response');
  }

  return data.access_token;
}

/**
 * Fetch Facebook profile.
 *
 * GET https://graph.facebook.com/me?fields=id,name&access_token=...
 */
export async function getFacebookProfile(accessToken) {
  assertOAuthConfigured();

  const url = new URL(FB_GRAPH_ME_URL);
  url.searchParams.set('fields', 'id,name');
  url.searchParams.set('access_token', accessToken);

  const res = await fetchWithTimeout(url.toString(), { method: 'GET' }, 10_000);
  const text = await res.text();
  const data = safeJsonParse(text);

  if (!res.ok) {
    throw createError(401, 'Facebook profile fetch failed', {
      errors: data ? [data] : [{ message: text || 'profile_fetch_failed' }]
    });
  }

  if (!data?.id || typeof data.id !== 'string') {
    throw createError(502, 'Facebook profile response missing id');
  }

  return {
    id: data.id,
    name: typeof data.name === 'string' ? data.name : undefined
  };
}
