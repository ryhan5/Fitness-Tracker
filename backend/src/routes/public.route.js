import express from 'express';
import { userCount, getPublicStats } from '../controllers/public.controller.js';

const router = express.Router();

// Get total user count
router.get('/user-count', userCount);

// Get comprehensive public statistics
router.get('/stats', getPublicStats);

export default router;