import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services';

const SocialContext = createContext();

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};

export const SocialProvider = ({ children }) => {
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [friends, setFriends] = useState([]);
  const [challengeLeaderboard, setChallengeLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Challenge functions
  const getAvailableChallenges = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      if (params.type) queryParams.append('type', params.type);
      if (params.difficulty) queryParams.append('difficulty', params.difficulty);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const queryString = queryParams.toString();
      const url = `/social/challenges${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      setChallenges(response.data.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch challenges');
      throw error.response?.data || { message: 'Failed to fetch challenges' };
    } finally {
      setLoading(false);
    }
  };

  const joinChallenge = async (challengeId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post(`/social/challenges/${challengeId}/join`);
      
      // Update local state
      setChallenges(prev => 
        prev.map(challenge => 
          challenge._id === challengeId 
            ? { ...challenge, participantCount: challenge.participantCount + 1 }
            : challenge
        )
      );
      
      // Refresh user challenges
      await getUserChallenges();
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to join challenge');
      throw error.response?.data || { message: 'Failed to join challenge' };
    } finally {
      setLoading(false);
    }
  };

  const getUserChallenges = async (status = 'active') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/social/challenges/my?status=${status}`);
      setUserChallenges(response.data.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch user challenges');
      throw error.response?.data || { message: 'Failed to fetch user challenges' };
    } finally {
      setLoading(false);
    }
  };

  const createCustomChallenge = async (challengeData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/social/challenges/custom', challengeData);
      
      // Add new challenge to local state
      setChallenges(prev => [response.data.data, ...prev]);
      
      // Refresh user challenges
      await getUserChallenges();
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create challenge');
      throw error.response?.data || { message: 'Failed to create challenge' };
    } finally {
      setLoading(false);
    }
  };

  const getChallengeLeaderboard = async (challengeId, limit = 50) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/social/leaderboard/${challengeId}?limit=${limit}`);
      setChallengeLeaderboard(response.data.data.leaderboard);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch leaderboard');
      throw error.response?.data || { message: 'Failed to fetch leaderboard' };
    } finally {
      setLoading(false);
    }
  };

  // Achievement functions
  const getUserAchievements = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      if (params.type) queryParams.append('type', params.type);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const queryString = queryParams.toString();
      const url = `/social/achievements${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      setAchievements(response.data.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch achievements');
      throw error.response?.data || { message: 'Failed to fetch achievements' };
    } finally {
      setLoading(false);
    }
  };

  // Friends functions
  const getFriendsList = async (status = 'accepted') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/social/friends?status=${status}`);
      setFriends(response.data.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch friends');
      throw error.response?.data || { message: 'Failed to fetch friends' };
    } finally {
      setLoading(false);
    }
  };

  const inviteFriend = async (friendData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/social/friends/invite', friendData);
      
      // Refresh friends list to show pending requests
      await getFriendsList('pending');
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to invite friend');
      throw error.response?.data || { message: 'Failed to invite friend' };
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const updateChallengeProgress = async (userId, category, value) => {
    try {
      // This might need to be implemented as a dedicated endpoint
      // For now, we'll refresh user challenges after progress update
      await getUserChallenges();
      await getUserAchievements();
    } catch (error) {
      console.error('Error updating challenge progress:', error);
    }
  };

  const clearError = () => setError(null);

  const value = {
    // State
    challenges,
    userChallenges,
    achievements,
    friends,
    challengeLeaderboard,
    loading,
    error,
    
    // Challenge functions
    getAvailableChallenges,
    joinChallenge,
    getUserChallenges,
    createCustomChallenge,
    getChallengeLeaderboard,
    
    // Achievement functions
    getUserAchievements,
    
    // Friends functions
    getFriendsList,
    inviteFriend,
    
    // Utility functions
    updateChallengeProgress,
    clearError,
  };

  return (
    <SocialContext.Provider value={value}>
      {children}
    </SocialContext.Provider>
  );
};