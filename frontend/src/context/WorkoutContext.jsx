import { createContext, useContext, useState, useEffect } from 'react';
import {
  getWorkoutPlans as fetchWorkoutPlans,
  createWorkoutPlan as createPlan,
  getWorkoutPlanById as fetchWorkoutPlanById,
  updateWorkoutPlan as updatePlan,
  deleteWorkoutPlan as deletePlan,
  startWorkoutSession as startSession,
  logWorkoutSession as logSession,
  getExerciseDatabase as fetchExerciseDatabase,
  getActiveWorkoutPlans as fetchActiveWorkoutPlans,
  searchExercises as searchExercisesApi,
  getExercisesByCategory as fetchExercisesByCategory,
  getExercisesByMuscleGroup as fetchExercisesByMuscleGroup,
  getExercisesByEquipment as fetchExercisesByEquipment
} from '../services/workoutApi';

const WorkoutContext = createContext();

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

export const WorkoutProvider = ({ children }) => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [currentWorkoutPlan, setCurrentWorkoutPlan] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    categories: [],
    equipment: [],
    targetMuscles: [],
    difficulties: ['beginner', 'intermediate', 'advanced']
  });

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Workout Plans Management
  const getWorkoutPlans = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchWorkoutPlans(params);
      setWorkoutPlans(response.data);
      return response;
    } catch (error) {
      setError(error.message || 'Failed to fetch workout plans');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createWorkoutPlan = async (planData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await createPlan(planData);
      setWorkoutPlans(prev => [response.data, ...prev]);
      return response;
    } catch (error) {
      setError(error.message || 'Failed to create workout plan');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getWorkoutPlanById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchWorkoutPlanById(id);
      setCurrentWorkoutPlan(response.data);
      return response;
    } catch (error) {
      setError(error.message || 'Failed to fetch workout plan');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateWorkoutPlan = async (id, planData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await updatePlan(id, planData);
      setWorkoutPlans(prev => 
        prev.map(plan => plan._id === id ? response.data : plan)
      );
      if (currentWorkoutPlan && currentWorkoutPlan._id === id) {
        setCurrentWorkoutPlan(response.data);
      }
      return response;
    } catch (error) {
      setError(error.message || 'Failed to update workout plan');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkoutPlan = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await deletePlan(id);
      setWorkoutPlans(prev => prev.filter(plan => plan._id !== id));
      if (currentWorkoutPlan && currentWorkoutPlan._id === id) {
        setCurrentWorkoutPlan(null);
      }
      return response;
    } catch (error) {
      setError(error.message || 'Failed to delete workout plan');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Workout Sessions Management
  const startWorkoutSession = async (planId, sessionData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await startSession(planId, sessionData);
      setCurrentSession(response.data);
      return response;
    } catch (error) {
      setError(error.message || 'Failed to start workout session');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logWorkoutSession = async (sessionData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await logSession(sessionData);
      setCurrentSession(response.data);
      return response;
    } catch (error) {
      setError(error.message || 'Failed to log workout session');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const endWorkoutSession = () => {
    setCurrentSession(null);
  };

  // Exercise Database Management
  const getExerciseDatabase = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchExerciseDatabase(params);
      setExercises(response.data);
      if (response.filters) {
        setFilters(response.filters);
      }
      return response;
    } catch (error) {
      setError(error.message || 'Failed to fetch exercise database');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getActiveWorkoutPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchActiveWorkoutPlans();
      return response;
    } catch (error) {
      setError(error.message || 'Failed to fetch active workout plans');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const searchExercises = async (searchTerm, filterParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchExercisesApi(searchTerm, filterParams);
      setExercises(response.data);
      return response;
    } catch (error) {
      setError(error.message || 'Failed to search exercises');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getExercisesByCategory = async (category) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchExercisesByCategory(category);
      setExercises(response.data);
      return response;
    } catch (error) {
      setError(error.message || 'Failed to fetch exercises by category');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getExercisesByMuscleGroup = async (muscleGroup) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchExercisesByMuscleGroup(muscleGroup);
      setExercises(response.data);
      return response;
    } catch (error) {
      setError(error.message || 'Failed to fetch exercises by muscle group');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getExercisesByEquipment = async (equipment) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchExercisesByEquipment(equipment);
      setExercises(response.data);
      return response;
    } catch (error) {
      setError(error.message || 'Failed to fetch exercises by equipment');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const clearError = () => setError(null);
  
  const clearWorkoutPlans = () => setWorkoutPlans([]);
  
  const clearExercises = () => setExercises([]);
  
  const clearCurrentWorkoutPlan = () => setCurrentWorkoutPlan(null);

  const value = {
    // State
    workoutPlans,
    exercises,
    currentWorkoutPlan,
    currentSession,
    loading,
    error,
    filters,
    
    // Workout Plans
    getWorkoutPlans,
    createWorkoutPlan,
    getWorkoutPlanById,
    updateWorkoutPlan,
    deleteWorkoutPlan,
    getActiveWorkoutPlans,
    
    // Workout Sessions
    startWorkoutSession,
    logWorkoutSession,
    endWorkoutSession,
    
    // Exercises
    getExerciseDatabase,
    searchExercises,
    getExercisesByCategory,
    getExercisesByMuscleGroup,
    getExercisesByEquipment,
    
    // Utility
    clearError,
    clearWorkoutPlans,
    clearExercises,
    clearCurrentWorkoutPlan
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
};