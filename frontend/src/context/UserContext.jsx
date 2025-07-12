import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState(null);
  const [userPreferences, setUserPreferences] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get user profile
  const getUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/profile');
      setUserProfile(response.data.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get profile' };
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    try {
      setLoading(true);
      const response = await api.put('/user/profile', profileData);
      setUserProfile(response.data.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    } finally {
      setLoading(false);
    }
  };

  // Upload profile picture
  const uploadProfilePicture = async (formData) => {
    try {
      setLoading(true);
      const response = await api.post('/user/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Update the profile picture in state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          profilePicture: response.data.data.profilePicture
        });
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload profile picture' };
    } finally {
      setLoading(false);
    }
  };

  // Get health metrics
  const getHealthMetrics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/health-metrics');
      setHealthMetrics(response.data.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get health metrics' };
    } finally {
      setLoading(false);
    }
  };

  // Update health metrics
  const updateHealthMetrics = async (healthData) => {
    try {
      setLoading(true);
      const response = await api.put('/user/health-metrics', healthData);
      setHealthMetrics(response.data.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update health metrics' };
    } finally {
      setLoading(false);
    }
  };

  // Get user preferences
  const getUserPreferences = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user/preferences');
      setUserPreferences(response.data.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get preferences' };
    } finally {
      setLoading(false);
    }
  };

  // Update user preferences
  const updateUserPreferences = async (preferencesData) => {
    try {
      setLoading(true);
      const response = await api.put('/user/preferences', preferencesData);
      setUserPreferences(response.data.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update preferences' };
    } finally {
      setLoading(false);
    }
  };

  // Delete user account
  const deleteUserAccount = async (accountData) => {
    try {
      setLoading(true);
      const response = await api.delete('/user/account', { data: accountData });
      // Clear all user data from state
      setUserProfile(null);
      setHealthMetrics(null);
      setUserPreferences(null);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete account' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    userProfile,
    healthMetrics,
    userPreferences,
    loading,
    getUserProfile,
    updateUserProfile,
    uploadProfilePicture,
    getHealthMetrics,
    updateHealthMetrics,
    getUserPreferences,
    updateUserPreferences,
    deleteUserAccount
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};