import { apiRequest } from './apiClient';

// Workout Plans APIs
export const getWorkoutPlans = (params = {}) => apiRequest('/workout/plans', {
  method: 'GET',
  params,
});

export const createWorkoutPlan = (planData) => apiRequest('/workout/plans', {
  method: 'POST',
  data: planData,
});

export const getWorkoutPlanById = (id) => apiRequest(`/workout/plans/${id}`, {
  method: 'GET',
});

export const updateWorkoutPlan = (id, planData) => apiRequest(`/workout/plans/${id}`, {
  method: 'PUT',
  data: planData,
});

export const deleteWorkoutPlan = (id) => apiRequest(`/workout/plans/${id}`, {
  method: 'DELETE',
});

// Workout Sessions APIs
export const startWorkoutSession = (planId, sessionData) => apiRequest(`/workout/plans/${planId}/start`, {
  method: 'POST',
  data: sessionData,
});

export const logWorkoutSession = (sessionData) => apiRequest('/workout/sessions', {
  method: 'POST',
  data: sessionData,
});

// Exercise Database APIs
export const getExerciseDatabase = (params = {}) => apiRequest('/workout/exercises', {
  method: 'GET',
  params,
});

// Additional helper functions for workout management
export const getWorkoutPlansByDifficulty = (difficulty) => apiRequest('/workout/plans', {
  method: 'GET',
  params: { difficulty },
});

export const getActiveWorkoutPlans = () => apiRequest('/workout/plans', {
  method: 'GET',
  params: { isActive: true },
});

export const searchExercises = (searchTerm, filters = {}) => apiRequest('/workout/exercises', {
  method: 'GET',
  params: { search: searchTerm, ...filters },
});

export const getExercisesByCategory = (category) => apiRequest('/workout/exercises', {
  method: 'GET',
  params: { category },
});

export const getExercisesByMuscleGroup = (targetMuscle) => apiRequest('/workout/exercises', {
  method: 'GET',
  params: { targetMuscle },
});

export const getExercisesByEquipment = (equipment) => apiRequest('/workout/exercises', {
  method: 'GET',
  params: { equipment },
});