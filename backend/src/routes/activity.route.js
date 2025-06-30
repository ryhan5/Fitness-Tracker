import express from 'express';
import {
  getUserActivities,
  createActivity,
  getActivityById,
  updateActivity,
  deleteActivity,
  uploadGPSData,
  getActivityStats
} from '../controllers/activity.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken)

// Get all user activities (with pagination)
router.get('/', getUserActivities);

// Create a new activity
router.post('/', createActivity);

// Get activity statistics
router.get('/stats', getActivityStats);

// Get specific activity by ID
router.get('/:id', getActivityById);

// Update an activity
router.put('/:id', updateActivity);

// Delete an activity
router.delete('/:id', deleteActivity);

// Upload GPS data for an activity
router.post('/:id/gps', uploadGPSData);

// Get activity statistics
router.get('/stats', getActivityStats);

export default router;
