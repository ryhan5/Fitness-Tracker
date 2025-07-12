import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getUserActivities as getUserActivitiesAPI,
  createActivity as createActivityAPI,
  getActivityById as getActivityByIdAPI,
  updateActivity as updateActivityAPI,
  deleteActivity as deleteActivityAPI,
  uploadGPSData as uploadGPSDataAPI,
  getActivityStats as getActivityStatsAPI
} from '../services/activityApi';

const ActivityContext = createContext();

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [activityStats, setActivityStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    type: '',
    startDate: '',
    endDate: '',
    sortBy: 'completedAt',
    sortOrder: 'desc'
  });

  // Get all user activities with pagination and filtering
  const getUserActivities = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = { ...filters, ...params };
      const response = await getUserActivitiesAPI(queryParams);
      
      setActivities(response.data.activities);
      setPagination(response.data.pagination);
      setFilters(prev => ({ ...prev, ...params }));
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch activities' };
    } finally {
      setLoading(false);
    }
  };

  // Create a new activity
  const createActivity = async (activityData) => {
    setLoading(true);
    try {
      const response = await createActivityAPI(activityData);
      
      // Add the new activity to the beginning of the list
      setActivities(prev => [response.data, ...prev]);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create activity' };
    } finally {
      setLoading(false);
    }
  };

  // Get specific activity by ID
  const getActivityById = async (id) => {
    setLoading(true);
    try {
      const response = await getActivityByIdAPI(id);
      setCurrentActivity(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch activity' };
    } finally {
      setLoading(false);
    }
  };

  // Update an activity
  const updateActivity = async (id, activityData) => {
    setLoading(true);
    try {
      const response = await updateActivityAPI(id, activityData);
      
      // Update the activity in the list
      setActivities(prev => 
        prev.map(activity => 
          activity._id === id ? response.data : activity
        )
      );
      
      // Update current activity if it's the same one
      if (currentActivity && currentActivity._id === id) {
        setCurrentActivity(response.data);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update activity' };
    } finally {
      setLoading(false);
    }
  };

  // Delete an activity
  const deleteActivity = async (id) => {
    setLoading(true);
    try {
      await deleteActivityAPI(id);
      
      // Remove the activity from the list
      setActivities(prev => prev.filter(activity => activity._id !== id));
      
      // Clear current activity if it's the deleted one
      if (currentActivity && currentActivity._id === id) {
        setCurrentActivity(null);
      }
      
      return { message: 'Activity deleted successfully' };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete activity' };
    } finally {
      setLoading(false);
    }
  };

  // Upload GPS data for an activity
  const uploadGPSData = async (id, gpsData) => {
    setLoading(true);
    try {
      const response = await uploadGPSDataAPI(id, gpsData);
      
      // Update the activity in the list
      setActivities(prev => 
        prev.map(activity => 
          activity._id === id ? response.data : activity
        )
      );
      
      // Update current activity if it's the same one
      if (currentActivity && currentActivity._id === id) {
        setCurrentActivity(response.data);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload GPS data' };
    } finally {
      setLoading(false);
    }
  };

  // Get activity statistics
  const getActivityStats = async (params = {}) => {
    setLoading(true);
    try {
      const response = await getActivityStatsAPI(params);
      setActivityStats(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch activity statistics' };
    } finally {
      setLoading(false);
    }
  };

  // Clear current activity
  const clearCurrentActivity = () => {
    setCurrentActivity(null);
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Reset filters to default
  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      type: '',
      startDate: '',
      endDate: '',
      sortBy: 'completedAt',
      sortOrder: 'desc'
    });
  };

  // Load initial activities on component mount
  useEffect(() => {
    getUserActivities();
  }, []);

  const value = {
    activities,
    currentActivity,
    activityStats,
    loading,
    pagination,
    filters,
    getUserActivities,
    createActivity,
    getActivityById,
    updateActivity,
    deleteActivity,
    uploadGPSData,
    getActivityStats,
    clearCurrentActivity,
    updateFilters,
    resetFilters
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
};