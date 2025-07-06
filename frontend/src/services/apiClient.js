import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

// Create axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management utilities
const getToken = () => {
  return localStorage.getItem('accessToken');
};

const setToken = (token) => {
  localStorage.setItem('accessToken', token);
};

const removeToken = () => {
  localStorage.removeItem('accessToken');
};

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
        const response = await api.post('/auth/refresh');
        const { accessToken } = response.data;
        
        setToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        removeToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Generic API request handler
export const apiRequest = async (url, options = {}) => {
  try {
    const response = await api({
      url,
      ...options,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Error handling utility
export const handleApiError = (error) => {
  if (error.response) {
    console.error('API Error:', error.response.data);
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    console.error('Network Error:', error.request);
    return 'Network error. Please check your connection.';
  } else {
    console.error('Error:', error.message);
    return error.message || 'An unexpected error occurred';
  }
};

export default api;