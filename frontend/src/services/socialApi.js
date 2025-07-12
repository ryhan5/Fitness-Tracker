import { apiRequest } from './apiClient';

// Challenge APIs
export const getAvailableChallenges = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.category) queryParams.append('category', params.category);
  if (params.type) queryParams.append('type', params.type);
  if (params.difficulty) queryParams.append('difficulty', params.difficulty);
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);

  const queryString = queryParams.toString();
  const url = `/social/challenges${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest(url, {
    method: 'GET',
  });
};

export const joinChallenge = (challengeId) => apiRequest(`/social/challenges/${challengeId}/join`, {
  method: 'POST',
});

export const getUserChallenges = (status = 'active') => apiRequest(`/social/challenges/my?status=${status}`, {
  method: 'GET',
});

export const createCustomChallenge = (challengeData) => apiRequest('/social/challenges/custom', {
  method: 'POST',
  data: challengeData,
});

export const getChallengeLeaderboard = (challengeId, limit = 50) => apiRequest(`/social/leaderboard/${challengeId}?limit=${limit}`, {
  method: 'GET',
});

// Achievement APIs
export const getUserAchievements = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.category) queryParams.append('category', params.category);
  if (params.type) queryParams.append('type', params.type);
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);

  const queryString = queryParams.toString();
  const url = `/social/achievements${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest(url, {
    method: 'GET',
  });
};

// Friends APIs
export const getFriendsList = (status = 'accepted') => apiRequest(`/social/friends?status=${status}`, {
  method: 'GET',
});

export const inviteFriend = (friendData) => apiRequest('/social/friends/invite', {
  method: 'POST',
  data: friendData,
});

// Additional utility functions
export const updateChallengeProgress = (userId, category, value) => {
  // This might need to be implemented on the backend as a dedicated endpoint
  // For now, this is a placeholder that matches the controller helper function
  return apiRequest('/social/challenges/progress', {
    method: 'POST',
    data: { userId, category, value },
  });
};