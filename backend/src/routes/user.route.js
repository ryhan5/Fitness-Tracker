import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  getHealthMetrics,
  updateHealthMetrics,
  getUserPreferences,
  updateUserPreferences,
  deleteUserAccount
} from '../controllers/user.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

// Get user profile
router.get('/profile', getUserProfile);

// Update user profile
router.put('/profile', updateUserProfile);

// Upload profile picture
router.post('/profile/avatar', uploadProfilePicture);

// Get health metrics
router.get('/health-metrics', getHealthMetrics);

// Update health metrics
router.put('/health-metrics', updateHealthMetrics);

// Get user preferences
router.get('/preferences', getUserPreferences);

// Update user preferences
router.put('/preferences', updateUserPreferences);

// Delete user account
router.delete('/account', deleteUserAccount);

export default router;
