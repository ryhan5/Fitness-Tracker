// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3000/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true, // Important for cookies
// });

// // Request interceptor to add token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('accessToken');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Response interceptor for token refresh
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
    
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       try {
//         const response = await api.post('/auth/refresh');
//         const { accessToken } = response.data;
//         localStorage.setItem('accessToken', accessToken);
//         originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         localStorage.removeItem('accessToken');
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// // Auth API calls
// export const authAPI = {
//   signup: (data) => api.post('/auth/signup', data),
//   login: (data) => api.post('/auth/login', data),
//   logout: () => api.post('/auth/logout'),
//   refreshToken: () => api.post('/auth/refresh'),
//   forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
//   resetPassword: (data) => api.post('/auth/reset-password', data),
//   verifyEmail: (token) => api.post('/auth/verify-email', { token }),
// };

// export default api;

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post('/auth/refresh');
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// --- AUTH API ---
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
};

// --- USER API ---
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  uploadAvatar: (formData) =>
    api.post('/user/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getHealthMetrics: () => api.get('/user/health-metrics'),
  updateHealthMetrics: (data) => api.put('/user/health-metrics', data),
  getPreferences: () => api.get('/user/preferences'),
  updatePreferences: (data) => api.put('/user/preferences', data),
  deleteAccount: (password) =>
    api.delete('/user/account', {
      data: { password, confirmDelete: 'DELETE' },
    }),
};

// --- WORKOUT API ---
export const workoutAPI = {
  // Define workout endpoints
};

// --- NUTRITION API ---
export const nutritionAPI = {
  // Define nutrition endpoints
};

// --- SOCIAL API ---
export const socialAPI = {
  // Define social endpoints
};

// --- ACTIVITY API ---
export const activityAPI = {
  // Define activity endpoints
};

export default api;
