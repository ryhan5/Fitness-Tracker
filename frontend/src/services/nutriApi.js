import { apiRequest } from './apiClient';

// Get daily nutrition log
export const getDailyNutritionLog = (date) => apiRequest('/nutrition/daily', {
  method: 'GET',
  params: date ? { date } : {},
});

// Log a meal
export const logMeal = (mealData) => apiRequest('/nutrition/meals', {
  method: 'POST',
  data: mealData,
});

// Update a logged meal
export const updateMeal = (mealId, mealData) => apiRequest(`/nutrition/meals/${mealId}`, {
  method: 'PUT',
  data: mealData,
});

// Delete a meal entry
export const deleteMeal = (mealId) => apiRequest(`/nutrition/meals/${mealId}`, {
  method: 'DELETE',
});

// Search food database
export const searchFoodDatabase = (query, limit = 10) => apiRequest('/nutrition/foods/search', {
  method: 'GET',
  params: { q: query, limit },
});

// Get diet plans
export const getDietPlans = (type = 'all') => apiRequest('/nutrition/plans', {
  method: 'GET',
  params: { type },
});

// Log water intake
export const logWaterIntake = (waterData) => apiRequest('/nutrition/water', {
  method: 'POST',
  data: waterData,
});