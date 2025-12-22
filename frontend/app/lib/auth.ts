export interface LoginResponse {
  token: string;
  username: string;
}

export type UserRole = 'admin' | 'user';

const canUseBrowserStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const setAuthToken = (token: string, username: string) => {
  if (!canUseBrowserStorage()) return;

  try {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('username', username);
  } catch {
    // Ignore storage write failures (e.g. disabled cookies/storage)
  }
};

export const setAvatarId = (avatarId: string) => {
  if (!canUseBrowserStorage()) return;

  try {
    window.localStorage.setItem('avatarId', avatarId);
  } catch {
    // Ignore storage write failures
  }
};

export const logout = () => {
  if (!canUseBrowserStorage()) return;

  try {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('username');
    window.localStorage.removeItem('avatarId');
  } catch {
    // Ignore storage failures
  }

  window.location.href = '/login';
};

export const getAuthToken = (): string | null => {
  if (!canUseBrowserStorage()) return null;

  try {
    return window.localStorage.getItem('token');
  } catch {
    return null;
  }
};

export const getUsername = (): string | null => {
  if (!canUseBrowserStorage()) return null;

  try {
    return window.localStorage.getItem('username');
  } catch {
    return null;
  }
};

export const getAvatarId = (): string | null => {
  if (!canUseBrowserStorage()) return null;

  try {
    return window.localStorage.getItem('avatarId');
  } catch {
    return null;
  }
};

function decodeJwtPayload(token: string): any | null {
  // JWT format: header.payload.signature (base64url)
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const payload = parts[1];
  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export const getUserRole = (): UserRole | null => {
  const token = getAuthToken();
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  const role = payload?.role;
  if (role === 'admin' || role === 'user') return role;

  // Backward compatibility for older tokens that didn't include role.
  const username = payload?.username ?? getUsername();
  if (username === 'admin') return 'admin';
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
