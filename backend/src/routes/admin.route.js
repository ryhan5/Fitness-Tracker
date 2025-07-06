import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getDashboardStats,
  updateUserRole,
  verifyUserEmail,
  resetUserPassword,
  bulkUpdateUsers
} from '../controllers/admin.controller.js';

const router = express.Router();

// Dashboard statistics
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.patch('/users/:userId/status', updateUserStatus);
router.patch('/users/:userId/role', updateUserRole);

// Bulk operations
router.patch('/users/bulk', bulkUpdateUsers);

export default router;