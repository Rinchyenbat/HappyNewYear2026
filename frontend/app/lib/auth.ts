export interface LoginResponse {
  token: string;
  username: string;
}

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

export const logout = () => {
  if (!canUseBrowserStorage()) return;

  try {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('username');
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

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
