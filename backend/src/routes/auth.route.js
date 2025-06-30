import express from 'express';
import { forgotPassword, login, logout, refreshJWT, resetPassword, signup, verifyEmail } from '../controllers/auth.controller.js';

const router = express.Router();

// User registration
router.post('/signup', signup);

// User login
router.post('/login', login);

// User logout
router.post('/logout', logout);

// Refresh JWT token
router.post('/refresh', refreshJWT);

// Password reset request
router.post('/forgot-password', forgotPassword);

// Password reset confirmation
router.post('/reset-password', resetPassword);

// Email verification
router.post('/verify-email', verifyEmail);

export default router;