import express from 'express';
import {
  getWorkoutPlans,
  createWorkoutPlan,
  getWorkoutPlanById,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  startWorkoutSession,
  logWorkoutSession,
  getExerciseDatabase
} from '../controllers/workout.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken)

// Workout Plans
router.get('/plans', getWorkoutPlans); // Get all plans
router.post('/plans', createWorkoutPlan); // Create a new plan
router.get('/plans/:id', getWorkoutPlanById); // Get a specific plan
router.put('/plans/:id', updateWorkoutPlan); // Update a plan
router.delete('/plans/:id', deleteWorkoutPlan); // Delete a plan

// Start a workout session for a plan
router.post('/plans/:id/start', startWorkoutSession);

// Log a completed workout session
router.post('/sessions', logWorkoutSession);

// Get the exercise database
router.get('/exercises', getExerciseDatabase);

export default router;
