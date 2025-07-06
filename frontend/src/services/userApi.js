import { apiRequest, api } from './apiClient';

// User Profile APIs
export const getUserProfile = () => apiRequest('/user/profile');

export const updateUserProfile = (data) => apiRequest('/user/profile', {
  method: 'PUT',
  data,
});

// Health Metrics APIs
export const getHealthMetrics = () => apiRequest('/user/health-metrics');

export const updateHealthMetrics = (data) => apiRequest('/user/health-metrics', {
  method: 'PUT',
  data,
});

// Preferences APIs
export const getUserPreferences = () => apiRequest('/user/preferences');

export const updateUserPreferences = (data) => apiRequest('/user/preferences', {
  method: 'PUT',
  data,
});

// Profile Picture API (using axios for file upload)
export const uploadProfilePicture = async (formData) => {
  try {
    const response = await api.post('/user/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Delete User Account API
export const deleteUserAccount = (data) => apiRequest('/user/account', {
  method: 'DELETE',
  data,
});