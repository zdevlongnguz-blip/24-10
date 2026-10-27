import { clearToken, getToken } from './auth-token.js';

const api = window.axios.create();

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.startsWith('/api/auth/');
    if (error.response?.status === 401 && !isAuthRequest) {
      clearToken();
      window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

export default api;
