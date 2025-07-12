import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services'; 

const NutriContext = createContext();

export const useNutri = () => {
  const context = useContext(NutriContext);
  if (!context) {
    throw new Error('useNutri must be used within a NutriProvider');
  }
  return context;
};

export const NutriProvider = ({ children }) => {
  const [nutritionLog, setNutritionLog] = useState(null);
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    water: 0
  });

  // Get daily nutrition log
  const getDailyNutritionLog = async (date) => {
    try {
      setLoading(true);
      const params = date ? { date } : {};
      const response = await api.get('/nutrition/daily', { params });
      const { data } = response.data;
      
      setNutritionLog(data);
      setDailyTotals(data.dailyTotals);
      return data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch nutrition log' };
    } finally {
      setLoading(false);
    }
  };

  // Log a meal
  const logMeal = async (mealData) => {
    try {
      setLoading(true);
      const response = await api.post('/nutrition/meals', mealData);
      const { meal, dailyTotals: newTotals } = response.data.data;
      
      // Update local state
      setNutritionLog(prev => ({
        ...prev,
        meals: [...prev.meals, meal]
      }));
      setDailyTotals(newTotals);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to log meal' };
    } finally {
      setLoading(false);
    }
  };

  // Update a logged meal
  const updateMeal = async (mealId, mealData) => {
    try {
      setLoading(true);
      const response = await api.put(`/nutrition/meals/${mealId}`, mealData);
      const { meal, dailyTotals: newTotals } = response.data.data;
      
      // Update local state
      setNutritionLog(prev => ({
        ...prev,
        meals: prev.meals.map(m => m._id === mealId ? meal : m)
      }));
      setDailyTotals(newTotals);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update meal' };
    } finally {
      setLoading(false);
    }
  };

  // Delete a meal entry
  const deleteMeal = async (mealId) => {
    try {
      setLoading(true);
      const response = await api.delete(`/nutrition/meals/${mealId}`);
      const { dailyTotals: newTotals } = response.data.data;
      
      // Update local state
      setNutritionLog(prev => ({
        ...prev,
        meals: prev.meals.filter(m => m._id !== mealId)
      }));
      setDailyTotals(newTotals);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete meal' };
    } finally {
      setLoading(false);
    }
  };

  // Search food database
  const searchFoodDatabase = async (query, limit = 10) => {
    try {
      const response = await api.get('/nutrition/foods/search', {
        params: { q: query, limit }
      });
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search food database' };
    }
  };

  // Get diet plans
  const getDietPlans = async (type = 'all') => {
    try {
      setLoading(true);
      const response = await api.get('/nutrition/plans', {
        params: { type }
      });
      setDietPlans(response.data.data);
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch diet plans' };
    } finally {
      setLoading(false);
    }
  };

  // Log water intake
  const logWaterIntake = async (waterData) => {
    try {
      setLoading(true);
      const response = await api.post('/nutrition/water', waterData);
      const { totalWaterIntake, dailyGoal, percentageComplete } = response.data.data;
      
      // Update local state
      setNutritionLog(prev => ({
        ...prev,
        waterIntake: totalWaterIntake
      }));
      setDailyTotals(prev => ({
        ...prev,
        water: totalWaterIntake
      }));
      
      return { totalWaterIntake, dailyGoal, percentageComplete };
    } catch (error) {
      throw error.response?.data || { message: 'Failed to log water intake' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    nutritionLog,
    dietPlans,
    dailyTotals,
    loading,
    getDailyNutritionLog,
    logMeal,
    updateMeal,
    deleteMeal,
    searchFoodDatabase,
    getDietPlans,
    logWaterIntake
  };

  return (
    <NutriContext.Provider value={value}>
      {children}
    </NutriContext.Provider>
  );
};