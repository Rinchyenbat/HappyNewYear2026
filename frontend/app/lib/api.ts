import axios, { AxiosError } from 'axios';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000');

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && !API_URL) {
  // eslint-disable-next-line no-console
  console.error(
    'Missing NEXT_PUBLIC_API_URL. Set it on your hosting provider (e.g., Vercel) to your backend public URL.'
  );
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('avatarId');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
