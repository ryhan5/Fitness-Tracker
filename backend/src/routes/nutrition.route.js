import express from 'express';
import {
  getDailyNutritionLog,
  logMeal,
  updateMeal,
  deleteMeal,
  searchFoodDatabase,
  getDietPlans,
  logWaterIntake
} from '../controllers/nutrition.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken)

// Get daily nutrition log
router.get('/daily', getDailyNutritionLog);

// Log a meal
router.post('/meals', logMeal);

// Update a logged meal
router.put('/meals/:id', updateMeal);

// Delete a meal entry
router.delete('/meals/:id', deleteMeal);

// Search food database
router.get('/foods/search', searchFoodDatabase);

// Get diet plans
router.get('/plans', getDietPlans);

// Log water intake
router.post('/water', logWaterIntake);

export default router;
