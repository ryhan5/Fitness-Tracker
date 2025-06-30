import NutritionLog from '../models/nutrition.model.js';
import mongoose from 'mongoose';

// Get daily nutrition log
export const getDailyNutritionLog = async (req, res) => {
  try {
    const userId  = req.user; // Assuming user is attached to req from auth middleware
    const { date } = req.query;
    
    const queryDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate());
    
    const log = await NutritionLog.findOrCreateDailyLog(userId, startOfDay);
    
    res.status(200).json({
      success: true,
      data: {
        ...log.toObject(),
        dailyTotals: log.dailyTotals
      }
    });
  } catch (error) {
    console.error('Error fetching daily nutrition log:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily nutrition log',
      error: error.message
    });
  }
};

// Log a meal
export const logMeal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, foods, timing } = req.body;
    
    // Validate meal type
    const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
    if (!validMealTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal type'
      });
    }

    // Validate foods array
    if (!foods || !Array.isArray(foods) || foods.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Foods array is required and cannot be empty'
      });
    }

    // Calculate total calories
    const totalCalories = foods.reduce((total, food) => total + (food.calories || 0), 0);
    
    const mealDate = timing ? new Date(timing) : new Date();
    const startOfDay = new Date(mealDate.getFullYear(), mealDate.getMonth(), mealDate.getDate());
    
    const log = await NutritionLog.findOrCreateDailyLog(userId, startOfDay);
    
    const newMeal = {
      type,
      foods: foods.map(food => ({
        name: food.name,
        quantity: food.quantity,
        unit: food.unit,
        calories: food.calories,
        macros: {
          protein: food.macros?.protein || 0,
          carbs: food.macros?.carbs || 0,
          fat: food.macros?.fat || 0,
          fiber: food.macros?.fiber || 0
        }
      })),
      totalCalories,
      timing: timing || new Date()
    };
    
    log.meals.push(newMeal);
    await log.save();
    
    res.status(201).json({
      success: true,
      message: 'Meal logged successfully',
      data: {
        meal: newMeal,
        dailyTotals: log.dailyTotals
      }
    });
  } catch (error) {
    console.error('Error logging meal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log meal',
      error: error.message
    });
  }
};

// Update a logged meal
export const updateMeal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: mealId } = req.params;
    const { type, foods, timing } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(mealId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal ID'
      });
    }

    const log = await NutritionLog.findOne({
      userId,
      'meals._id': mealId
    });
    
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }
    
    const meal = log.meals.id(mealId);
    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }
    
    // Update meal properties
    if (type) meal.type = type;
    if (timing) meal.timing = new Date(timing);
    
    if (foods && Array.isArray(foods)) {
      meal.foods = foods.map(food => ({
        name: food.name,
        quantity: food.quantity,
        unit: food.unit,
        calories: food.calories,
        macros: {
          protein: food.macros?.protein || 0,
          carbs: food.macros?.carbs || 0,
          fat: food.macros?.fat || 0,
          fiber: food.macros?.fiber || 0
        }
      }));
      
      // Recalculate total calories
      meal.totalCalories = foods.reduce((total, food) => total + (food.calories || 0), 0);
    }
    
    await log.save();
    
    res.status(200).json({
      success: true,
      message: 'Meal updated successfully',
      data: {
        meal: meal,
        dailyTotals: log.dailyTotals
      }
    });
  } catch (error) {
    console.error('Error updating meal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update meal',
      error: error.message
    });
  }
};

// Delete a meal entry
export const deleteMeal = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: mealId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(mealId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal ID'
      });
    }

    const log = await NutritionLog.findOne({
      userId,
      'meals._id': mealId
    });
    
    if (!log) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found'
      });
    }
    
    log.meals.pull({ _id: mealId });
    await log.save();
    
    res.status(200).json({
      success: true,
      message: 'Meal deleted successfully',
      data: {
        dailyTotals: log.dailyTotals
      }
    });
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete meal',
      error: error.message
    });
  }
};

// Search food database (mock implementation - integrate with real food API)
export const searchFoodDatabase = async (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }
    
    // This is a mock implementation. In production, you would integrate with:
    // - USDA FoodData Central API
    // - Nutritionix API
    // - Edamam Food Database API
    // - Or your own food database
    
    const mockFoods = [
      {
        id: '1',
        name: 'Apple',
        brand: 'Generic',
        servingSize: '1 medium',
        servingUnit: 'piece',
        calories: 95,
        macros: { protein: 0.5, carbs: 25, fat: 0.3, fiber: 4 }
      },
      {
        id: '2',
        name: 'Chicken Breast',
        brand: 'Generic',
        servingSize: '100',
        servingUnit: 'g',
        calories: 165,
        macros: { protein: 31, carbs: 0, fat: 3.6, fiber: 0 }
      },
      {
        id: '3',
        name: 'Brown Rice',
        brand: 'Generic',
        servingSize: '1',
        servingUnit: 'cup',
        calories: 216,
        macros: { protein: 5, carbs: 45, fat: 1.8, fiber: 4 }
      }
    ];
    
    const filteredFoods = mockFoods.filter(food => 
      food.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: filteredFoods,
      query: query,
      count: filteredFoods.length
    });
  } catch (error) {
    console.error('Error searching food database:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search food database',
      error: error.message
    });
  }
};

// Get diet plans (mock implementation)
export const getDietPlans = async (req, res) => {
  try {
    const { userId } = req.user;
    const { type = 'all' } = req.query;
    
    // Mock diet plans - in production, you might have these in a database
    const dietPlans = [
      {
        id: '1',
        name: 'Weight Loss Plan',
        type: 'weight_loss',
        description: 'Balanced calorie deficit plan for healthy weight loss',
        dailyCalories: 1500,
        macroSplit: { protein: 30, carbs: 40, fat: 30 },
        duration: '8 weeks',
        features: ['High protein', 'Moderate carbs', 'Healthy fats']
      },
      {
        id: '2',
        name: 'Muscle Building Plan',
        type: 'muscle_gain',
        description: 'High protein plan designed for muscle growth',
        dailyCalories: 2500,
        macroSplit: { protein: 35, carbs: 45, fat: 20 },
        duration: '12 weeks',
        features: ['Very high protein', 'Complex carbs', 'Post-workout nutrition']
      },
      {
        id: '3',
        name: 'Maintenance Plan',
        type: 'maintenance',
        description: 'Balanced nutrition for weight maintenance',
        dailyCalories: 2000,
        macroSplit: { protein: 25, carbs: 50, fat: 25 },
        duration: 'Ongoing',
        features: ['Balanced macros', 'Flexible eating', 'Sustainable habits']
      }
    ];
    
    const filteredPlans = type === 'all' ? dietPlans : dietPlans.filter(plan => plan.type === type);
    
    res.status(200).json({
      success: true,
      data: filteredPlans,
      count: filteredPlans.length
    });
  } catch (error) {
    console.error('Error fetching diet plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diet plans',
      error: error.message
    });
  }
};

// Log water intake
export const logWaterIntake = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount, date } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Water amount must be greater than 0'
      });
    }
    
    const logDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate());
    
    const log = await NutritionLog.findOrCreateDailyLog(userId, startOfDay);
    
    log.waterIntake += amount;
    await log.save();
    
    res.status(200).json({
      success: true,
      message: 'Water intake logged successfully',
      data: {
        totalWaterIntake: log.waterIntake,
        dailyGoal: log.dailyGoals.water,
        percentageComplete: Math.round((log.waterIntake / log.dailyGoals.water) * 100)
      }
    });
  } catch (error) {
    console.error('Error logging water intake:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log water intake',
      error: error.message
    });
  }
};