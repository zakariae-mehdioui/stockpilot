import axios from 'axios';

// Base Axios instance configured for a REST backend. The frontend currently
// reads/writes directly through Supabase, but this instance is exported so the
// Spring Boot service can be wired in by setting VITE_API_URL.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      'Unexpected error occurred';
    return Promise.reject(new Error(message));
  },
);

export default api;
