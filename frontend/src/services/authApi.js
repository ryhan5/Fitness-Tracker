import { apiRequest } from './apiClient';

// Auth APIs
export const loginUser = (credentials) => apiRequest('/auth/login', {
  method: 'POST',
  data: credentials,
});

export const registerUser = (userData) => apiRequest('/auth/register', {
  method: 'POST',
  data: userData,
});

export const logoutUser = () => apiRequest('/auth/logout', {
  method: 'POST',
});

export const refreshToken = () => apiRequest('/auth/refresh', {
  method: 'POST',
});

export const forgotPassword = (email) => apiRequest('/auth/forgot-password', {
  method: 'POST',
  data: { email },
});

export const resetPassword = (token, newPassword) => apiRequest('/auth/reset-password', {
  method: 'POST',
  data: { token, newPassword },
});

export const verifyEmail = (token) => apiRequest('/auth/verify-email', {
  method: 'POST',
  data: { token },
});