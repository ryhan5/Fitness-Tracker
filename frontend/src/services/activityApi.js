import { apiRequest } from './apiClient';

// Activity APIs
export const getUserActivities = (params = {}) => apiRequest('/activity', {
  method: 'GET',
  params,
});

export const createActivity = (activityData) => apiRequest('/activity', {
  method: 'POST',
  data: activityData,
});

export const getActivityById = (id) => apiRequest(`/activity/${id}`, {
  method: 'GET',
});

export const updateActivity = (id, activityData) => apiRequest(`/activity/${id}`, {
  method: 'PUT',
  data: activityData,
});

export const deleteActivity = (id) => apiRequest(`/activity/${id}`, {
  method: 'DELETE',
});

export const uploadGPSData = (id, gpsData) => apiRequest(`/activity/${id}/gps`, {
  method: 'POST',
  data: gpsData,
});

export const getActivityStats = (params = {}) => apiRequest('/activity/stats', {
  method: 'GET',
  params,
});