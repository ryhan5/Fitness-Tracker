import { apiRequest } from './apiClient';

// User Profile APIs
export const getUserProfile = () => apiRequest('/user/profile', {
  method: 'GET',
});

export const updateUserProfile = (profileData) => apiRequest('/user/profile', {
  method: 'PUT',
  data: profileData,
});

export const uploadProfilePicture = (formData) => apiRequest('/user/profile/avatar', {
  method: 'POST',
  data: formData,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Health Metrics APIs
export const getHealthMetrics = () => apiRequest('/user/health-metrics', {
  method: 'GET',
});

export const updateHealthMetrics = (healthData) => apiRequest('/user/health-metrics', {
  method: 'PUT',
  data: healthData,
});

// User Preferences APIs
export const getUserPreferences = () => apiRequest('/user/preferences', {
  method: 'GET',
});

export const updateUserPreferences = (preferencesData) => apiRequest('/user/preferences', {
  method: 'PUT',
  data: preferencesData,
});

// Account Management APIs
export const deleteUserAccount = (accountData) => apiRequest('/user/account', {
  method: 'DELETE',
  data: accountData,
});