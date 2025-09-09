import axios from 'axios';
import { LoginCredentials, RegisterData, AuthResponse, TokenResponse } from '../types/auth';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Token will be added by the auth context using keychain
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // This will be handled by the auth context
        throw new Error('Token refresh needed');
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse['data']> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse['data']> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data.data;
  },

  getCurrentUser: async (): Promise<any> => {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  },

  refreshToken: async (refreshToken: string): Promise<TokenResponse['data']> => {
    const response = await api.post<TokenResponse>('/auth/refresh', { refreshToken });
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

export default api;
